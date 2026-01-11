
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [animationType, setAnimationType] = useState<'pulse' | 'orbit' | 'waves'>('pulse');
  const timerRef = useRef<number | null>(null);
  
  const DURATION = 5000; // 5 Sekunden Laufzeit

  const triggerAnimation = useCallback(() => {
    // Wenn bereits aktiv, ignoriere weitere Trigger
    if (isTriggered) return;
    
    console.log("Animation gestartet...");
    setIsTriggered(true);
    
    // Zufälliger Wechsel des Typs für Abwechslung (optional)
    const types: ('pulse' | 'orbit' | 'waves')[] = ['pulse', 'orbit', 'waves'];
    setAnimationType(types[Math.floor(Math.random() * types.length)]);

    // Nach 5 Sekunden automatisch zurücksetzen
    timerRef.current = window.setTimeout(() => {
      setIsTriggered(false);
      console.log("Animation beendet.");
    }, DURATION);
  }, [isTriggered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Höre auf Leertaste (vom Python Skript gesendet) oder Enter
      if (e.key === ' ' || e.key === 'Enter') {
        triggerAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerAnimation]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Hintergrund-Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isTriggered ? 'opacity-30' : 'opacity-10'} bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]`} />

      {/* Minimale Statusanzeige (hilfreich für Debugging am Pi) */}
      {!isTriggered && (
        <div className="text-slate-700 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">
          Bereit für GPIO Signal...
        </div>
      )}

      {/* Die eigentliche Animation */}
      <AnimationOverlay isActive={isTriggered} type={animationType} />

      {/* Kleiner Indikator am unteren Rand */}
      <div className="fixed bottom-4 left-4 flex items-center gap-2 opacity-20">
        <div className={`w-2 h-2 rounded-full ${isTriggered ? 'bg-emerald-500' : 'bg-slate-700'}`} />
        <span className="text-[10px] text-slate-500 font-mono">
          {isTriggered ? 'RUNNING' : 'IDLE'}
        </span>
      </div>
    </div>
  );
};

export default App;
