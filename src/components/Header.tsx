'use client';

import { Globe, Activity } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CATEGORY_CONFIG } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { EventCategory } from '@/types';

export function Header() {
  const { events, filteredEvents, loading, error, selectedCategory, setSelectedCategory } = useAppStore();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      {/* Logo */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="relative">
          <Globe className="w-6 h-6 text-cyan-400" />
          {loading && (
            <div className="absolute inset-0 animate-spin">
              <div className="w-6 h-6 border-2 border-transparent border-t-cyan-400 rounded-full" />
            </div>
          )}
        </div>
        <div>
          <span className="text-white font-bold text-base leading-none">GDELT Pulse</span>
          <span className="text-gray-500 text-xs ml-2">real-time global events</span>
        </div>
      </div>

      {/* Category pills + status */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-all',
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-black'
              : 'bg-black/60 text-gray-300 hover:bg-black/80 border border-white/10'
          )}
        >
          All
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const count = events.filter(e => e.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as EventCategory)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1',
                selectedCategory === key
                  ? 'text-black'
                  : 'bg-black/60 text-gray-300 hover:bg-black/80 border border-white/10'
              )}
              style={{ backgroundColor: selectedCategory === key ? config.color : undefined }}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: config.color }} />
              {config.name}
              {count > 0 && <span className="opacity-70">{count}</span>}
            </button>
          );
        })}

        <div className="flex items-center gap-1.5 ml-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <Activity className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-white font-medium">{filteredEvents.length}</span>
        </div>
      </div>
    </header>
  );
}
