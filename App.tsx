
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [animationType, setAnimationType] = useState<'pulse' | 'orbit' | 'waves'>('pulse');
  const timerRef = useRef<number | null>(null);
  
  const DURATION = 5000;

  const triggerAnimation = useCallback(() => {
    if (isTriggered) return;
    
    setIsTriggered(true);
    const types: ('pulse' | 'orbit' | 'waves')[] = ['pulse', 'orbit', 'waves'];
    setAnimationType(types[Math.floor(Math.random() * types.length)]);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsTriggered(false);
    }, DURATION);
  }, [isTriggered]);

  useEffect(() => {
    // Diese Funktion wird aufgerufen, wenn eine Taste gedrückt wird.
    // Unter Wayland muss der Browser zwingend den Fokus haben!
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        triggerAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [triggerAnimation]);

  return (
    <div 
      className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden cursor-none"
      onClick={triggerAnimation}
    >
      {/* Hintergrund-Effekt */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isTriggered ? 'opacity-40' : 'opacity-10'} bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]`} />

      {/* Animation wird nur gerendert wenn aktiv */}
      <AnimationOverlay isActive={isTriggered} type={animationType} />

      {/* Minimaler Status für den Benutzer am Anfang */}
      {!isTriggered && (
        <div className="opacity-20 text-[10px] font-mono text-white tracking-[0.5em] uppercase">
          System Ready
        </div>
      )}
    </div>
  );
};

export default App;
