'use client';

import { RotateCcw, Download, Share2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TIME_FILTER_CONFIG, exportEventsToJSON, generateShareUrl } from '@/lib/utils';
import { TimeFilter } from '@/types';
import { cn } from '@/lib/utils';

export function FilterControls() {
  const {
    timeFilter,
    filteredEvents,
    setTimeFilter,
    resetFilters,
  } = useAppStore();

  const handleExport = () => exportEventsToJSON(filteredEvents);

  const handleShare = async () => {
    const shareUrl = generateShareUrl('all', timeFilter, '');
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-lg pointer-events-auto">
      {Object.entries(TIME_FILTER_CONFIG).map(([key, config]) => (
        <button
          key={key}
          onClick={() => setTimeFilter(key as TimeFilter)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-all',
            timeFilter === key
              ? 'bg-cyan-500 text-black'
              : 'text-gray-400 hover:text-white'
          )}
        >
          {config.label}
        </button>
      ))}

      <div className="w-px h-4 bg-white/20 mx-1" />

      <button
        onClick={resetFilters}
        title="Reset filters"
        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleExport}
        disabled={filteredEvents.length === 0}
        title="Export JSON"
        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 disabled:opacity-30"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleShare}
        title="Copy share link"
        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
