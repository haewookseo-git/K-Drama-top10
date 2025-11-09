# 🎬 K-Drama Top 10

A modern, minimalist website displaying the top 10 Korean dramas on Netflix with detailed information, ranking trends, and OST music players.

## ✨ Features

- **Top 10 Rankings**: View the current month's top K-Dramas on Netflix
- **Detailed Information**: Posters, descriptions, ratings, release dates, episodes, directors, and cast
- **Ranking Trends**: Interactive charts showing monthly ranking changes
- **OST Player**: Embedded YouTube players for official soundtracks
- **Search & Filter**: Find dramas by title, description, or cast members
- **Sort Options**: Sort by rank, rating, title, or release date
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🛠 Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Data Visualization**: Chart.js
- **Media**: YouTube iframe API
- **Data Collection**: Node.js, Puppeteer (FlixPatrol web scraping)
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- ~300MB disk space for Chromium (downloaded automatically by Puppeteer)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/K-Drama-top10.git
cd K-Drama-top10
```

2. Install dependencies (includes Puppeteer and Chromium):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The site will open at `http://localhost:8080`

## 📊 Data Collection

### Automated Scraping

Run the scraper to automatically fetch data from FlixPatrol:

```bash
npm run scrape
```

**What the scraper does:**
- Launches a headless browser using Puppeteer
- Navigates to FlixPatrol's South Korea Netflix rankings
- Extracts: rank, title, poster image, description, Netflix URL
- Saves to `data/current.json`

**What you need to do manually:**
1. Review the generated `data/current.json`
2. Add missing information (rating, episodes, director, cast)
3. Add YouTube OST video IDs for each drama
4. Calculate `rankChange` by comparing with previous month
5. Archive previous month's data to `data/history/YYYY-MM.json`

### Troubleshooting

If the scraper fails:
- FlixPatrol may have changed their HTML structure
- Update the CSS selectors in `scripts/scraper.js` (lines 60-75)
- Check the console output for specific error messages

## 📁 Project Structure

```
K-Drama-top10/
├── index.html              # Main page
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── main.js            # Core functionality
│   ├── chart.js           # Ranking charts
│   └── youtube.js         # YouTube player utilities
├── data/
│   ├── current.json       # Current month rankings
│   └── history/
│       └── YYYY-MM.json   # Monthly snapshots
├── scripts/
│   └── scraper.js         # Data collection script
├── assets/
│   └── images/            # Logo, icons, etc.
└── package.json
```

## 🎨 Customization

### Adding New Dramas

Edit `data/current.json` following this structure:

```json
{
  "rank": 1,
  "title": "Drama Title",
  "tmdbId": 0,
  "poster": "https://example.com/poster.jpg",
  "description": "...",
  "rating": 8.5,
  "releaseDate": "2024-01-01",
  "episodes": 16,
  "director": "Director Name",
  "cast": ["Actor 1", "Actor 2"],
  "netflixUrl": "https://www.netflix.com/title/...",
  "youtubeOST": "youtube-video-id",
  "rankChange": 0
}
```

### Styling

- Tailwind CSS classes can be modified directly in `index.html`
- Custom styles are in `css/style.css`
- Color scheme can be changed by updating Tailwind color classes

## 🌐 Deployment

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Select the main branch as source
3. Your site will be live at `https://yourusername.github.io/K-Drama-top10/`

### Other Platforms

The site is static HTML/CSS/JS, so it can be deployed to:
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Ranking data sourced from [FlixPatrol](https://flixpatrol.com/)
- This is an unofficial fan project and is not affiliated with Netflix or FlixPatrol

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.
