
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [lastInput, setLastInput] = useState<string>('System Bereit');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const DURATION_MS = 5000;
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
    // Wenn die Animation bereits läuft, ignorieren wir JEDEN weiteren Input
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    setIsTriggered(true);
    setTimeLeft(DURATION_MS / 1000);

    const startTime = Date.now();
    
    // Countdown für das UI (alle 50ms)
    countdownIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (DURATION_MS - elapsed) / 1000);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
      }
    }, 50);

    // Der garantierte Timeout für das Ende nach 5 Sekunden
    timerRef.current = window.setTimeout(() => {
      stopAnimation();
    }, DURATION_MS);
  }, [stopAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Wichtig: Verhindert Mehrfachtrigger durch gedrückt halten
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
      {/* Status & Timer */}
      <div className="fixed top-8 left-8 z-[100] font-mono">
        <div className="bg-black/80 backdrop-blur-xl p-5 border border-blue-500/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isTriggered ? 'bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-pulse' : 'bg-zinc-800'}`} />
            <span className={`text-xs font-black tracking-widest uppercase ${isTriggered ? 'text-blue-400' : 'text-zinc-600'}`}>
              {isTriggered ? 'Animation Aktiv' : 'Warte auf Input'}
            </span>
          </div>
          
          <div className="text-[10px] text-zinc-500 font-medium mb-4">Letzter Input: {lastInput}</div>
          
          {isTriggered && (
            <div className="w-56">
              <div className="flex justify-between text-[11px] text-blue-300 font-bold mb-2 tabular-nums">
                <span>REMAINING</span>
                <span>{timeLeft.toFixed(2)}s</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden p-[1px]">
                <div 
                  className="h-full bg-blue-500 transition-all duration-75 ease-linear rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  style={{ width: `${(timeLeft / (DURATION_MS/1000)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Layer */}
      <AnimationOverlay isActive={isTriggered} />

      {/* Zentrierter Standby-Indikator */}
      {!isTriggered && (
        <div className="relative group transition-all duration-500 scale-75 md:scale-100">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
          <div className="w-24 h-24 border border-blue-900/10 rounded-full flex items-center justify-center relative bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[ping_3s_infinite]" />
            <div className="w-3 h-3 bg-blue-950 rounded-full" />
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="fixed bottom-8 text-[10px] text-zinc-800 font-mono font-bold tracking-[0.3em] uppercase">
        Raspberry Pi • Animation Controller • 5.0s Lock
      </div>
    </div>
  );
};

export default App;
