'use client';

import { useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { FilterControls } from '@/components/FilterControls';
import { Globe } from '@/components/Globe';
import { GlobalLoadingOverlay } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorBoundary';
import { useEvents } from '@/lib/hooks';
import { useAppStore } from '@/lib/store';

function AppContent() {
  const { data, error, isLoading, mutate } = useEvents();
  const { 
    loading, 
    error: storeError, 
    events,
    setSelectedCategory,
    setTimeFilter,
    setSearchQuery
  } = useAppStore();

  // Handle URL parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const time = urlParams.get('time');
    const search = urlParams.get('search');
    
    if (category && category !== 'all') {
      setSelectedCategory(category as any);
    }
    if (time) {
      setTimeFilter(time as any);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [setSelectedCategory, setTimeFilter, setSearchQuery]);

  const hasError = error || storeError;
  const showGlobalLoading = loading && events.length === 0;

  return (
    <div className="h-screen flex flex-col bg-black text-white relative overflow-hidden">
      <Header />
      <FilterControls />
      
      <main className="flex-1 relative">
        {hasError ? (
          <div className="h-full flex items-center justify-center">
            <ErrorMessage
              title="Failed to Load Events"
              message={hasError || 'Unable to fetch data from GDELT API'}
              onRetry={() => mutate()}
            />
          </div>
        ) : (
          <>
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center bg-black">
                  <div className="text-cyan-400 text-lg">Loading Globe...</div>
                </div>
              }
            >
              <Globe />
            </Suspense>
            
            <GlobalLoadingOverlay show={showGlobalLoading} />
          </>
        )}
      </main>
      
      {/* Footer Info */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
        Data from{' '}
        <a 
          href="https://www.gdeltproject.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300"
        >
          GDELT Project
        </a>
        {' '}• Updates every 5 minutes
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading GDELT Pulse...</div>
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}