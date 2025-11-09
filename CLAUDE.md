# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

K-Drama Top 10 is a static website that displays Netflix's top 10 Korean dramas with detailed information, ranking trends, and OST music players. The site features a modern, minimalist design built with vanilla JavaScript and Tailwind CSS.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Data Visualization**: Chart.js
- **Media Integration**: YouTube iframe API
- **Data Collection**: Node.js + Axios + Cheerio
- **External API**: TMDB API for drama details
- **Deployment**: GitHub Pages (static hosting)

## Development Commands

```bash
# Install dependencies (for scraping tools only)
npm install

# Run local development server
npm run dev
# Opens http://localhost:8080

# Scrape and update data (requires TMDB API key)
npm run scrape

# Note: No build process needed - this is vanilla HTML/CSS/JS
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Get a free TMDB API key from https://www.themoviedb.org/settings/api
3. Add your API key to `.env`: `TMDB_API_KEY=your_key_here`

## Project Structure

```
K-Drama-top10/
├── index.html              # Main page with Tailwind CDN and layout
├── css/
│   └── style.css          # Custom styles (hover effects, animations, utilities)
├── js/
│   ├── main.js            # Core: data loading, rendering, search, sort, modal
│   ├── chart.js           # Chart.js integration for ranking trends
│   └── youtube.js         # YouTube player utilities (currently basic)
├── data/
│   ├── current.json       # Current month's top 10 rankings
│   └── history/
│       └── YYYY-MM.json   # Monthly snapshots for trend tracking
├── scripts/
│   └── scraper.js         # Data collection from TMDB (FlixPatrol scraping is manual)
└── assets/images/         # Static assets
```

## Code Architecture

### Frontend Flow

1. **index.html**: Single-page structure with semantic sections
   - Header with search/filter controls
   - Main grid for drama cards
   - Chart section for ranking trends
   - Modal for detailed drama info
   - All UI uses Tailwind utility classes

2. **main.js**: Core application logic
   - Loads `data/current.json` on page load
   - Renders drama cards in a responsive grid
   - Handles search (title, description, cast), sort (rank, rating, title, date)
   - Modal management with drama details and Netflix links
   - All functions are synchronous except data loading

3. **chart.js**: Ranking visualization
   - Loads current + historical data from `data/history/`
   - Uses Chart.js to create inverted line charts (rank 1 = top)
   - Dropdown to select drama and view its ranking over time

4. **youtube.js**: Media utilities
   - Helper functions for YouTube embed creation
   - Currently basic - uses simple iframe embeds in modals

### Data Structure

**data/current.json** and **data/history/YYYY-MM.json**:
```json
{
  "month": "2024-11",
  "lastUpdated": "2024-11-09",
  "rankings": [
    {
      "rank": 1,
      "title": "Drama Title",
      "tmdbId": 12345,
      "poster": "https://image.tmdb.org/t/p/w500/...",
      "description": "...",
      "rating": 8.5,
      "releaseDate": "2024-01-01",
      "episodes": 16,
      "director": "Director Name",
      "cast": ["Actor 1", "Actor 2", "Actor 3", "Actor 4"],
      "netflixUrl": "https://www.netflix.com/title/...",
      "youtubeOST": "youtube-video-id",
      "rankChange": 2  // vs previous month (positive = moved up)
    }
  ]
}
```

### Data Collection Workflow

1. **Monthly Update Process**:
   - Check current Netflix K-Drama rankings (manually via FlixPatrol)
   - Update drama titles in `scripts/scraper.js` manualTitles array
   - Run `npm run scrape` to fetch TMDB data (posters, ratings, cast, etc.)
   - Manually add YouTube OST video IDs to `data/current.json`
   - Calculate `rankChange` by comparing with previous month
   - Archive old `current.json` to `data/history/YYYY-MM.json`

2. **scraper.js Logic**:
   - Takes manual title list (FlixPatrol scraping needs HTML inspection)
   - Searches TMDB for each title
   - Fetches detailed info (cast, episodes, ratings, posters)
   - Respects TMDB rate limits (500ms delay between requests)
   - Outputs to `data/current.json`

## Common Development Tasks

### Adding a New Drama Manually

Edit `data/current.json` and add:
```json
{
  "rank": 1,
  "title": "New Drama",
  "tmdbId": 12345,  // Get from TMDB search
  "poster": "https://image.tmdb.org/t/p/w500/posterPath.jpg",
  "description": "Drama synopsis",
  "rating": 8.5,
  "releaseDate": "2024-01-01",
  "episodes": 16,
  "director": "Director Name",
  "cast": ["Lead 1", "Lead 2", "Support 1", "Support 2"],
  "netflixUrl": "https://www.netflix.com/title/81234567",
  "youtubeOST": "dQw4w9WgXcQ",  // YouTube video ID only
  "rankChange": 0
}
```

### Finding YouTube OST Video IDs

1. Search YouTube for "[Drama Title] OST"
2. Copy URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Extract `VIDEO_ID` part only
4. Add to `youtubeOST` field

### Archiving Monthly Data

Before updating for a new month:
```bash
# Copy current data to history
cp data/current.json data/history/2024-11.json

# Then update current.json with new month's data
```

### Styling Changes

- **Global colors/spacing**: Modify Tailwind classes in `index.html`
- **Custom animations/effects**: Edit `css/style.css`
- **Card hover effects**: `.drama-card` class in `css/style.css`
- **Rank badges**: `.rank-badge` class with gradient background

### Deployment to GitHub Pages

1. Ensure all changes are committed
2. Push to `main` branch
3. Enable GitHub Pages in repo settings → Source: main branch
4. Site live at: `https://username.github.io/K-Drama-top10/`

## Important Notes

- **No build process**: This is vanilla HTML/CSS/JS served directly
- **TMDB images**: Uses `w500` size for posters - balanced quality/performance
- **Rate limiting**: Scraper has 500ms delays for TMDB API
- **Browser compatibility**: Modern browsers only (ES6+ features)
- **Mobile-first**: Tailwind responsive classes (sm, md, lg, xl breakpoints)

## External APIs

### TMDB API
- **Search endpoint**: `/search/tv` for finding dramas
- **Details endpoint**: `/tv/{id}` for full information
- **Credits endpoint**: `/tv/{id}/credits` for cast/crew
- **Rate limit**: 40 requests per 10 seconds (scraper respects this)
- **Images**: Auto-served via CDN at `https://image.tmdb.org/t/p/{size}{path}`

### YouTube Iframe API
- Basic embed: `https://www.youtube.com/embed/{VIDEO_ID}`
- Parameters: `?rel=0` (hide related videos)
- Responsive: 16:9 aspect ratio via `.youtube-player` wrapper

## File Modification Guidelines

- **index.html**: Only modify for major layout changes
- **main.js**: Core logic - be careful with data flow
- **chart.js**: Chart config in `updateChart()` function
- **scraper.js**: Update `manualTitles` array monthly
- **data/current.json**: Primary data file - validate JSON before committing
