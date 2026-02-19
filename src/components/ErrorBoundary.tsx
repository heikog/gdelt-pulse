'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/20 rounded-lg p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              <details className="text-left">
                <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                  Error Details
                </summary>
                <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-red-400 overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  onRetry 
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 m-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-red-400 font-medium text-sm mb-1">{title}</h3>
          <p className="text-gray-300 text-sm mb-3">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}