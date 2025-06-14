
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
          src="https://cdn.dribbble.com/userupload/25134602/file/original-b54f0b03a6c35a66623c41ac2ce4f1ea.gif"
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
