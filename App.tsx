
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [lastInput, setLastInput] = useState<string>('System Bereit');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // HIER DIE DAUER ÄNDERN (in Millisekunden):
  // 5000 = 5 Sek, 7000 = 7 Sek, 10000 = 10 Sek, etc.
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
      
      const inputLabel = e.key === ' ' ? 'Leertaste' : e.key;
      setLastInput(`Taste: ${inputLabel}`);
      
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        triggerAnimation();
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
      className="min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden cursor-none select-none"
      onClick={triggerAnimation}
    >
      {/* Status & Timer UI */}
      <div className="fixed top-8 left-8 z-[100] font-mono">
        <div className="bg-black/90 backdrop-blur-2xl p-5 border border-blue-500/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isTriggered ? 'bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-pulse' : 'bg-zinc-800'}`} />
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${isTriggered ? 'text-blue-400' : 'text-zinc-600'}`}>
              {isTriggered ? 'Wellen-Emitter Aktiv' : 'System Standby'}
            </span>
          </div>
          
          <div className="text-[9px] text-zinc-500 font-bold mb-4 tracking-wider">INPUT: {lastInput.toUpperCase()}</div>
          
          {isTriggered && (
            <div className="w-48">
              <div className="flex justify-between text-[10px] text-blue-300/80 font-bold mb-2 tabular-nums tracking-widest">
                <span>TIMER</span>
                <span>{timeLeft.toFixed(2)}s</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb] transition-all duration-75 ease-linear"
                  style={{ width: `${(timeLeft / (DURATION_MS/1000)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Layer */}
      <AnimationOverlay isActive={isTriggered} />

      {/* Standby Indikator */}
      {!isTriggered && (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-900/50 to-transparent" />
          <div className="text-[9px] text-blue-900 font-black tracking-[1em] uppercase">Ready</div>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-8 text-[9px] text-zinc-800 font-mono font-bold tracking-[0.5em] uppercase pointer-events-none">
        Wave Controller • {(DURATION_MS/1000).toFixed(1)}s Sequence
      </div>
    </div>
  );
};

export default App;
