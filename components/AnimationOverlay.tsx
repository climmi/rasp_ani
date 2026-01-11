
import React from 'react';

interface AnimationOverlayProps {
  isActive: boolean;
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({ isActive }) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Basisschicht: Dunkelblaues Leuchten */}
      <div className={`absolute inset-0 bg-[#000814] transition-colors duration-500 ${isActive ? 'bg-[#001d3d]' : 'bg-black'}`} />
      
      {/* Pulsierende Lichtquelle */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-[200vw] h-[200vh] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.25)_0%,_rgba(0,0,0,0)_60%)] animate-soft-pulse" />
          
          {/* Zusätzlicher sanfter Glow am Rand */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(37,99,235,0.15)]" />
        </div>
      )}
      
      <style>{`
        @keyframes soft-pulse {
          0%, 100% { 
            transform: scale(0.8); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.7; 
          }
        }
        .animate-soft-pulse {
          animation: soft-pulse 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
