import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, User as UserIcon, Activity } from 'lucide-react';
import { db, collection, query, orderBy, limit, getDocs } from '../firebase';
import { getLevel } from '../hooks/useProgress';

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  xp: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
        setEntries(data);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message || "Failed to load rankings.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 pb-20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <header className="max-w-4xl mx-auto px-6 py-10 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Return to Floors</span>
          </button>
        </header>

        <main className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-cyan-950 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Trophy size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white italic">
              Global Rankings
            </h1>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
              Top Architects by Convergence XP
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Activity className="h-8 w-8 text-cyan-500 animate-spin" />
              <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">Syncing Leaderboard...</div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/10 text-center text-red-400 text-sm font-mono">
              {error}
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-white/10 text-center space-y-4">
              <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">No Architects Ranked Yet</div>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => {
                const level = getLevel(entry.xp);
                const isTop3 = index < 3;
                
                return (
                  <motion.div
                    key={entry.uid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      index === 0 ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' :
                      index === 1 ? 'bg-slate-300/10 border-slate-300/30' :
                      index === 2 ? 'bg-amber-700/10 border-amber-700/30' :
                      'bg-slate-900/40 border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-12 text-center font-black italic text-2xl ${
                      index === 0 ? 'text-amber-400' :
                      index === 1 ? 'text-slate-300' :
                      index === 2 ? 'text-amber-600' :
                      'text-slate-600'
                    }`}>
                      #{index + 1}
                    </div>
                    
                    <div className="relative">
                      {entry.photoURL ? (
                        <img 
                          src={entry.photoURL} 
                          alt={entry.displayName} 
                          className={`w-12 h-12 rounded-full border-2 ${isTop3 ? 'border-transparent' : 'border-white/10'}`}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isTop3 ? 'bg-black/20' : 'bg-slate-800 border border-white/10'}`}>
                          <UserIcon size={20} className="text-slate-500" />
                        </div>
                      )}
                      {isTop3 && (
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-amber-500 text-amber-950' :
                          index === 1 ? 'bg-slate-300 text-slate-900' :
                          'bg-amber-700 text-amber-100'
                        }`}>
                          <Medal size={12} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold truncate ${isTop3 ? 'text-white' : 'text-slate-300'}`}>
                        {entry.displayName}
                      </h3>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Level {level}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-black text-lg ${
                        index === 0 ? 'text-amber-400' :
                        index === 1 ? 'text-slate-300' :
                        index === 2 ? 'text-amber-600' :
                        'text-cyan-400'
                      }`}>
                        {entry.xp}
                      </div>
                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                        XP
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
