'use client';

import { Search, Filter, RotateCcw, Share2, Download } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CATEGORY_CONFIG, TIME_FILTER_CONFIG, exportEventsToJSON, generateShareUrl } from '@/lib/utils';
import { EventCategory, TimeFilter } from '@/types';
import { cn } from '@/lib/utils';

export function FilterControls() {
  const {
    selectedCategory,
    timeFilter,
    searchQuery,
    filteredEvents,
    events,
    setSelectedCategory,
    setTimeFilter,
    setSearchQuery,
    resetFilters,
  } = useAppStore();

  const handleExport = () => {
    exportEventsToJSON(filteredEvents);
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl(selectedCategory, timeFilter, searchQuery);
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Could add toast notification here
      console.log('Share URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy share URL:', err);
    }
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events, domains, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              All Events
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as EventCategory)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1',
                  selectedCategory === key
                    ? 'text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
                style={{
                  backgroundColor: selectedCategory === key ? config.color : undefined,
                }}
              >
                <span className="text-xs">{config.icon}</span>
                {config.name}
              </button>
            ))}
          </div>

          {/* Time Filters */}
          <div className="flex items-center gap-2">
            {Object.entries(TIME_FILTER_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setTimeFilter(key as TimeFilter)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  timeFilter === key
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>
              Showing <span className="text-cyan-400 font-medium">{filteredEvents.length}</span> of{' '}
              <span className="text-white font-medium">{events.length}</span> events
            </span>
            {searchQuery && (
              <span>
                for "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={handleExport}
              disabled={filteredEvents.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}