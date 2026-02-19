import { NextRequest, NextResponse } from 'next/server';
import { GDELTResponse, EventData, TimeFilter, EventCategory } from '@/types';
import { CATEGORY_CONFIG, TIME_FILTER_CONFIG, convertGDELTToEventData } from '@/lib/utils';

const GDELT_BASE_URL = 'https://api.gdeltproject.org/api/v2/geo/geo';

async function fetchGDELTData(category: EventCategory, timeFilter: TimeFilter): Promise<EventData[]> {
  const query = CATEGORY_CONFIG[category].query;
  const timespan = `${TIME_FILTER_CONFIG[timeFilter].hours}h`;
  
  const url = `${GDELT_BASE_URL}?query=${encodeURIComponent(query)}&mode=PointData&format=GeoJSON&timespan=${timespan}`;
  
  try {
    console.log(`Fetching ${category} events:`, url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GDELT-Pulse/1.0',
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 seconds
    });

    if (!response.ok) {
      throw new Error(`GDELT API error: ${response.status} ${response.statusText}`);
    }

    const data: GDELTResponse = await response.json();
    
    if (!data.features) {
      console.warn(`No features in GDELT response for ${category}`);
      return [];
    }

    return convertGDELTToEventData(data.features, category);
  } catch (error) {
    console.error(`Error fetching ${category} events:`, error);
    // Return empty array instead of throwing to allow partial data
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFilter = (searchParams.get('timeFilter') || '24H') as TimeFilter;
    const categories = searchParams.get('categories')?.split(',') as EventCategory[] | undefined;
    
    // Default to all categories if none specified
    const categoriesToFetch = categories || Object.keys(CATEGORY_CONFIG) as EventCategory[];
    
    console.log('Fetching events for categories:', categoriesToFetch, 'timeFilter:', timeFilter);

    // Fetch all categories in parallel
    const promises = categoriesToFetch.map(category => 
      fetchGDELTData(category, timeFilter)
    );

    const results = await Promise.allSettled(promises);
    
    // Combine all successful results
    const allEvents: EventData[] = [];
    let hasErrors = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allEvents.push(...result.value);
      } else {
        console.error(`Failed to fetch ${categoriesToFetch[index]} events:`, result.reason);
        hasErrors = true;
      }
    });

    console.log(`Fetched ${allEvents.length} total events${hasErrors ? ' (with some errors)' : ''}`);

    // Return response with cache headers
    return NextResponse.json(
      { 
        events: allEvents, 
        totalCount: allEvents.length,
        timeFilter,
        categories: categoriesToFetch,
        hasErrors 
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache
        },
      }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch events', 
        message: error instanceof Error ? error.message : 'Unknown error',
        events: [],
        totalCount: 0 
      },
      { status: 500 }
    );
  }
}