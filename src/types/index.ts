export interface GDELTEvent {
  type: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    url: string;
    urltone?: number;
    domain?: string;
    urlpubtimedate?: string;
    urlpubdate?: string;
    language?: string;
    title?: string;
    seendate?: string;
    socialimage?: string;
    identifier?: string;
    sentiment?: number;
    category?: string;
  };
}

export interface GDELTResponse {
  type: 'FeatureCollection';
  features: GDELTEvent[];
}

export type EventCategory = 'conflict' | 'protest' | 'diplomacy' | 'disaster';

export type TimeFilter = '1H' | '6H' | '12H' | '24H' | '3D' | '7D';

export interface EventData extends GDELTEvent {
  category: EventCategory;
  color: string;
}

export interface AppState {
  events: EventData[];
  loading: boolean;
  error: string | null;
  selectedCategory: EventCategory | 'all';
  timeFilter: TimeFilter;
  searchQuery: string;
  filteredEvents: EventData[];
}

export interface GlobePoint {
  lat: number;
  lng: number;
  color: string;
  title: string;
  url: string;
  category: EventCategory;
  date: string;
}