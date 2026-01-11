
import React from 'react';

interface AnimationOverlayProps {
  isActive: boolean;
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({ isActive }) => {
  // Wir erstellen 4 Wellen-Ringe für einen flüssigen Effekt
  const rings = [0, 1, 2, 3];

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
          <div className="absolute w-[100vmax] h-[100vmax] bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15)_0%,_transparent_70%)]" />
          
          {/* Wellen-Ringe */}
          {rings.map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-ripple"
              style={{
                animationDelay: `${i * 1.2}s`,
                width: '100px',
                height: '100px',
              }}
            />
          ))}
          
          {/* Zentraler Kern */}
          <div className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_30px_#60a5fa] animate-pulse" />
        </div>
      )}
      
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(15);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 4.8s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};
