import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Radio, Volume1, Volume2, VolumeX } from 'lucide-react';

interface AmbientSoundProps {
  type?: 'machinery' | 'wind';
  initialVolume?: number;
}

const AmbientSound: React.FC<AmbientSoundProps> = ({ type = 'machinery', initialVolume = 0.1 }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isHovered, setIsHovered] = useState(false);

  const soundUrls = {
    machinery: 'https://assets.mixkit.co/sfx/preview/mixkit-factory-hum-2336.mp3',
    wind: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-howling-at-night-1166.mp3'
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  useEffect(() => {
    const handleToggle = () => toggleAmbient();
    window.addEventListener('toggle-ambient', handleToggle);
    return () => window.removeEventListener('toggle-ambient', handleToggle);
  }, [isPlaying]);

  const toggleAmbient = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Ambient audio blocked:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio ref={audioRef} src={soundUrls[type]} />
      
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md px-3 py-1 rounded-lg mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={`bar-${i}`}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-0.5 bg-cyan-500/50"
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">
                {type === 'machinery' ? 'Neural Hum' : 'Atmospheric Wind'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 100, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-2 bg-slate-900/80 border border-white/10 backdrop-blur-md px-3 py-2 rounded-full overflow-hidden"
            >
              <div className="text-cyan-500/50">
                {volume === 0 ? <VolumeX size={12} /> : volume < 0.5 ? <Volume1 size={12} /> : <Volume2 size={12} />}
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAmbient}
          className={`p-3 rounded-full border backdrop-blur-md transition-all shadow-lg ${
            isPlaying 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-cyan-500/20' 
              : 'bg-slate-900/80 border-white/10 text-slate-500 hover:text-slate-300'
          }`}
          title={isPlaying ? "Disable Ambient Sound (Ctrl+A)" : "Enable Ambient Sound (Ctrl+A)"}
        >
          {type === 'machinery' ? <Radio size={18} /> : <Wind size={18} />}
        </motion.button>
      </div>
    </div>
  );
};

export default AmbientSound;
