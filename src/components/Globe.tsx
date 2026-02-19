'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { EventData } from '@/types';

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
  const [selectedPoint, setSelectedPoint] = useState<EventData | null>(null);
  const { filteredEvents, loading } = useAppStore();

  // Convert events to globe points format
  const globePoints = filteredEvents.map(event => ({
    lat: event.lat,
    lng: event.lng,
    color: event.color,
    size: Math.min(Math.max(Math.log(event.count + 1) * 0.3, 0.3), 2),
    name: event.name,
    category: event.category,
    count: event.count,
    html: event.html,
    id: event.id,
  }));

  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current as any;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2 });
  }, []);

  const handlePointClick = (point: any) => {
    const event = filteredEvents.find(e => e.id === point.id);
    if (event) setSelectedPoint(event);
    
    if (globeRef.current) {
      const globe = globeRef.current as any;
      globe.controls().autoRotate = false;
      setTimeout(() => {
        if (globe.controls) globe.controls().autoRotate = true;
      }, 10000);
    }
  };

  if (loading && globePoints.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-cyan-400/80 animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-sm text-white/40 tracking-wider ml-4">Loading events...</p>
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
        
        pointsData={globePoints}
        pointAltitude={0.02}
        pointRadius="size"
        pointColor="color"
        pointLabel={(point: any) => `
          <div style="background:rgba(17,24,39,0.95);padding:12px;border-radius:8px;border:1px solid rgba(6,182,212,0.2);max-width:320px">
            <div style="color:#22d3ee;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">${point.category}</div>
            <div style="color:white;font-size:13px;font-weight:600;margin-bottom:4px">${point.name}</div>
            <div style="color:#9ca3af;font-size:11px">${point.count} event${point.count !== 1 ? 's' : ''}</div>
          </div>
        `}
        onPointClick={handlePointClick}
        onGlobeClick={() => setSelectedPoint(null)}
        
        atmosphereColor="rgba(6, 182, 212, 0.15)"
        atmosphereAltitude={0.15}
        animateIn={true}
        enablePointerInteraction={true}
      />
      
      {selectedPoint && (
        <div className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wide text-cyan-400 font-semibold">
              {selectedPoint.category}
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-white transition-colors text-lg"
            >
              ×
            </button>
          </div>
          
          <h3 className="text-white font-semibold text-sm mb-2 leading-tight">
            {selectedPoint.name}
          </h3>
          
          <div className="text-gray-400 text-xs mb-3">
            {selectedPoint.count} event{selectedPoint.count !== 1 ? 's' : ''} reported
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{selectedPoint.lat.toFixed(2)}°, {selectedPoint.lng.toFixed(2)}°</span>
          </div>
          
          {selectedPoint.html && (
            <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-300 max-h-40 overflow-y-auto"
                 dangerouslySetInnerHTML={{ __html: selectedPoint.html }} />
          )}
        </div>
      )}
    </div>
  );
}
