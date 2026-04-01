import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Book, Code, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { curriculum } from '../data/curriculum';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results = [];
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    
    curriculum.forEach(module => {
      // Search in module
      if (
        module.title.toLowerCase().includes(lowerQuery) ||
        module.description.toLowerCase().includes(lowerQuery) ||
        module.theme.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'module',
          id: module.id,
          title: module.title,
          description: module.description,
          icon: <Book className="w-4 h-4 text-cyan-400" />
        });
      }

      // Search in exercises
      module.exercises.forEach(exercise => {
        if (
          exercise.title.toLowerCase().includes(lowerQuery) ||
          exercise.definition.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            type: 'exercise',
            id: exercise.id,
            moduleId: module.id,
            title: exercise.title,
            description: exercise.definition,
            icon: <Code className="w-4 h-4 text-emerald-400" />
          });
        }
      });
    });
  }

  const handleSelect = (result: any) => {
    setIsOpen(false);
    if (result.type === 'exercise') {
      navigate(`/exercise/${result.moduleId}/${result.id}`);
    } else if (result.type === 'module') {
      // Navigate to the first exercise of the module
      const mod = curriculum.find(m => m.id === result.id);
      if (mod && mod.exercises.length > 0) {
        navigate(`/exercise/${result.id}/${mod.exercises[0].id}`);
      }
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
            >
              <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                <div className="flex items-center px-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search exercises, concepts, or modules..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-slate-200 placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {query.trim() && (
                  <div className="overflow-y-auto p-2 flex-1">
                    {results.length > 0 ? (
                      <div className="space-y-1">
                        {results.map((result, index) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleSelect(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-start gap-4 transition-colors ${
                              index === selectedIndex
                                ? 'bg-cyan-500/10 border border-cyan-500/30'
                                : 'hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            <div className="mt-1 p-2 rounded-lg bg-slate-950 border border-white/5">
                              {result.icon}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                {result.title}
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-full bg-slate-950 border border-white/5">
                                  {result.type}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                                {result.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-12 text-center text-slate-500">
                        <Terminal className="w-8 h-8 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No matching records found in the neural database.</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="px-4 py-3 border-t border-white/5 bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">↓</kbd> to navigate</span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">Enter</kbd> to select</span>
                  </div>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">ESC</kbd> to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Search Button Hint (Floating or Fixed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-lg group"
        >
          <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono">Search</span>
          <div className="flex items-center gap-1 ml-2 opacity-50">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">Shift</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">S</kbd>
          </div>
        </button>
      )}
    </>
  );
}
