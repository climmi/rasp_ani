
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [lastInput, setLastInput] = useState<string>('Bereit für ESP32');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // HIER DIE DAUER ÄNDERN (in Millisekunden):
  const DURATION_MS = 7000; 
  
  const timerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const stopAnimation = useCallback(() => {
    setIsTriggered(false);
    isRunningRef.current = false;
    setTimeLeft(0);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
    timerRef.current = null;
    countdownIntervalRef.current = null;
  }, []);

  const triggerAnimation = useCallback(() => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    setIsTriggered(true);
    setTimeLeft(DURATION_MS / 1000);

    const startTime = Date.now();
    
    countdownIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (DURATION_MS - elapsed) / 1000);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
      }
    }, 50);

    timerRef.current = window.setTimeout(() => {
      stopAnimation();
    }, DURATION_MS);
  }, [stopAnimation, DURATION_MS]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; 
      
      // Simulation: Jedes Signal (Leertaste) steht für ESP32 LED = HIGH
      if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
        setLastInput('SIGNAL: HIGH');
        e.preventDefault();
        triggerAnimation();
      } else {
        setLastInput(`Taste: ${e.key}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAnimation();
    };
  }, [triggerAnimation, stopAnimation]);

  return (
    <div 
      className={`min-h-screen w-full transition-colors duration-700 flex flex-col items-center justify-center overflow-hidden cursor-none select-none ${isTriggered ? 'bg-black' : 'bg-[#02040a]'}`}
      onClick={triggerAnimation}
    >
      {/* Hardware Interface Monitor */}
      <div className="fixed top-8 left-8 z-[100] font-mono">
        <div className="bg-black/80 backdrop-blur-xl p-6 border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-3 h-3 rounded-full transition-all duration-200 ${isTriggered ? 'bg-blue-400 shadow-[0_0_20px_#60a5fa]' : 'bg-zinc-800'}`} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Input Link</span>
              <span className={`text-[11px] font-bold ${isTriggered ? 'text-blue-400' : 'text-zinc-400'}`}>
                {isTriggered ? 'LED SIGNAL DETECTED' : 'AWAITING ESP32...'}
              </span>
            </div>
          </div>
          
          <div className="space-y-1 py-3 border-t border-white/5">
             <div className="flex justify-between text-[9px]">
                <span className="text-zinc-600">PIN CONFIG:</span>
                <span className="text-blue-500 font-bold uppercase tracking-tighter">Pull-Down</span>
             </div>
             <div className="flex justify-between text-[9px]">
                <span className="text-zinc-600">TRIGGER:</span>
                <span className="text-zinc-400 uppercase tracking-tighter">Rising Edge</span>
             </div>
          </div>
          
          {isTriggered && (
            <div className="mt-2 pt-3 border-t border-white/5">
              <div className="flex justify-between text-[10px] text-blue-200/50 font-black mb-2 tabular-nums">
                <span>ACTIVE</span>
                <span>{timeLeft.toFixed(2)}s</span>
              </div>
              <div className="w-44 bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-75 ease-linear"
                  style={{ width: `${(timeLeft / (DURATION_MS/1000)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimationOverlay isActive={isTriggered} />

      {!isTriggered && (
        <div className="flex flex-col items-center gap-6 opacity-40">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border border-blue-500/20 animate-ping absolute" />
            <div className="w-12 h-12 rounded-full border border-blue-500/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </div>
          </div>
          <div className="text-[10px] text-blue-800 font-black tracking-[0.8em] uppercase">Sensor Link Active</div>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-8 text-[8px] text-zinc-800 font-mono font-bold tracking-[0.4em] uppercase text-center w-full pointer-events-none">
        Mode: Active High Input
      </div>
    </div>
  );
};

export default App;
