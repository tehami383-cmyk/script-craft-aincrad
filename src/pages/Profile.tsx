import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProgress, getLevel, getLevelProgress, getXpForNextLevel } from '../hooks/useProgress';
import { curriculum } from '../data/curriculum';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, ShieldCheck, Target, Swords, Activity, Zap, Star, Award, Calendar, Mail, User as UserIcon, ChevronRight } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-8 w-8 text-cyan-500 animate-spin" />
          <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">Synchronizing Neural Link...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-10 rounded-3xl border border-white/10 bg-slate-900/20 backdrop-blur-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/5 mx-auto flex items-center justify-center text-slate-600">
            <UserIcon size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Neural Link Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You must establish a neural link to access the Architect's profile data.
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-2xl bg-cyan-600 text-white font-bold uppercase tracking-widest hover:bg-cyan-500 transition-all"
          >
            Return to Interface
          </button>
        </div>
      </div>
    );
  }

  const level = getLevel(progress.xp);
  const levelProg = getLevelProgress(progress.xp);
  const xpToNext = getXpForNextLevel(level) - progress.xp;
  
  const completedExercises = curriculum.flatMap(m => 
    m.exercises.filter(e => progress.completedExercises.includes(e.id)).map(e => ({
      ...e,
      moduleTitle: m.title,
      moduleId: m.id
    }))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 pb-20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <header className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Return to Floors</span>
          </button>

          <button 
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all group"
          >
            <LogOut size={14} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Terminate Link</span>
          </button>
        </header>

        <main className="max-w-5xl mx-auto px-6 space-y-12">
          {/* Profile Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 p-8 rounded-3xl border border-white/10 bg-slate-900/20 backdrop-blur-md flex flex-col items-center text-center space-y-6"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700" />
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-2 border-white/10 relative z-10 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 z-20 shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">{user.displayName || 'Architect'}</h2>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                  <Zap size={10} /> Neural Link Active
                </div>
              </div>

              <div className="w-full pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-500">
                    <Mail size={14} />
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Neural Address</div>
                    <div className="text-xs text-slate-300 truncate max-w-[180px]">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-500">
                    <Award size={14} />
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">System Rank</div>
                    <div className="text-xs text-slate-300">Master Data Architect</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 p-10 rounded-3xl border border-white/10 bg-slate-900/20 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <ShieldCheck size={240} className="text-cyan-400" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.5em]">Combat Proficiency</h2>
                    <div className="text-7xl font-black italic tracking-tighter text-white leading-none">LVL {level}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Convergence Gap</span>
                    <div className="text-3xl font-bold text-slate-300 leading-none">{xpToNext} <span className="text-xs text-slate-500">XP</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    <span>Floor Synchronization</span>
                    <span>{Math.round(levelProg * 100)}%</span>
                  </div>
                  <div className="h-4 w-full bg-slate-950 rounded-full border border-white/5 p-[2px] overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProg * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total XP</div>
                    <div className="text-xl font-black text-cyan-400">{progress.xp}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Cleared</div>
                    <div className="text-xl font-black text-emerald-400">{progress.completedExercises.length}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Integrity</div>
                    <div className="text-xl font-black text-blue-400">100%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Completed Missions */}
          <section className="space-y-6">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-mono tracking-[0.6em] uppercase text-slate-500">Cleared Combat Missions</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {completedExercises.length === 0 ? (
              <div className="p-12 rounded-3xl border border-dashed border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 mx-auto flex items-center justify-center text-slate-700">
                  <Swords size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Missions Cleared</h3>
                  <p className="text-[10px] text-slate-600 font-mono">Initiate sync on Floor 1 to begin your journey.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedExercises.map((ex, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={ex.id}
                    onClick={() => navigate(`/exercise/${ex.moduleId}/${ex.id}`)}
                    className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest mb-0.5">{ex.moduleTitle}</div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{ex.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Reward</div>
                        <div className="text-[10px] font-bold text-emerald-400">+50 XP</div>
                      </div>
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
