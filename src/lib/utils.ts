import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EventCategory, TimeFilter, EventData, GDELTFeature } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_CONFIG = {
  conflict: {
    query: 'conflict OR war OR attack OR violence OR military',
    color: '#ef4444', // red-500
    name: 'Conflict',
    icon: '⚔️'
  },
  protest: {
    query: 'protest OR demonstration OR riot OR march',
    color: '#eab308', // yellow-500
    name: 'Protest',
    icon: '✊'
  },
  diplomacy: {
    query: 'diplomacy OR treaty OR summit OR negotiation OR agreement',
    color: '#3b82f6', // blue-500
    name: 'Diplomacy',
    icon: '🤝'
  },
  disaster: {
    query: 'earthquake OR flood OR hurricane OR disaster OR emergency',
    color: '#22c55e', // green-500
    name: 'Disaster',
    icon: '🌪️'
  }
} as const;

export const TIME_FILTER_CONFIG = {
  '1H': { hours: 1, label: '1 Hour' },
  '6H': { hours: 6, label: '6 Hours' },
  '12H': { hours: 12, label: '12 Hours' },
  '24H': { hours: 24, label: '24 Hours' },
  '3D': { hours: 72, label: '3 Days' },
  '7D': { hours: 168, label: '7 Days' }
} as const;

export function convertGDELTToEventData(features: GDELTFeature[], category: EventCategory): EventData[] {
  return features
    .filter(f => f.geometry?.coordinates?.length === 2)
    .map((feature, index) => ({
      id: `${category}-${index}-${feature.properties.name}`,
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      name: feature.properties.name,
      count: feature.properties.count || 1,
      category,
      color: CATEGORY_CONFIG[category].color,
      shareimage: feature.properties.shareimage,
      html: feature.properties.html,
    }));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}

export function exportEventsToJSON(events: EventData[]): void {
  const dataStr = JSON.stringify(events, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gdelt-events-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateShareUrl(category: EventCategory | 'all', timeFilter: TimeFilter, searchQuery: string): string {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (timeFilter !== '24H') params.set('time', timeFilter);
  if (searchQuery) params.set('search', searchQuery);
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}