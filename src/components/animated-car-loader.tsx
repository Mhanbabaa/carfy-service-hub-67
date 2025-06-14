
import React from 'react';

interface AnimatedCarLoaderProps {
  size?: number;
  className?: string;
}

export const AnimatedCarLoader: React.FC<AnimatedCarLoaderProps> = ({ 
  size = 200, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size * 0.6 }}>
        <svg
          width={size}
          height={size * 0.6}
          viewBox="0 0 200 120"
          className="overflow-visible"
        >
          {/* Background progress line */}
          <line
            x1="20"
            y1="100"
            x2="180"
            y2="100"
            stroke="#4A4A6A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Animated progress line */}
          <line
            x1="20"
            y1="100"
            x2="20"
            y2="100"
            stroke="#00D1FF"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-progress-fill"
          />
          
          {/* Car body with squash and stretch animation */}
          <g className="animate-car-bounce">
            <path
              d="M30 75 L50 75 L55 65 L70 65 L75 55 L120 55 L125 65 L140 65 L145 75 L165 75 L165 85 L30 85 Z"
              fill="none"
              stroke="#00D1FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Car windows */}
            <path
              d="M60 65 L60 58 L115 58 L115 65"
              fill="none"
              stroke="#00D1FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Car door line */}
            <line
              x1="87"
              y1="58"
              x2="87"
              y2="75"
              stroke="#00D1FF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
          
          {/* Front wheel */}
          <circle
            cx="55"
            cy="85"
            r="12"
            fill="none"
            stroke="#00D1FF"
            strokeWidth="2.5"
            className="animate-wheel-spin origin-[55px_85px]"
          />
          
          {/* Rear wheel */}
          <circle
            cx="140"
            cy="85"
            r="12"
            fill="none"
            stroke="#00D1FF"
            strokeWidth="2.5"
            className="animate-wheel-spin origin-[140px_85px]"
          />
          
          {/* Wheel spokes for rotation visibility */}
          <g className="animate-wheel-spin origin-[55px_85px]">
            <line x1="55" y1="77" x2="55" y2="93" stroke="#00D1FF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="47" y1="85" x2="63" y2="85" stroke="#00D1FF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          
          <g className="animate-wheel-spin origin-[140px_85px]">
            <line x1="140" y1="77" x2="140" y2="93" stroke="#00D1FF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="132" y1="85" x2="148" y2="85" stroke="#00D1FF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Yükleniyor...
      </p>
    </div>
  );
};
