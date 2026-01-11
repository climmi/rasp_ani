
import React from 'react';

interface AnimationOverlayProps {
  isActive: boolean;
  type: 'pulse' | 'orbit' | 'waves';
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({ isActive, type }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <svg className="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {type === 'pulse' && (
          <g>
            <circle cx="50" cy="50" r="0" fill="none" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="0.5">
              <animate attributeName="r" from="0" to="60" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="0" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="0.5">
              <animate attributeName="r" from="0" to="60" dur="2s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="0" fill="none" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="0.5">
              <animate attributeName="r" from="0" to="60" dur="2s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {type === 'orbit' && (
          <g>
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(96, 165, 250, 0.2)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="3" fill="#60a5fa">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate attributeName="cx" values="20;50;80;50;20" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="2" fill="#34d399">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 50 50"
                to="0 50 50"
                dur="5s"
                repeatCount="indefinite"
              />
              <animate attributeName="cy" values="20;50;80;50;20" dur="5s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {type === 'waves' && (
          <g transform="translate(0, 50)">
            <path d="M0 0 Q 25 -10 50 0 T 100 0 V 50 H 0 Z" fill="rgba(147, 197, 253, 0.3)">
              <animate attributeName="d" 
                values="M0 0 Q 25 -10 50 0 T 100 0 V 50 H 0 Z;
                        M0 0 Q 25 10 50 0 T 100 0 V 50 H 0 Z;
                        M0 0 Q 25 -10 50 0 T 100 0 V 50 H 0 Z"
                dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M0 5 Q 25 15 50 5 T 100 5 V 50 H 0 Z" fill="rgba(52, 211, 153, 0.2)">
              <animate attributeName="d" 
                values="M0 5 Q 25 15 50 5 T 100 5 V 50 H 0 Z;
                        M0 5 Q 25 -5 50 5 T 100 5 V 50 H 0 Z;
                        M0 5 Q 25 15 50 5 T 100 5 V 50 H 0 Z"
                dur="6s" repeatCount="indefinite" />
            </path>
          </g>
        )}
      </svg>
    </div>
  );
};
