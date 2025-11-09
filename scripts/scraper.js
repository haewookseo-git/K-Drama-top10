/**
 * Web scraper for K-Drama rankings
 * This script scrapes FlixPatrol for Netflix K-Drama top 10 data
 * and enriches it with TMDB API data
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Configuration
const FLIXPATROL_URL = 'https://flixpatrol.com/top10/netflix/south-korea/';
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Scrape FlixPatrol for current top 10 K-Dramas
 * Note: This is a basic implementation. FlixPatrol's structure may change.
 */
async function scrapeFlixPatrol() {
    try {
        console.log('Scraping FlixPatrol...');
        const response = await axios.get(FLIXPATROL_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const rankings = [];

        // NOTE: This selector is a placeholder and needs to be adjusted based on actual FlixPatrol HTML structure
        // You'll need to inspect FlixPatrol's page to find the correct selectors
        $('.top-list-item').each((index, element) => {
            if (index >= 10) return false; // Only get top 10

            const title = $(element).find('.title').text().trim();
            // Extract more data as needed from the page structure

            if (title) {
                rankings.push({
                    rank: index + 1,
                    title: title
                });
            }
        });

        console.log(`Found ${rankings.length} dramas`);
        return rankings;
    } catch (error) {
        console.error('Error scraping FlixPatrol:', error.message);
        throw error;
    }
}

/**
 * Search TMDB for drama details
 */
async function searchTMDB(dramaTitle) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
            params: {
                api_key: TMDB_API_KEY,
                query: dramaTitle,
                language: 'en-US'
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0]; // Return first result
        }
        return null;
    } catch (error) {
        console.error(`Error searching TMDB for "${dramaTitle}":`, error.message);
        return null;
    }
}

/**
 * Get detailed drama information from TMDB
 */
async function getTMDBDetails(tmdbId) {
    try {
        const [detailsRes, creditsRes] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}`, {
                params: { api_key: TMDB_API_KEY, language: 'en-US' }
            }),
            axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}/credits`, {
                params: { api_key: TMDB_API_KEY, language: 'en-US' }
            })
        ]);

        const details = detailsRes.data;
        const credits = creditsRes.data;

        // Extract cast (top 4)
        const cast = credits.cast
            .slice(0, 4)
            .map(actor => actor.name);

        // Extract director/creator
        const director = details.created_by && details.created_by.length > 0
            ? details.created_by[0].name
            : 'Unknown';

        return {
            tmdbId: details.id,
            poster: details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : null,
            description: details.overview || 'No description available.',
            rating: details.vote_average ? parseFloat(details.vote_average.toFixed(1)) : 0,
            releaseDate: details.first_air_date || 'Unknown',
            episodes: details.number_of_episodes || 0,
            director: director,
            cast: cast
        };
    } catch (error) {
        console.error(`Error getting TMDB details for ID ${tmdbId}:`, error.message);
        return null;
    }
}

/**
 * Main scraping function
 */
async function scrapeAndBuildData() {
    try {
        console.log('Starting data collection...\n');

        // Step 1: Scrape FlixPatrol (or use manual data)
        // For now, we'll use a manual list since FlixPatrol scraping requires
        // inspecting their actual HTML structure
        console.log('Note: FlixPatrol scraping requires manual HTML inspection.');
        console.log('Using manual title list for demonstration.\n');

        const manualTitles = [
            'The Glory',
            'Moving',
            'Squid Game',
            'Crash Landing on You',
            'My Demon',
            'Sweet Home',
            'Queen of Tears',
            'Extraordinary Attorney Woo',
            'Business Proposal',
            'Vincenzo'
        ];

        // Step 2: Enrich with TMDB data
        const enrichedData = [];

        for (let i = 0; i < manualTitles.length; i++) {
            const title = manualTitles[i];
            console.log(`Processing ${i + 1}/10: ${title}`);

            // Search TMDB
            const searchResult = await searchTMDB(title);
            if (!searchResult) {
                console.log(`  ⚠️  TMDB search failed for "${title}"`);
                continue;
            }

            // Get detailed info
            const details = await getTMDBDetails(searchResult.id);
            if (!details) {
                console.log(`  ⚠️  Failed to get details for "${title}"`);
                continue;
            }

            enrichedData.push({
                rank: i + 1,
                title: title,
                ...details,
                netflixUrl: `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
                youtubeOST: '', // Needs to be manually added
                rankChange: 0
            });

            console.log(`  ✓ Successfully processed`);

            // Delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Step 3: Save data
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const outputData = {
            month: currentMonth,
            lastUpdated: new Date().toISOString().split('T')[0],
            rankings: enrichedData
        };

        const outputPath = path.join(__dirname, '../data/current.json');
        await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2));

        console.log(`\n✓ Data saved to ${outputPath}`);
        console.log(`✓ Collected ${enrichedData.length} dramas`);

        return outputData;
    } catch (error) {
        console.error('Error in main scraping function:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    scrapeAndBuildData()
        .then(() => {
            console.log('\n✓ Scraping completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n✗ Scraping failed:', error);
            process.exit(1);
        });
}

module.exports = { scrapeAndBuildData, searchTMDB, getTMDBDetails };
