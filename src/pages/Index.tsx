import { useNavigate } from 'react-router-dom';
import { curriculum, BADGES } from '../data/curriculum';
import { useProgress, getLevel, getLevelProgress, getXpForNextLevel } from '../hooks/useProgress';
import { useAuth } from '../hooks/useAuth';
import { 
  Lock, Check, ArrowRight, LogOut, Swords, Target, Activity, Zap, 
  ShieldCheck, Star, Info, Bot, Sparkles, Database, GitBranch, 
  Cpu, Filter, RefreshCw, LayoutGrid, Scroll, Crown, Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import projectsData from '../data/projects.json';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Game': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Utility': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Calculator': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Converter': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Finance': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Security': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'API/Integration': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const getDifficultyColor = (diff: string) => {
  switch(diff) {
    case 'Beginner': return 'text-emerald-400';
    case 'Intermediate': return 'text-amber-400';
    case 'Advanced': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const ModuleIcon = ({ id, className }: { id: string; className?: string }) => {
  switch (id) {
    case 'f1': return <Database className={className} />;
    case 'f2': return <GitBranch className={className} />;
    case 'f3': return <Cpu className={className} />;
    case 'f4': return <Filter className={className} />;
    case 'f5': return <RefreshCw className={className} />;
    case 'f6': return <LayoutGrid className={className} />;
    case 'f7': return <Scroll className={className} />;
    case 'f8': return <Crown className={className} />;
    default: return <Swords className={className} />;
  }
};

export default function Index() {
  const navigate = useNavigate();
  const { progress, isModuleUnlocked, getModuleProgress } = useProgress();
  const { user, signIn, signOut } = useAuth();
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  
  const level = getLevel(progress.xp);
  const levelProg = getLevelProgress(progress.xp);
  const xpToNext = getXpForNextLevel(level) - progress.xp;
  const totalExercises = curriculum.flatMap(m => m.exercises).length;
  const completedCount = progress.completedExercises.length;

  const handleStartModule = (moduleId: string) => {
    const mod = curriculum.find(m => m.id === moduleId);
    if (!mod) return;
    const firstIncomplete = mod.exercises.find(e => !progress.completedExercises.includes(e.id));
    const target = firstIncomplete || mod.exercises[0];
    navigate(`/exercise/${moduleId}/${target.id}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500/30">
      <div className="relative z-10">
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl sticky top-0 z-50"
        >
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-tr from-red-600/20 to-cyan-500/20 rounded-full blur-md group-hover:blur-xl transition duration-700" />
                <div className="relative w-16 h-16 rounded-full border border-white/10 bg-slate-900 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-400 group-hover:text-white transition-colors duration-500">
                    <path fill="currentColor" d="M50 15c-5.5 0-10 4.5-10 10 0 3.3 1.6 6.2 4 8.1v2.9c-8.3 1.2-15 8.4-15 17v5h5v15l5-2v2l5-2v2l5-2v-32.9c2.4-1.9 4-4.8 4-8.1 0-5.5-4.5-10-10-10z" />
                    <path stroke="#ef4444" strokeWidth="2" strokeLinecap="round" d="M35 85 l30 -30" />
                  </svg>
                </div>
              </motion.div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">
                  <span className="text-cyan-400">SCRIPT</span> <span className="text-slate-100">CRAFT</span>
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-cyan-500/50 font-mono tracking-[0.3em] uppercase">
                  <Activity className="h-3 w-3" /> Floor {level} // Neural Integrity: 100%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">{user.displayName || 'Architect'}</div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">Neural Link: Active</div>
                  </div>
                  <div 
                    onClick={() => navigate('/profile')}
                    className="relative group cursor-pointer"
                  >
                    <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img 
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border border-white/10 relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button 
                    onClick={signOut} 
                    className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    title="Terminate Neural Link (Sign Out)"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={signIn}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all group"
                >
                  <Zap className="h-4 w-4 group-hover:animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Establish Neural Link</span>
                </button>
              )}
            </div>
          </div>
        </motion.header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            <div className="lg:col-span-2 p-10 rounded-3xl border border-white/10 bg-slate-900/20 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={180} className="text-cyan-400" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.5em]">Combat Proficiency</h2>
                    <div className="text-6xl font-black italic tracking-tighter text-white">RANK {level}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Convergence Gap</span>
                    <div className="text-2xl font-bold text-slate-300">{xpToNext} <span className="text-xs text-slate-500">XP</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 w-full bg-slate-950 rounded-full border border-white/5 p-[2px] overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProg * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.div 
                whileHover={{ x: 10 }}
                onClick={() => navigate('/leaderboard')}
                className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center justify-between group hover:border-amber-500/30 hover:bg-amber-500/5 cursor-pointer transition-all"
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Global Rankings</div>
                  <div className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">View Leaderboard</div>
                </div>
                <Trophy className="text-amber-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div 
                whileHover={{ x: 10 }}
                className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center justify-between group hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Accumulated XP</div>
                  <div className="text-3xl font-black text-white">{progress.xp}</div>
                </div>
                <Target className="text-cyan-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div 
                whileHover={{ x: 10 }}
                className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center justify-between group hover:border-orange-500/30 transition-all"
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Bosses Terminated</div>
                  <div className="text-3xl font-black text-white">{completedCount}/{totalExercises}</div>
                </div>
                <Swords className="text-orange-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>
          </motion.section>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-mono tracking-[0.6em] uppercase text-slate-500">Aincrad System Floors</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {/* Neural Support Card */}
              <motion.div
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm hover:border-cyan-500/60 cursor-pointer overflow-hidden"
                onClick={() => {
                  const assistantBtn = document.getElementById('neural-assistant-toggle');
                  if (assistantBtn) assistantBtn.click();
                }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-400">
                      <Bot size={24} />
                    </div>
                    <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Neural Support</h3>
                  <p className="text-[11px] text-slate-400 italic mb-8 leading-relaxed">
                    Access the system's knowledge base. Ask any Python question to the Neural Assistant.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    <Activity size={12} />
                    <span>System Online</span>
                  </div>
                </div>
              </motion.div>

              {curriculum.map((mod) => {
                const unlocked = isModuleUnlocked(mod.id);
                const modProgress = getModuleProgress(mod.id);
                const completed = modProgress === 1;

                return (
                  <motion.div
                    key={mod.id}
                    variants={item}
                    whileHover={unlocked ? { y: -5, scale: 1.02 } : {}}
                    onMouseEnter={() => unlocked && setHoveredFloor(mod.id)}
                    onMouseLeave={() => setHoveredFloor(null)}
                    onClick={() => unlocked && handleStartModule(mod.id)}
                    className={`group relative p-8 rounded-2xl border transition-all duration-500 ${
                      unlocked
                        ? 'border-white/10 bg-slate-900/20 backdrop-blur-sm hover:border-cyan-500/40 cursor-pointer'
                        : 'border-white/5 bg-slate-950/40 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    <AnimatePresence>
                      {hoveredFloor === mod.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute inset-0 z-20 p-6 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-cyan-500/30 flex flex-col justify-center text-center space-y-4"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">{mod.theme}</div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={`star-${i}`} 
                                  size={10} 
                                  className={i < (mod as any).difficulty ? "text-cyan-400 fill-cyan-400" : "text-slate-800"} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            {mod.description}
                          </p>
                          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                            <Zap size={12} />
                            <span>Initiate Sync</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-8">
                        <div className={`p-4 rounded-xl bg-slate-950 border ${unlocked ? 'border-cyan-500/20 text-cyan-400' : 'border-white/5 text-slate-700'}`}>
                          <ModuleIcon id={mod.id} className="w-6 h-6" />
                        </div>
                        {unlocked ? (
                          completed ? <Check className="h-6 w-6 text-emerald-400" /> : <ArrowRight className="h-5 w-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        ) : (
                          <Lock className="h-4 w-4 text-slate-700" />
                        )}
                      </div>

                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-100 mb-2">{mod.title}</h3>
                      <p className="text-[11px] text-slate-500 italic mb-8 line-clamp-2 leading-relaxed">{mod.description}</p>
                      
                      <div className="mt-auto space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                          <span className={completed ? 'text-emerald-400' : 'text-slate-500'}>
                            {completed ? 'Cleared' : 'Progress'}
                          </span>
                          <span className={completed ? 'text-emerald-400' : 'text-cyan-400'}>
                            {Math.round(modProgress * 100)}%
                          </span>
                        </div>
                        <div className="flex gap-1 h-1.5 w-full">
                          {mod.exercises.map((ex, i) => {
                            const isCompleted = progress.completedExercises.includes(ex.id);
                            return (
                              <div key={ex.id} className="flex-1 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: isCompleted ? '100%' : '0%' }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                  className={`h-full ${completed ? 'bg-emerald-500' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`} 
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="mt-24 space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-mono tracking-[0.6em] uppercase text-slate-500">Python Projects Catalog</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projectsData.map((project) => (
                <motion.div 
                  key={project.id} 
                  variants={item}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-2xl border border-white/10 bg-slate-900/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all flex flex-col h-full group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 flex-1 italic leading-relaxed">{project.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Difficulty</span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

