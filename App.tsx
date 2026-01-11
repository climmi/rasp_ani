
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationOverlay } from './components/AnimationOverlay';

const App: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [lastInput, setLastInput] = useState<string>('Warte...');
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
    const handleKeyDown = (e: KeyboardEvent) => {
      // Protokolliere jede Taste für Debug-Zwecke
      setLastInput(`Taste: ${e.key}`);
      
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        triggerAnimation();
      }
    };

    // Globaler Listener auf dem Dokument
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [triggerAnimation]);

  return (
    <div 
      className="min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden cursor-none"
      onClick={() => {
        setLastInput('Klick');
        triggerAnimation();
      }}
    >
      {/* Debug Overlay (Oben Links) */}
      <div className="fixed top-2 left-2 z-[100] font-mono text-[10px] text-emerald-500 bg-black/80 p-2 border border-emerald-900/50 rounded pointer-events-none">
        STATUS: <span className={isTriggered ? "text-blue-400" : "text-white"}>{isTriggered ? "ANIMIERT" : "BEREIT"}</span><br/>
        INPUT: {lastInput}
      </div>

      {/* Hintergrund-Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isTriggered ? 'opacity-40' : 'opacity-10'} bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]`} />

      {/* Animation */}
      <AnimationOverlay isActive={isTriggered} type={animationType} />

      {!isTriggered && (
        <div className="flex flex-col items-center gap-2">
          <div className="opacity-30 text-[10px] font-mono text-white tracking-[0.5em] uppercase animate-pulse">
            System Online
          </div>
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
        </div>
      )}

      {/* Unsichtbarer Hinweis für Fokus */}
      <div className="fixed bottom-2 text-[8px] text-gray-800">
        Browser muss im Fokus sein. Einmal klicken falls nötig.
      </div>
    </div>
  );
};

export default App;
