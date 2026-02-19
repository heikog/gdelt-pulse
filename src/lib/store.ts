import { create } from 'zustand';
import { AppState, EventData, EventCategory, TimeFilter } from '@/types';

interface AppActions {
  setEvents: (events: EventData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: EventCategory | 'all') => void;
  setTimeFilter: (timeFilter: TimeFilter) => void;
  setSearchQuery: (query: string) => void;
  filterEvents: () => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // State
  events: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
  timeFilter: '24H',
  searchQuery: '',
  filteredEvents: [],

  // Actions
  setEvents: (events) => {
    set({ events });
    get().filterEvents();
  },

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory });
    get().filterEvents();
  },
  
  setTimeFilter: (timeFilter) => {
    set({ timeFilter });
    get().filterEvents();
  },
  
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterEvents();
  },

  filterEvents: () => {
    const { events, selectedCategory, searchQuery } = get();
    
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.properties.title?.toLowerCase().includes(query) ||
        event.properties.domain?.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }

    set({ filteredEvents: filtered });
  },

  resetFilters: () => {
    set({ 
      selectedCategory: 'all', 
      searchQuery: '',
      timeFilter: '24H'
    });
    get().filterEvents();
  },
}));