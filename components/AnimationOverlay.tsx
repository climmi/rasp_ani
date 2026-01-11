
import React from 'react';

interface AnimationOverlayProps {
  isActive: boolean;
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({ isActive }) => {
  // Wir erstellen 5 Wellen-Ringe für einen noch dichteren Effekt bei längerer Laufzeit
  const rings = [0, 1, 2, 3, 4];

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-40 transition-all duration-1000 ${
        isActive ? 'opacity-100 bg-[#000510]' : 'opacity-0 bg-black'
      }`}
    >
      {/* Zentraler Leuchteffekt */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Hintergrund-Glow */}
          <div className="absolute w-[100vmax] h-[100vmax] bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.2)_0%,_transparent_70%)]" />
          
          {/* Wellen-Ringe */}
          {rings.map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-ripple"
              style={{
                animationDelay: `${i * 1.0}s`,
                width: '100px',
                height: '100px',
              }}
            />
          ))}
          
          {/* Zentraler Kern */}
          <div className="absolute w-5 h-5 bg-blue-400 rounded-full shadow-[0_0_40px_#60a5fa] animate-pulse" />
        </div>
      )}
      
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: scale(18);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 5s cubic-bezier(0.1, 0.2, 0.3, 1) infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};
