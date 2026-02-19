'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { GlobePoint } from '@/types';
import { formatTimeAgo } from '@/lib/utils';

// Dynamically import Globe to avoid SSR issues
const GlobeComponent = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-cyan-400">Loading Globe...</div>
    </div>
  ),
});

export function Globe() {
  const globeRef = useRef<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<GlobePoint | null>(null);
  const { filteredEvents, loading } = useAppStore();

  // Convert events to globe points
  const globePoints: GlobePoint[] = filteredEvents.map(event => ({
    lat: event.geometry.coordinates[1],
    lng: event.geometry.coordinates[0],
    color: event.color,
    title: event.properties.title || 'Untitled Event',
    url: event.properties.url,
    category: event.category,
    date: event.properties.urlpubdate || event.properties.seendate || '',
  }));

  // Auto-rotate the globe
  useEffect(() => {
    if (!globeRef.current) return;
    
    const globe = globeRef.current as any;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    
    // Set initial camera position
    globe.pointOfView({
      lat: 20,
      lng: 0,
      altitude: 2,
    });
  }, []);

  const handlePointClick = (point: object, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => {
    setSelectedPoint(point as GlobePoint);
    
    // Stop auto-rotation temporarily
    if (globeRef.current) {
      const globe = globeRef.current as any;
      globe.controls().autoRotate = false;
      
      // Resume auto-rotation after 10 seconds
      setTimeout(() => {
        if (globe.controls) {
          globe.controls().autoRotate = true;
        }
      }, 10000);
    }
  };

  const handleGlobeClick = () => {
    setSelectedPoint(null);
  };

  if (loading && globePoints.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-cyan-400 text-lg">Loading Globe...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GlobeComponent
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Points configuration
        pointsData={globePoints}
        pointAltitude={0.02}
        pointRadius={0.6}
        pointColor="color"
        pointLabel={(point: any) => `
          <div class="bg-gray-900 p-3 rounded-lg border border-cyan-500/20 max-w-sm">
            <div class="font-semibold text-cyan-400 text-sm mb-1">${point.category.toUpperCase()}</div>
            <div class="text-white text-sm mb-2">${point.title}</div>
            ${point.date ? `<div class="text-gray-400 text-xs">${formatTimeAgo(point.date)}</div>` : ''}
          </div>
        `}
        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
        
        // Globe appearance
        atmosphereColor="rgba(6, 182, 212, 0.15)"
        atmosphereAltitude={0.15}
        
        // Animation
        animateIn={true}
        
        // Controls
        enablePointerInteraction={true}
      />
      
      {/* Event Details Sidebar */}
      {selectedPoint && (
        <div className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wide text-cyan-400 font-semibold">
              {selectedPoint.category}
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          
          <h3 className="text-white font-semibold text-sm mb-3 leading-tight">
            {selectedPoint.title}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Location:</span>
              <span className="text-gray-300">
                {selectedPoint.lat.toFixed(2)}°, {selectedPoint.lng.toFixed(2)}°
              </span>
            </div>
            
            {selectedPoint.date && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Time:</span>
                <span className="text-gray-300">{formatTimeAgo(selectedPoint.date)}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-800">
            <a
              href={selectedPoint.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Read More →
            </a>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-2 font-medium">Event Types</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300 text-xs">Conflict</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300 text-xs">Protest</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-300 text-xs">Diplomacy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-xs">Disaster</span>
          </div>
        </div>
      </div>
    </div>
  );
}