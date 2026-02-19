'use client';

import { Globe, Activity, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CATEGORY_CONFIG } from '@/lib/utils';

export function Header() {
  const { events, filteredEvents, loading, error } = useAppStore();

  const categoryStats = Object.keys(CATEGORY_CONFIG).reduce((acc, category) => {
    acc[category] = events.filter(event => event.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="w-8 h-8 text-cyan-400" />
              {loading && (
                <div className="absolute inset-0 animate-spin">
                  <div className="w-8 h-8 border-2 border-transparent border-t-cyan-400 rounded-full" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                GDELT Pulse
              </h1>
              <p className="text-gray-400 text-sm">
                Real-time global events visualization
              </p>
            </div>
          </div>

          {/* Status and Stats */}
          <div className="flex items-center gap-6">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                error ? 'bg-red-500' : loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
              }`} />
              <span className="text-sm text-gray-400">
                {error ? 'Error' : loading ? 'Loading...' : 'Live'}
              </span>
            </div>

            {/* Event Count */}
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">
                {filteredEvents.length} events
              </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Updated {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Category Stats Bar */}
        {!loading && events.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-center gap-6">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-gray-300">
                    {config.name}: <span className="text-white font-medium">
                      {categoryStats[key] || 0}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}