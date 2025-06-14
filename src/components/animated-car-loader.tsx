
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
        <img
          src="https://cdn.dribbble.com/userupload/23100238/file/original-913abe576d431ec26bda5b68189149dc.gif"
          alt="Loading..."
          style={{ width: size, height: size * 0.6 }}
          className="object-contain"
        />
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Yükleniyor...
      </p>
    </div>
  );
};
