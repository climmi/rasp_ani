
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [lastInput, setLastInput] = useState<string>('Warte...');
  const [animationType, setAnimationType] = useState<'pulse' | 'orbit' | 'waves'>('pulse');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const DURATION_SECONDS = 5;
  const timerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    setIsTriggered(false);
    setTimeLeft(0);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
  }, []);

  const triggerAnimation = useCallback(() => {
    if (isTriggered) return;
    
    setIsTriggered(true);
    setTimeLeft(DURATION_SECONDS);
    
    const types: ('pulse' | 'orbit' | 'waves')[] = ['pulse', 'orbit', 'waves'];
    setAnimationType(types[Math.floor(Math.random() * types.length)]);

    // Countdown-Intervall (alle 100ms aktualisieren für flüssige Anzeige)
    const startTime = Date.now();
    countdownIntervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, DURATION_SECONDS - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
      }
    }, 100);

    // Haupt-Timer zum Stoppen
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      stopAnimation();
    }, DURATION_SECONDS * 1000);
  }, [isTriggered, stopAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setLastInput(`Taste: ${e.key}`);
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        triggerAnimation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      stopAnimation();
    };
  }, [triggerAnimation, stopAnimation]);

  return (
    <div 
      className="min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden cursor-none"
      onClick={() => {
        setLastInput('Klick');
        triggerAnimation();
      }}
    >
      {/* Debug & Timer Overlay */}
      <div className="fixed top-4 left-4 z-[100] font-mono text-xs flex flex-col gap-2">
        <div className="bg-black/80 p-3 border border-emerald-900/50 rounded-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isTriggered ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-emerald-500 uppercase tracking-widest">Status: {isTriggered ? 'Aktiv' : 'Bereit'}</span>
          </div>
          <div className="text-gray-400 text-[10px]">Input: {lastInput}</div>
          
          {isTriggered && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-blue-400 mb-1 font-bold">
                <span>ANIMATION LÄUFT...</span>
                <span>{timeLeft.toFixed(1)}s</span>
              </div>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                  style={{ width: `${(timeLeft / DURATION_SECONDS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hintergrund-Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isTriggered ? 'opacity-40' : 'opacity-10'} bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]`} />

      {/* Animation */}
      <AnimationOverlay isActive={isTriggered} type={animationType} />

      {!isTriggered && (
        <div className="flex flex-col items-center gap-4">
          <div className="opacity-20 text-[10px] font-mono text-white tracking-[1em] uppercase animate-pulse">
            System Standby
          </div>
          <div className="relative">
            <div className="w-12 h-12 border border-emerald-500/20 rounded-full animate-ping absolute inset-0" />
            <div className="w-12 h-12 border border-emerald-500/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Fokus-Warnung nur im Standby */}
      {!isTriggered && (
        <div className="fixed bottom-4 text-[9px] text-gray-700 font-mono tracking-tighter">
          [ WAITING FOR GPIO-TRIGGER OR SPACE ]
        </div>
      )}
    </div>
  );
};

export default App;
