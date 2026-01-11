
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';
import { HardwareInstructions } from './components/HardwareInstructions';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationType, setAnimationType] = useState<'pulse' | 'orbit' | 'waves'>('pulse');
  
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const DURATION = 5000; // 5 Sekunden

  const stopAnimation = useCallback(() => {
    setIsTriggered(false);
    setProgress(0);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  }, []);

  const triggerAnimation = useCallback(() => {
    if (isTriggered) return;
    
    setIsTriggered(true);
    setProgress(100);
    
    // Timer für das Beenden nach 5 Sekunden
    timeoutRef.current = window.setTimeout(() => {
      stopAnimation();
    }, DURATION);

    // Intervall für den visuellen Countdown-Balken
    const startTime = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / DURATION * 100));
      setProgress(remaining);
      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 50);
  }, [isTriggered, stopAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space oder Enter simuliert den Hardware-Knopf
      if (e.key === ' ' || e.key === 'Enter') {
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="z-10 text-center space-y-8 p-6 max-w-2xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Pi Animation Hub
          </h1>
          <p className="text-slate-400">
            Wartet auf Signal von GPIO 16 oder <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs">Leertaste</kbd>
          </p>
        </header>

        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <button
              onClick={triggerAnimation}
              disabled={isTriggered}
              className={`
                w-48 h-48 rounded-full flex flex-col items-center justify-center text-xl font-bold transition-all duration-300
                ${isTriggered 
                  ? 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] scale-105 cursor-default text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 border-4 border-slate-600 active:scale-95 shadow-xl text-slate-300'}
              `}
            >
              <span>{isTriggered ? 'AKTIV' : 'BEREIT'}</span>
              {isTriggered && <span className="text-xs font-normal mt-1 opacity-80">Läuft...</span>}
            </button>
            
            {/* Progress Bar */}
            {isTriggered && (
              <div className="absolute -bottom-4 left-0 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-12 bg-slate-800/30 p-2 rounded-xl backdrop-blur-md border border-white/5">
            {(['pulse', 'orbit', 'waves'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setAnimationType(type)}
                disabled={isTriggered}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationType === type 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white disabled:opacity-30'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <HardwareInstructions />
      </div>

      <AnimationOverlay isActive={isTriggered} type={animationType} />
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTriggered ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
          <span>Status: {isTriggered ? 'Animation läuft (5s)' : 'Warte auf Input...'}</span>
        </div>
        <div className="opacity-50">RPi 4B - GPIO 16 Controller</div>
      </div>
    </div>
  );
};

export default App;
