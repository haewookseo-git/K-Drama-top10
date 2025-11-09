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
- **Data Collection**: Node.js, Axios, Cheerio
- **External API**: TMDB (The Movie Database)
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/K-Drama-top10.git
cd K-Drama-top10
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your TMDB API key
```

4. Run the development server:
```bash
npm run dev
```

The site will open at `http://localhost:8080`

## 📊 Data Collection

### Manual Update (Recommended)

1. Update the drama titles in `scripts/scraper.js` based on current Netflix rankings
2. Run the scraper to fetch TMDB data:
```bash
npm run scrape
```
3. Manually add YouTube OST video IDs to the generated `data/current.json`
4. Archive the previous month's data to `data/history/YYYY-MM.json`

### Automated Scraping (Advanced)

The scraper includes basic FlixPatrol scraping functionality, but requires:
- Inspecting FlixPatrol's HTML structure
- Updating CSS selectors in `scripts/scraper.js`
- Potentially handling anti-scraping measures

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
  "tmdbId": 12345,
  "poster": "https://image.tmdb.org/t/p/w500/...",
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

- Data sourced from [FlixPatrol](https://flixpatrol.com/)
- Drama information from [TMDB](https://www.themoviedb.org/)
- This is an unofficial fan project and is not affiliated with Netflix

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.
