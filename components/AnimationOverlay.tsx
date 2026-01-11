
import React from 'react';

interface AnimationOverlayProps {
  isActive: boolean;
  type: 'pulse' | 'orbit' | 'waves';
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({ isActive, type }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {type === 'pulse' && (
          <g>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="50" cy="50" r="0" fill="none" stroke="#10b981" strokeWidth="1">
                <animate 
                  attributeName="r" 
                  from="0" 
                  to="80" 
                  dur="2.5s" 
                  begin={`${i * 0.8}s`} 
                  repeatCount="indefinite" 
                />
                <animate 
                  attributeName="opacity" 
                  from="0.8" 
                  to="0" 
                  dur="2.5s" 
                  begin={`${i * 0.8}s`} 
                  repeatCount="indefinite" 
                />
              </circle>
            ))}
          </g>
        )}

        {type === 'orbit' && (
          <g>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#3b82f6" strokeWidth="0.1" opacity="0.3" />
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="2s"
                repeatCount="indefinite"
              />
              <circle cx="85" cy="50" r="4" fill="#3b82f6">
                <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
              </circle>
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 50 50"
                to="0 50 50"
                dur="4s"
                repeatCount="indefinite"
              />
              <circle cx="15" cy="50" r="3" fill="#10b981">
                <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        )}

        {type === 'waves' && (
          <g transform="translate(0, 50)">
            <path d="M0 0 Q 25 -20 50 0 T 100 0 V 50 H 0 Z" fill="#3b82f6" fillOpacity="0.4">
              <animate 
                attributeName="d" 
                values="M0 0 Q 25 -20 50 0 T 100 0 V 50 H 0 Z;
                        M0 0 Q 25 20 50 0 T 100 0 V 50 H 0 Z;
                        M0 0 Q 25 -20 50 0 T 100 0 V 50 H 0 Z"
                dur="3s" 
                repeatCount="indefinite" 
              />
            </path>
            <path d="M0 10 Q 25 30 50 10 T 100 10 V 50 H 0 Z" fill="#10b981" fillOpacity="0.3">
              <animate 
                attributeName="d" 
                values="M0 10 Q 25 30 50 10 T 100 10 V 50 H 0 Z;
                        M0 10 Q 25 -10 50 10 T 100 10 V 50 H 0 Z;
                        M0 10 Q 25 30 50 10 T 100 10 V 50 H 0 Z"
                dur="5s" 
                repeatCount="indefinite" 
              />
            </path>
          </g>
        )}
      </svg>
    </div>
  );
};
