# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

K-Drama Top 10 is a static website that displays Netflix's top 10 Korean dramas with detailed information, ranking trends, and OST music players. The site features a modern, minimalist design built with vanilla JavaScript and Tailwind CSS.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Data Visualization**: Chart.js
- **Media Integration**: YouTube iframe API
- **Data Collection**: Node.js + Puppeteer (FlixPatrol web scraping)
- **Deployment**: GitHub Pages (static hosting)

## Development Commands

```bash
# Install dependencies (for scraping tools only)
npm install

# Run local development server
npm run dev
# Opens http://localhost:8080

# Scrape and update data from FlixPatrol
npm run scrape

# Note: No build process needed - this is vanilla HTML/CSS/JS
```

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
│   └── scraper.js         # FlixPatrol web scraper using Puppeteer
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
   - Run `npm run scrape` to automatically scrape FlixPatrol for current rankings
   - Script outputs basic data (rank, title, poster, description, Netflix URL)
   - Manually enrich `data/current.json` with missing data (rating, episodes, director, cast, YouTube OST)
   - Calculate `rankChange` by comparing with previous month
   - Archive old `current.json` to `data/history/YYYY-MM.json`

2. **scraper.js Logic**:
   - Uses Puppeteer to load FlixPatrol's South Korea Netflix page
   - Extracts ranking data from HTML table structure
   - Automatically captures: rank, title, poster image, description (if available), Netflix URL
   - Outputs skeleton data to `data/current.json`
   - Manual follow-up needed: rating, releaseDate, episodes, director, cast, youtubeOST

3. **Important Notes**:
   - FlixPatrol's HTML structure may change - selectors in scraper.js may need updates
   - First run will download Chromium for Puppeteer (~300MB)
   - Some fields (rating, cast, etc.) not available from FlixPatrol - manual entry required

## Common Development Tasks

### Adding a New Drama Manually

Edit `data/current.json` and add:
```json
{
  "rank": 1,
  "title": "New Drama",
  "tmdbId": 0,  // Legacy field, no longer used
  "poster": "https://example.com/poster.jpg",
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
- **Web scraping**: Uses Puppeteer for FlixPatrol - may break if site structure changes
- **Chromium download**: First `npm install` downloads Chromium (~300MB)
- **Manual enrichment**: Rating, cast, director must be added manually after scraping
- **Browser compatibility**: Modern browsers only (ES6+ features)
- **Mobile-first**: Tailwind responsive classes (sm, md, lg, xl breakpoints)

## External Services

### FlixPatrol
- **URL**: https://flixpatrol.com/top10/netflix/south-korea/
- **Method**: Web scraping with Puppeteer
- **Data extracted**: Rank, title, poster, description (partial), Netflix URL
- **Limitations**: No ratings, cast, or episode counts - manual entry required
- **Maintenance**: HTML selectors may need updates if FlixPatrol changes their layout

### YouTube Iframe API
- Basic embed: `https://www.youtube.com/embed/{VIDEO_ID}`
- Parameters: `?rel=0` (hide related videos)
- Responsive: 16:9 aspect ratio via `.youtube-player` wrapper

## File Modification Guidelines

- **index.html**: Only modify for major layout changes
- **main.js**: Core logic - be careful with data flow
- **chart.js**: Chart config in `updateChart()` function
- **scraper.js**: May need selector updates if FlixPatrol HTML changes
- **data/current.json**: Primary data file - validate JSON before committing
