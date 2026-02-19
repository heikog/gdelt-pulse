export interface GDELTFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name: string;
    count: number;
    shareimage?: string;
    html?: string;
  };
}

export interface GDELTResponse {
  type: 'FeatureCollection';
  features: GDELTFeature[];
}

export type EventCategory = 'conflict' | 'protest' | 'diplomacy' | 'disaster';

export type TimeFilter = '1H' | '6H' | '12H' | '24H' | '3D' | '7D';

export interface EventData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  count: number;
  category: EventCategory;
  color: string;
  shareimage?: string;
  html?: string;
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
  size: number;
}
