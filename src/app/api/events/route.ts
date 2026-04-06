import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { EventData, TimeFilter, EventCategory } from '@/types';
import { CATEGORY_CONFIG, TIME_FILTER_CONFIG } from '@/lib/utils';
import { getCountryCoords } from '@/lib/country-centroids';

const GDELT_BASE_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface GDELTArticle {
  url: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

// In-memory cache to avoid hitting GDELT rate limits on repeated requests
const cache = new Map<string, { data: EventData[]; ts: number }>();
let lastGdeltRequest = 0; // timestamp of last outbound GDELT request

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'GDELT-Pulse/1.0' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(body));
    });
    req.setTimeout(30000, () => { req.destroy(new Error('Request timeout')); });
    req.on('error', reject);
  });
}

async function fetchGDELTData(category: EventCategory, timeFilter: TimeFilter): Promise<EventData[]> {
  const cacheKey = `${category}-${timeFilter}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached.data;
  }

  const query = CATEGORY_CONFIG[category].query;
  const timespan = `${TIME_FILTER_CONFIG[timeFilter].hours}h`;
  const url = `${GDELT_BASE_URL}?query=${encodeURIComponent(query)}&mode=ArtList&format=JSON&timespan=${timespan}&maxrecords=250`;

  try {
    console.log(`Fetching ${category} events:`, url);

    // Enforce minimum 15s between GDELT requests (conservative to avoid rate limits)
    const sinceLastRequest = Date.now() - lastGdeltRequest;
    if (sinceLastRequest < 15000) {
      await new Promise(r => setTimeout(r, 15000 - sinceLastRequest));
    }

    // Retry once on timeout or rate-limit response
    let text: string;
    try {
      text = await httpsGet(url);
      lastGdeltRequest = Date.now();
    } catch (err) {
      console.warn(`First attempt failed for ${category}, retrying in 15s...`);
      lastGdeltRequest = Date.now();
      await new Promise(r => setTimeout(r, 15000));
      text = await httpsGet(url);
      lastGdeltRequest = Date.now();
    }

    // If rate-limited, retry once after a longer wait
    if (typeof text === 'string' && text.includes('Please limit requests')) {
      console.warn(`Rate limited for ${category}, retrying in 15s...`);
      lastGdeltRequest = Date.now();
      await new Promise(r => setTimeout(r, 15000));
      text = await httpsGet(url);
      lastGdeltRequest = Date.now();
    }

    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.warn(`Non-JSON GDELT response for ${category}:`, text.slice(0, 200));
      return [];
    }

    const data = JSON.parse(text);

    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn(`No articles in GDELT response for ${category}`);
      return [];
    }

    console.log(`Got ${data.articles.length} articles for ${category}`);

    // Group articles by country → one map point per country with article count
    const countryMap = new Map<string, { count: number; article: GDELTArticle }>();
    for (const article of data.articles as GDELTArticle[]) {
      const country = article.sourcecountry;
      if (!country) continue;
      const coords = getCountryCoords(country);
      if (!coords) continue;
      const existing = countryMap.get(country);
      if (existing) {
        existing.count++;
      } else {
        countryMap.set(country, { count: 1, article });
      }
    }

    const events: EventData[] = [];
    let index = 0;
    for (const [country, { count, article }] of countryMap.entries()) {
      const coords = getCountryCoords(country)!;
      events.push({
        id: `${category}-${index++}-${country}`,
        lat: coords[0],
        lng: coords[1],
        name: country,
        count,
        category,
        color: CATEGORY_CONFIG[category].color,
        shareimage: article.socialimage,
        html: `<b>${article.title}</b><br><a href="${article.url}" target="_blank">${article.domain}</a>`,
      });
    }

    console.log(`Mapped ${events.length} country points for ${category}`);
    cache.set(cacheKey, { data: events, ts: Date.now() });
    return events;
  } catch (error) {
    console.error(`Error fetching ${category} events:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFilter = (searchParams.get('timeFilter') || '24H') as TimeFilter;
    const categories = searchParams.get('categories')?.split(',') as EventCategory[] | undefined;

    const categoriesToFetch = categories || Object.keys(CATEGORY_CONFIG) as EventCategory[];

    console.log('Fetching events for categories:', categoriesToFetch, 'timeFilter:', timeFilter);

    const allEvents: EventData[] = [];
    let hasErrors = false;

    for (const category of categoriesToFetch) {
      try {
        const events = await fetchGDELTData(category, timeFilter);
        allEvents.push(...events);
      } catch (e) {
        console.error(`Failed to fetch ${category} events:`, e);
        hasErrors = true;
      }
    }

    console.log(`Fetched ${allEvents.length} total events${hasErrors ? ' (with some errors)' : ''}`);

    return NextResponse.json(
      {
        events: allEvents,
        totalCount: allEvents.length,
        timeFilter,
        categories: categoriesToFetch,
        hasErrors,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}
