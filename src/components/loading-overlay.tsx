
import React from 'react';
import { AnimatedCarLoader } from './animated-car-loader';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  size?: number;
  overlay?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = "Yükleniyor...",
  size = 200,
  overlay = true
}) => {
  if (!isLoading) return null;

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card border rounded-lg p-8 shadow-lg">
          <AnimatedCarLoader size={size} />
          {message && (
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <AnimatedCarLoader size={size} />
      {message && (
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
};
