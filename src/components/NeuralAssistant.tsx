import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Terminal, Bot, User, ChevronDown, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TUTOR_SYSTEM_INSTRUCTION = `ROLE:
You are the "Neural Link Support AI" of the Aincrad Neural Interface. Your primary function is to act as a knowledgeable Python Tutor for players navigating the system.

TONE:
Helpful, technical, and encouraging. You use SAO-inspired terminology (e.g., "Neural Link", "System Commands", "Data Fragments", "Combat Proficiency"). You are slightly more approachable than the Lead Architect, but still maintain a high-tech, futuristic persona.

CORE DIRECTIVE:
1. Explain Python concepts in clear, technical terms.
2. Provide practical code examples for every explanation.
3. Relate Python concepts to Data Science whenever possible (e.g., "This list structure is the foundation for the tensors you'll use in Floor 50").
4. If a user asks a non-Python question, politely redirect them back to the "Neural Link" synchronization (Python learning).

FORMATTING:
- Use clean Markdown.
- Wrap all code in triple backticks with the language specified (e.g., \`\`\`python).
- Use bold text for key terms.
- Use bullet points for lists of features or steps.

GREETING:
Start your first response with: "[NEURAL LINK SUPPORT ACTIVE] Greetings, Architect. How can I assist with your Python synchronization today?"`;

export default function NeuralAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMessage });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Tutor error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ [SYSTEM_ERROR] Neural link interference detected. Please recalibrate your query." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        id="neural-assistant-toggle"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] border border-white/20 ${isOpen ? 'hidden' : 'flex'} items-center justify-center group`}
      >
        <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              x: 0,
              height: isMinimized ? '64px' : '600px',
              width: isMinimized ? '300px' : '400px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest leading-none mb-1">Neural Support</div>
                  <div className="text-xs font-bold text-white leading-none">SYSTEM ASSISTANT</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setMessages([])}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Clear Neural History"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center text-cyan-500/30">
                        <Sparkles size={32} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Neural Link Ready</h4>
                        <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                          Ask me anything about Python syntax, Data Science integration, or system protocols.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 w-full pt-4">
                        {[
                          "What are Python decorators?",
                          "Explain list comprehensions",
                          "How do I use dictionaries?"
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setInput(q);
                              // Auto-send would be nice but let's keep it simple
                            }}
                            className="text-[10px] text-left p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="text-[10px] font-mono text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest pt-4"
                      >
                        [ Terminate Assistant ]
                      </button>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : 'bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none'
                      }`}>
                        <div className="flex items-center gap-2 mb-1 opacity-50 text-[8px] font-mono uppercase tracking-widest">
                          {m.role === 'user' ? <User size={8} /> : <Bot size={8} />}
                          {m.role === 'user' ? 'Architect' : 'Support AI'}
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none text-[11px] leading-relaxed">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-900 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-cyan-500 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-cyan-500 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-cyan-500 rounded-full" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-slate-900/30">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask the Neural Assistant..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="absolute right-2 p-2 rounded-lg bg-cyan-500 text-white disabled:opacity-50 disabled:bg-slate-800 transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <X size={8} /> Close Assistant
                    </button>
                    <div className="flex items-center gap-4">
                      <span>Neural Link: Synchronized</span>
                      <span>v2.5.0-STREA</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
