
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [lastInput, setLastInput] = useState<string>('Bereit');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const DURATION_SECONDS = 5;
  const timerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    setIsTriggered(false);
    setTimeLeft(0);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
    timerRef.current = null;
    countdownIntervalRef.current = null;
  }, []);

  const triggerAnimation = useCallback(() => {
    // Wenn bereits aktiv, ignorieren wir weitere Trigger für die Dauer der Animation
    if (isTriggered) return;
    
    setIsTriggered(true);
    setTimeLeft(DURATION_SECONDS);

    const startTime = Date.now();
    
    // Countdown für die Anzeige
    countdownIntervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, DURATION_SECONDS - elapsed);
      setTimeLeft(remaining);
    }, 50);

    // Sicherer Timeout zum Beenden
    timerRef.current = window.setTimeout(() => {
      stopAnimation();
    }, DURATION_SECONDS * 1000);
  }, [isTriggered, stopAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Wir loggen den Input, um zu sehen ob das Python-Skript feuert
      if (e.repeat) return; // Ignoriere gedrückt gehaltene Tasten
      
      setLastInput(`Taste: ${e.key === ' ' ? 'Leertaste' : e.key}`);
      
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
      className="min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden cursor-none"
      onClick={triggerAnimation}
    >
      {/* Status-Monitor */}
      <div className="fixed top-6 left-6 z-[100] font-mono">
        <div className="bg-black/60 backdrop-blur-xl p-4 border border-blue-900/30 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${isTriggered ? 'bg-blue-400 shadow-blue-500 animate-pulse' : 'bg-slate-600 shadow-transparent'}`} />
            <span className={`text-sm font-bold tracking-tighter ${isTriggered ? 'text-blue-400' : 'text-slate-500'}`}>
              {isTriggered ? 'SYSTEM_ACTIVE' : 'SYSTEM_IDLE'}
            </span>
          </div>
          
          <div className="text-[10px] text-slate-500 mb-4">LOG: {lastInput}</div>
          
          {isTriggered && (
            <div className="w-48">
              <div className="flex justify-between text-[10px] text-blue-300/80 mb-2 font-bold tracking-widest">
                <span>REMAINING</span>
                <span>{timeLeft.toFixed(1)}S</span>
              </div>
              <div className="w-full bg-blue-950/30 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-75 ease-linear"
                  style={{ width: `${(timeLeft / DURATION_SECONDS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Die neue sanfte Animation */}
      <AnimationOverlay isActive={isTriggered} />

      {/* Standby UI */}
      {!isTriggered && (
        <div className="flex flex-col items-center gap-6 opacity-40">
          <div className="w-16 h-16 border border-blue-900/20 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-ping" />
            <div className="w-2 h-2 bg-blue-900 rounded-full" />
          </div>
          <div className="text-[10px] text-blue-900 font-mono tracking-[0.5em] uppercase">
            Awaiting Command
          </div>
        </div>
      )}

      {/* Info für User */}
      <div className="fixed bottom-6 text-[9px] text-slate-800 font-mono uppercase tracking-[0.2em]">
        RasPi Animation Controller v2.0
      </div>
    </div>
  );
};

export default App;
