import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProgress, getLevel, getLevelProgress, getXpForNextLevel } from '../hooks/useProgress';
import { curriculum, BADGES } from '../data/curriculum';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, ShieldCheck, Target, Swords, Activity, Zap, Star, Award, Calendar, Mail, User as UserIcon, ChevronRight, ChevronDown, Check, Hexagon, Lock, Camera, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, updateProfile, doc, updateDoc } from '../firebase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size (e.g., max 5MB)
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(`profile_pictures/${user.uid}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const photoURL = await getDownloadURL(storageRef);
      
      // Update user profile in Firebase Auth
      await updateProfile(user, { photoURL });
      
      // Update user document in Firestore
      const userDocRef = doc('users', user.uid);
      await updateDoc(userDocRef, { photoURL });
      
      // Update leaderboard document in Firestore
      const leaderboardRef = doc('leaderboard', user.uid);
      await updateDoc(leaderboardRef, { photoURL });
      
      // Force a reload to reflect the new image (or you could update local state)
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
  
  const groupedExercises = curriculum.reduce((acc, mod) => {
    const completedInModule = mod.exercises.filter(e => progress.completedExercises.includes(e.id));
    if (completedInModule.length > 0) {
      acc.push({
        moduleId: mod.id,
        moduleTitle: mod.title,
        exercises: completedInModule
      });
    }
    return acc;
  }, [] as { moduleId: string, moduleTitle: string, exercises: any[] }[]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const earnedBadges = curriculum.map(mod => {
    const isEarned = mod.exercises.every(ex => progress.completedExercises.includes(ex.id));
    return {
      id: mod.id,
      name: BADGES[mod.id as keyof typeof BADGES],
      theme: mod.theme,
      isEarned
    };
  });

  const skillNodes = curriculum.map((mod, index) => {
    const isCompleted = mod.exercises.every(ex => progress.completedExercises.includes(ex.id));
    const isUnlocked = index === 0 ? true : curriculum[index - 1].exercises.every(ex => progress.completedExercises.includes(ex.id));
    return { ...mod, isCompleted, isUnlocked };
  });

  const highestCompletedIndex = [...skillNodes].reverse().findIndex(n => n.isCompleted);
  const actualHighestCompletedIndex = highestCompletedIndex === -1 ? -1 : skillNodes.length - 1 - highestCompletedIndex;
  const progressPercentage = Math.min(100, Math.max(0, ((actualHighestCompletedIndex + 1) / (skillNodes.length - 1)) * 100));

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
              <div className="relative group cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700" />
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt="Profile" 
                  className={`w-32 h-32 rounded-full border-2 border-white/10 relative z-10 shadow-2xl object-cover transition-opacity ${uploading ? 'opacity-50' : 'group-hover:opacity-80'}`}
                  referrerPolicy="no-referrer"
                />
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? (
                    <Activity className="w-8 h-8 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                      <Camera size={20} />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 z-30 shadow-lg">
                  <ShieldCheck size={20} />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
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

          {/* Neural Badges / Achievements */}
          <section className="space-y-6">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-mono tracking-[0.6em] uppercase text-slate-500">Neural Badges</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative p-6 rounded-2xl border flex flex-col items-center text-center gap-4 transition-all ${
                    badge.isEarned 
                      ? 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/50 hover:bg-cyan-500/10' 
                      : 'border-white/5 bg-slate-900/40 opacity-50 grayscale'
                  }`}
                >
                  {badge.isEarned && (
                    <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity" />
                  )}
                  
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                    badge.isEarned ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-900 border border-slate-700 text-slate-600'
                  }`}>
                    {badge.isEarned ? <Hexagon size={32} /> : <Lock size={24} />}
                  </div>
                  
                  <div className="space-y-1 relative z-10">
                    <div className={`text-[8px] font-mono uppercase tracking-widest ${badge.isEarned ? 'text-cyan-500' : 'text-slate-500'}`}>
                      {badge.theme}
                    </div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${badge.isEarned ? 'text-white' : 'text-slate-400'}`}>
                      {badge.name}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Neural Skill Tree */}
          <section className="space-y-6">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-mono tracking-[0.6em] uppercase text-slate-500">Neural Skill Tree</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="relative py-10 pl-12 md:pl-0">
              {/* Background Line */}
              <div className="absolute left-[1.5rem] md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 md:-translate-x-1/2 rounded-full" />
              
              {/* Progress Line */}
              <div 
                className="absolute left-[1.5rem] md:left-1/2 top-0 w-1 bg-cyan-500 md:-translate-x-1/2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                style={{ height: `${progressPercentage}%` }} 
              />

              <div className="space-y-12 relative z-10">
                {skillNodes.map((node, i) => (
                  <motion.div 
                    key={node.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center md:justify-between gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                  >
                    {/* Desktop Empty Space */}
                    <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                    
                    {/* Node */}
                    <div className={`absolute left-0 md:relative md:left-auto flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-slate-950 z-10 transition-all duration-500 ${
                      node.isCompleted 
                        ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                        : node.isUnlocked 
                          ? 'border-cyan-700 text-cyan-600' 
                          : 'border-slate-800 text-slate-700'
                    }`}>
                      {node.isCompleted ? <Check size={20} /> : node.isUnlocked ? <Activity size={20} /> : <Lock size={20} />}
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`p-5 rounded-2xl border transition-all duration-500 ${
                        node.isCompleted 
                          ? 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/50' 
                          : node.isUnlocked 
                            ? 'border-white/10 bg-slate-900/40 hover:border-white/20' 
                            : 'border-white/5 bg-slate-950/40 opacity-50'
                      }`}>
                        <div className={`text-[8px] font-mono uppercase tracking-widest mb-1 ${node.isCompleted ? 'text-cyan-500' : 'text-slate-500'}`}>
                          {node.theme}
                        </div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${node.isCompleted ? 'text-white' : node.isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                          {node.title}
                        </h3>
                        <p className={`text-xs italic line-clamp-2 ${node.isCompleted ? 'text-cyan-100/70' : node.isUnlocked ? 'text-slate-400' : 'text-slate-700'}`}>
                          {node.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Completed Missions */}
          <section className="space-y-6">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-mono tracking-[0.6em] uppercase text-slate-500">Cleared Combat Missions</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {groupedExercises.length === 0 ? (
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
              <div className="space-y-4">
                {groupedExercises.map((group, i) => {
                  const isExpanded = expandedModules.includes(group.moduleId);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={group.moduleId}
                      className="rounded-2xl border border-white/5 bg-slate-900/20 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(group.moduleId)}
                        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <ShieldCheck size={20} />
                          </div>
                          <div className="text-left">
                            <div className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest mb-0.5">Floor Cleared</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{group.moduleTitle}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Missions</div>
                            <div className="text-[10px] font-bold text-slate-300">{group.exercises.length} Completed</div>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={18} className="text-slate-500" />
                          </motion.div>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {group.exercises.map((ex) => (
                                <div
                                  key={ex.id}
                                  onClick={() => navigate(`/exercise/${group.moduleId}/${ex.id}`)}
                                  className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer group flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                      <Check size={16} />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{ex.title}</h4>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="text-[10px] font-bold text-emerald-400">+50 XP</div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
