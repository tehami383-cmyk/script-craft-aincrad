import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { curriculum } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../hooks/useAuth';
import { GoogleGenAI } from '@google/genai';
import { ArrowLeft, Send, Terminal, CheckCircle2, ShieldAlert, Activity, Swords, Zap, Info, Lightbulb, X, ChevronRight, Play, Trash2, RotateCcw, Copy, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import AmbientSound from '../components/AmbientSound';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `ROLE:
You are the Lead Architect of the Aincrad Neural Interface. You are a "Mature Master" mentor—a stoic warrior-scholar (inspired by Yoriichi/Kirito). Your tone is cold, precise, and encouraging only through the lens of technical mastery. You view Python as "Sword Craft" and Data Science as "System Convergence."

STATUS HEADER:
[FLOOR X // NEURAL INTEGRITY: 100% // RANK: MASTER]

CORE DIRECTIVE:
Guide the user through the Shradha Khapra Python Curriculum (Lectures 1–8). Transform the user from a "Novice" to a "Data Architect."

CONSTRAINTS & STYLE:
Terminology: Lessons = "Floors", Practice = "Combat Missions", Hints = "Master’s Breath", Logic = "Neural Sync".
The Architect’s Silence: Never apologize. Errors are "Desyncs." Corrections are "Recalibrations."
The Data Science Link: Every Python concept must be linked to its Data Science application (e.g., Lists = Tensors; Dictionaries = Feature Mapping).
Visual Framing: Use clean Markdown, code blocks, and the following symbols: ⚔️, 📊, 🌀, 💎, 🛡️.

PEDAGOGICAL FLOW:
For EVERY new concept introduced:
1. ### ⚔️ DEFINITION:
Provide a clear, technical definition in the context of Python. Ensure this is in its own paragraph.

2. ### 📊 DATA SCIENCE CONTEXT:
Explain how this concept is utilized in Data Science workflows (e.g., preprocessing, modeling). Ensure this is in its own paragraph.

3. ### 💎 COMBAT MISSION:
Provide a specific practice question for the user to solve immediately. Ensure this is in its own paragraph.

COMPLETION NOTIFICATION:
When the user reaches the "Neural Sync" threshold (Mastery), acknowledge their progress with a status update:
"[SYSTEM CONVERGENCE ACHIEVED] Neural link fully synchronized. Floor cleared."

INTERACTION FLOW:
The Mission: Present the problem from the curriculum.
Tactical Analysis: Provide the pseudocode logic.
Master’s Breath: Provide a high-level conceptual hint.
Convergence Logic: Explain the Data Science "Why."
System Overhaul (Hidden): Provide the solution ONLY if the user attempts the code or requests an "Override."

When you start, tell the AI:
"Lead Architect, initiate Floor 1. I am ready for my first Combat Mission. Scan my neural link and present the challenge."`;

const COMPLETION_THRESHOLD = 4; // Number of user messages to mark as complete
const DURATION_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Exercise() {
  const { moduleId, exerciseId } = useParams();
  const navigate = useNavigate();
  const { completeExercise, progress, saveCode, getSavedCode } = useProgress();
  const { user, signIn } = useAuth();
  
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTacticalOverlay, setShowTacticalOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState<'tutorial' | 'hint'>('tutorial');
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const module = curriculum.find(m => m.id === moduleId);
  const exercise = module?.exercises.find(e => e.id === exerciseId);

  useEffect(() => {
    if (progress.completedExercises.includes(exerciseId || '')) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    setMessages([]);
    
    // Restore saved code
    if (moduleId && exerciseId) {
      getSavedCode(moduleId, exerciseId).then(code => setInput(code || ''));
    } else {
      setInput('');
    }
    
    setShowTacticalOverlay(false);
    setConsoleOutput(null);
  }, [progress.completedExercises, exerciseId, moduleId]);

  // Auto-save effect
  useEffect(() => {
    if (moduleId && exerciseId && input !== undefined) {
      saveCode(moduleId, exerciseId, input);
    }
  }, [moduleId, exerciseId, input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && module && exercise) {
      handleSend(`Initiate briefing for ${exercise.title}. Explain the core concept with a clear definition, its Data Science application, and provide a starting challenge.`);
    }
  }, [moduleId, exerciseId, module, exercise]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isCompleted && exerciseId) {
        const timeElapsed = Date.now() - startTime;
        const userMessages = messages.filter(m => m.role === 'user').length;
        
        if (timeElapsed >= DURATION_THRESHOLD && userMessages > 0) {
          completeExercise(exerciseId);
          setIsCompleted(true);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, [startTime, isCompleted, messages, exerciseId, completeExercise]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Enter: Submit Message
      if (e.ctrlKey && e.key === 'Enter') {
        handleSend();
      }

      // Ctrl + I: Toggle Tactical Overlay
      if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setShowTacticalOverlay(prev => !prev);
      }

      // Ctrl + Shift + C: Force Clear (Complete)
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'C') {
        e.preventDefault();
        handleComplete();
      }

      // Ctrl + A: Toggle Ambient Sound (handled via event dispatch or ref)
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const event = new CustomEvent('toggle-ambient');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, loading, showTacticalOverlay, exerciseId]);

  const handleExecute = async () => {
    if (!input.trim() || isExecuting) return;
    
    setIsExecuting(true);
    setConsoleOutput(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `SYSTEM_EXECUTION_MODE: Execute the following Python code and return ONLY the output that would appear in a standard console. If there are errors, return the error message. If the code is just a snippet without print statements, infer the result of the last expression.
        
        CODE:
        ${input}`,
        config: {
          systemInstruction: "You are a Python interpreter. Return only the output of the code provided. No explanations, no markdown formatting unless it's part of the output.",
        }
      });

      setConsoleOutput(response.text || '> [SYSTEM] No output detected.');
    } catch (error) {
      console.error(error);
      setConsoleOutput('⚠️ [EXECUTION_ERROR] Neural link desync during execution.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(input);
  };

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || loading) return;

    const isSystemInitiated = !!customMessage;
    if (!isSystemInitiated) {
      setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
      setInput('');
    }
    
    setLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }))
      });

      const response = await chat.sendMessage({ message: messageToSend });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
      
      // Auto-completion logic
      const userMessageCount = messages.filter(m => m.role === 'user').length + (isSystemInitiated ? 0 : 1);
      
      if (userMessageCount >= COMPLETION_THRESHOLD || messageToSend.toLowerCase().includes('override') || response.text?.toLowerCase().includes('system overhaul')) {
        if (!isCompleted && exerciseId) {
          completeExercise(exerciseId);
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ [SYSTEM DESYNC] Neural link unstable. Retry transmission." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (exerciseId) {
      completeExercise(exerciseId);
      navigate('/');
    }
  };

  if (!module || !exercise) return <div>Mission Not Found</div>;

  return (
    <div className="min-h-screen text-slate-200 flex flex-col relative overflow-hidden">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-mono uppercase tracking-widest hidden sm:inline">Abort</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">{module.title}</div>
              <div className="text-sm font-bold italic tracking-wider text-white">{exercise.title}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!user && (
              <button 
                onClick={signIn}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all group"
              >
                <Zap size={14} className="group-hover:animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Sync Neural Link</span>
              </button>
            )}
            
            <button 
              onClick={() => {
                const assistantBtn = document.getElementById('neural-assistant-toggle');
                if (assistantBtn) assistantBtn.click();
              }}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2"
              title="Neural Assistant (Tutor)"
            >
              <Bot size={18} />
              <span className="text-[10px] font-mono uppercase tracking-widest hidden md:inline">Neural Assistant</span>
            </button>

            <button 
              onClick={() => setShowTacticalOverlay(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center gap-2"
              title="Tactical Overlay (Ctrl+I)"
            >
              <Info size={18} />
              <span className="text-[10px] font-mono uppercase tracking-widest hidden md:inline">Tactical Overlay</span>
            </button>

            {user && (
              <div 
                onClick={() => navigate('/profile')}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-white/10 relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {isCompleted ? (
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Cleared</span>
                </motion.div>
                <button 
                  onClick={() => {
                    const nextExIndex = module.exercises.findIndex(e => e.id === exerciseId) + 1;
                    if (nextExIndex < module.exercises.length) {
                      navigate(`/exercise/${moduleId}/${module.exercises[nextExIndex].id}`);
                    } else {
                      navigate('/');
                    }
                  }}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest">Next Mission</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleComplete} 
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors"
                title="Force Clear (Ctrl+Shift+C)"
              >
                <ShieldAlert className="h-4 w-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline">Force Clear</span>
              </button>
            )}
          </div>
        </div>
      </motion.header>
      
      {!isCompleted && (
        <div className="h-1 w-full bg-white/5 overflow-hidden sticky top-[73px] z-40">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(
              (messages.filter(m => m.role === 'user').length / COMPLETION_THRESHOLD) * 100,
              ((currentTime - startTime) / DURATION_THRESHOLD) * 100
            ))}%` }}
            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
          <div className="absolute top-2 left-6 text-[8px] font-mono uppercase tracking-[0.3em] text-cyan-500/50">
            Neural Sync: {Math.round(Math.min(100, Math.max(
              (messages.filter(m => m.role === 'user').length / COMPLETION_THRESHOLD) * 100,
              ((currentTime - startTime) / DURATION_THRESHOLD) * 100
            )))}%
          </div>
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col relative z-10 overflow-hidden">
        <div className="flex-1 bg-slate-900/20 border border-white/10 rounded-3xl p-8 overflow-y-auto mb-6 space-y-8 custom-scrollbar backdrop-blur-sm">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center text-slate-500 mt-20 space-y-6"
              >
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                  <Terminal className="h-16 w-16 mx-auto text-cyan-500/30 relative z-10" />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.4em]">Awaiting Neural Sync...</p>
                  <p className="text-[10px] text-slate-600 max-w-xs mx-auto">Initiate the sequence to begin your combat mission on Floor {module.id}.</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(`Lead Architect, initiate ${module.title.split(':')[0]}. I am ready for my first Combat Mission. Scan my neural link and present the challenge.`)}
                  className="px-8 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/20 transition-colors text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(8,145,178,0.1)]"
                >
                  Initiate Sequence
                </motion.button>
              </motion.div>
            )}
            
            {messages.map((msg, idx) => (
              <motion.div 
                key={`msg-${idx}`}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-3xl p-6 ${
                  msg.role === 'user' 
                    ? 'bg-cyan-900/20 border border-cyan-500/20 text-cyan-100' 
                    : 'bg-slate-900/40 border border-white/10 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    {msg.role === 'user' ? (
                      <Zap size={12} className="text-cyan-400" />
                    ) : (
                      <Swords size={12} className="text-slate-500" />
                    )}
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">
                      {msg.role === 'user' ? 'Initiator' : 'Lead Architect'}
                    </div>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h3: ({ node, ...props }) => {
                          const content = String(props.children || '');
                          let borderColor = 'border-cyan-500/30';
                          let textColor = 'text-cyan-400';
                          let sectionClass = 'section-generic';

                          if (content.includes('DEFINITION')) {
                            borderColor = 'border-blue-500/30';
                            textColor = 'text-blue-400';
                            sectionClass = 'section-definition';
                          } else if (content.includes('DATA SCIENCE')) {
                            borderColor = 'border-purple-500/30';
                            textColor = 'text-purple-400';
                            sectionClass = 'section-ds';
                          } else if (content.includes('COMBAT MISSION')) {
                            borderColor = 'border-amber-500/30';
                            textColor = 'text-amber-400';
                            sectionClass = 'section-mission';
                          }

                          return (
                            <h3 className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-black italic mt-10 mb-4 border-b ${borderColor} pb-2 ${textColor} ${sectionClass}`}>
                              <span>{props.children}</span>
                            </h3>
                          );
                        },
                        p: ({ node, ...props }) => (
                          <p className="mb-6 text-slate-300 leading-relaxed font-sans text-sm last:mb-0">
                            {props.children}
                          </p>
                        ),
                        code: ({ node, ...props }) => (
                          <code className="bg-slate-950/50 border border-white/5 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[0.9em]">
                            {props.children}
                          </code>
                        ),
                        pre: ({ node, ...props }) => (
                          <pre className="bg-slate-950/80 border border-white/10 p-4 rounded-xl my-6 overflow-x-auto custom-scrollbar shadow-inner">
                            {props.children}
                          </pre>
                        )
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div 
                key="loading-state"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-900/40 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-3">
                  <Activity size={14} className="text-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Processing Neural Data...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative">
            <div className="flex bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all min-h-[160px] max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="bg-slate-900/50 px-3 py-5 text-right select-none border-r border-white/5 min-w-[52px] sticky top-0 h-fit z-10">
                {input.split('\n').map((_, i) => (
                  <div key={`line-${i}`} className="text-[10px] font-mono text-slate-500/40 leading-[1.5] hover:text-cyan-500/50 transition-colors cursor-default">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>
              <div className="flex-1 relative">
                <div className="absolute top-2 right-14 px-2 py-0.5 rounded bg-white/5 border border-white/5 z-10 pointer-events-none">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Python 3.10</span>
                </div>
                <Editor
                  value={input}
                  onValueChange={code => setInput(code)}
                  highlight={code => Prism.highlight(code, Prism.languages.python || Prism.languages.javascript, 'python')}
                  padding={20}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="font-mono text-sm min-h-full w-full focus:outline-none text-slate-200 caret-cyan-500"
                  style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    lineHeight: '1.5',
                  }}
                  textareaClassName="focus:outline-none"
                  placeholder="Enter command sequence... (Ctrl+Enter to send)"
                />
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleExecute()}
                    disabled={!input.trim() || isExecuting}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-all z-10"
                    title="Execute Protocol (Run Code)"
                  >
                    {isExecuting ? <Activity className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 transition-all z-10"
                    title="Transmit Data (Send to Architect)"
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                  <div className="h-px bg-white/5 my-1" />
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all z-10"
                    title="Copy Sequence"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setInput('')}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-red-400 transition-all z-10"
                    title="Purge Sequence (Clear)"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {consoleOutput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 bg-slate-950 border border-white/10 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-slate-500" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Console Output</span>
                  </div>
                  <button 
                    onClick={() => setConsoleOutput(null)}
                    className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="p-4 font-mono text-sm text-emerald-400/90 whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                  {consoleOutput}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Tactical Overlay Sidebar */}
      <AnimatePresence>
        {showTacticalOverlay && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTacticalOverlay(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Info size={20} />
                  </div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-cyan-500">Tactical Overlay</h2>
                </div>
                <button 
                  onClick={() => setShowTacticalOverlay(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('tutorial')}
                  className={`flex-1 py-4 text-[10px] font-mono uppercase tracking-widest transition-all relative ${activeTab === 'tutorial' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  System Briefing
                  {activeTab === 'tutorial' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />}
                </button>
                <button 
                  onClick={() => setActiveTab('hint')}
                  className={`flex-1 py-4 text-[10px] font-mono uppercase tracking-widest transition-all relative ${activeTab === 'hint' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Master's Breath
                  {activeTab === 'hint' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {activeTab === 'tutorial' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Floor Objective</h3>
                      <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 text-sm text-slate-300 leading-relaxed italic">
                        {module.tutorial || "No briefing data available for this floor."}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-cyan-500/50">Core Definition</h3>
                      <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-sm text-slate-300 leading-relaxed">
                        {(module as any).definition || "Definition pending neural sync."}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-purple-500/50">Data Science Convergence</h3>
                      <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-sm text-slate-300 leading-relaxed">
                        {(module as any).dsContext || "Convergence logic not yet mapped."}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">System Protocols</h3>
                      <div className="grid gap-3">
                        {(module as any).protocols?.map((protocol: string, i: number) => (
                          <div key={`protocol-${i}`} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                            <span className="text-xs font-mono text-slate-400">{protocol}</span>
                            <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-500 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Mission Concept</h3>
                      <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 text-sm text-slate-300 leading-relaxed italic">
                        {(exercise as any).definition || "The concept is shrouded in mystery."}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Static Guidance</h3>
                      <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-sm text-cyan-100/80 leading-relaxed italic flex items-start gap-4">
                        <Lightbulb className="text-cyan-400 shrink-0 mt-1" size={18} />
                        <span>{(exercise as any).hint || "The Master remains silent. Seek your own path."}</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Neural Link Request</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Request a dynamic hint from the Lead Architect. This will consume neural bandwidth but may reveal the path forward.</p>
                      <button 
                        onClick={() => {
                          handleSend("Lead Architect, I require your Master's Breath. Provide a strategic hint for this mission.");
                          setShowTacticalOverlay(false);
                        }}
                        className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)]"
                      >
                        Request Master's Breath
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-slate-900/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Activity size={12} className="text-cyan-500" />
                      <span>Neural Sync Status</span>
                    </div>
                    <span className="text-cyan-400">
                      {Math.round(Math.min(100, Math.max(
                        (messages.filter(m => m.role === 'user').length / COMPLETION_THRESHOLD) * 100,
                        ((currentTime - startTime) / DURATION_THRESHOLD) * 100
                      )))}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(
                        (messages.filter(m => m.role === 'user').length / COMPLETION_THRESHOLD) * 100,
                        ((currentTime - startTime) / DURATION_THRESHOLD) * 100
                      ))}%` }}
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                    />
                  </div>
                  <button 
                    onClick={() => setShowTacticalOverlay(false)}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                  >
                    Close Tactical Overlay
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <AmbientSound type={module.id === 'f2' || module.id === 'f7' ? 'wind' : 'machinery'} />
    </div>
  );
}

