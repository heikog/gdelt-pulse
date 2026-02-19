import React from 'react';
import useSWR from 'swr';
import { EventData, TimeFilter, EventCategory } from '@/types';
import { useAppStore } from './store';

interface EventsResponse {
  events: EventData[];
  totalCount: number;
  timeFilter: TimeFilter;
  categories: EventCategory[];
  hasErrors?: boolean;
}

const fetcher = async (url: string): Promise<EventsResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export function useEvents() {
  const { timeFilter, setEvents, setLoading, setError } = useAppStore();
  
  const { data, error, isLoading, mutate } = useSWR<EventsResponse>(
    `/api/events?timeFilter=${timeFilter}`,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      revalidateOnFocus: false,
      dedupingInterval: 2 * 60 * 1000, // Dedupe requests for 2 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onSuccess: (data) => {
        setEvents(data.events);
        setError(null);
      },
      onError: (error) => {
        console.error('Events fetch error:', error);
        setError(error.message || 'Failed to load events');
      },
    }
  );

  // Update loading state
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}