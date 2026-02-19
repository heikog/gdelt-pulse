'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-600 border-t-cyan-500',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function GlobalLoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900/90 rounded-lg p-8 border border-cyan-500/20 shadow-lg">
        <LoadingSpinner size="lg" text="Loading global events..." />
        <div className="mt-4 text-center">
          <p className="text-gray-300 text-sm">
            Fetching real-time data from GDELT
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}