
import React from 'react';

interface AnimationOverlayProps {
  isActive: boolean;
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({ isActive }) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none transition-all duration-[2500ms] ease-in-out z-40 ${
        isActive 
          ? 'bg-[#001533] opacity-100' 
          : 'bg-black opacity-0'
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Ein sanfter, pulsierender Lichtkegel in der Mitte */}
          <div className="w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.3)_0%,_transparent_70%)] animate-[pulse_4s_infinite_ease-in-out]" />
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
