# GDELT Pulse

A real-time global events visualization tool that displays events on an interactive 3D globe using data from the GDELT Project.

## Features

- **Interactive 3D Globe** - Explore global events on a beautiful 3D Earth
- **Real-time Data** - Live events from the GDELT Project API
- **Event Categories** - Conflict, Protest, Diplomacy, and Disaster events
- **Time Filters** - View events from 1 hour to 7 days
- **Search & Filter** - Find specific events or domains
- **Export & Share** - Export data as JSON or share filtered views

## Tech Stack

- **Next.js 15** with App Router
- **React Globe.gl** for 3D visualization
- **Zustand** for state management
- **SWR** for data fetching
- **Tailwind CSS** for styling
- **TypeScript** for type safety

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to see the app.

### Deployment

This app is deployed on Vercel. The production build is automatically deployed on pushes to main.

```bash
# Deploy to production
npm run build
vercel --prod --yes
```

## Data Source

This application uses the [GDELT Project](https://www.gdeltproject.org/) GEO API to fetch real-time global events data. The GDELT Project monitors broadcast, print, and web news media in over 100 languages and processes location data for events worldwide.

### API Endpoints

- Conflict: `conflict OR war OR attack OR violence OR military`
- Protest: `protest OR demonstration OR riot OR march`  
- Diplomacy: `diplomacy OR treaty OR summit OR negotiation OR agreement`
- Disaster: `earthquake OR flood OR hurricane OR disaster OR emergency`

## Features in Detail

### Interactive Globe
- Auto-rotating 3D globe with realistic Earth textures
- Click and drag to explore different regions
- Hover over points to see event details
- Click points to view full event information

### Event Filtering
- Filter by category (Conflict, Protest, Diplomacy, Disaster)
- Time range filtering (1H, 6H, 12H, 24H, 3D, 7D)
- Text search across event titles and domains
- Real-time filter updates

### Data Export
- Export filtered events as JSON
- Generate shareable URLs with current filters
- Copy share links to clipboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build locally
5. Submit a pull request

## License

MIT License - see LICENSE file for details.