/**
 * FlixPatrol Web Scraper for K-Drama Rankings
 * This script scrapes FlixPatrol for Netflix K-Drama top 10 data
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const FLIXPATROL_URL = 'https://flixpatrol.com/top10/netflix/south-korea/';
const OUTPUT_PATH = path.join(__dirname, '../data/current.json');

/**
 * Scrape FlixPatrol for current top 10 K-Dramas
 */
async function scrapeFlixPatrol() {
    console.log('🚀 Starting FlixPatrol scraper...\n');

    let browser;
    try {
        // Launch browser
        console.log('📱 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set user agent to avoid being blocked
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log('🌐 Navigating to FlixPatrol...');
        await page.goto(FLIXPATROL_URL, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait for content to load
        console.log('⏳ Waiting for content to load...');
        await page.waitForSelector('.table-wrapper', { timeout: 30000 });

        console.log('📊 Extracting drama data...\n');

        // Extract data from the page
        const dramas = await page.evaluate(() => {
            const results = [];

            // FlixPatrol uses a table structure - adjust selectors based on actual site structure
            // This is a generic implementation that may need adjustment
            const rows = document.querySelectorAll('.table-wrapper table tbody tr');

            let rank = 1;
            rows.forEach((row, index) => {
                if (index >= 10) return; // Only top 10

                try {
                    // Extract title - adjust selector based on actual structure
                    const titleElement = row.querySelector('.title, .show-title, td:nth-child(2) a, .top-list-item-title');
                    const title = titleElement ? titleElement.textContent.trim() : null;

                    if (!title) return;

                    // Extract poster/image - adjust selector based on actual structure
                    const imgElement = row.querySelector('img, .poster img, td:nth-child(1) img');
                    const poster = imgElement ? imgElement.src : null;

                    // Extract Netflix URL if available
                    const netflixLink = row.querySelector('a[href*="netflix.com"]');
                    const netflixUrl = netflixLink ? netflixLink.href : `https://www.netflix.com/search?q=${encodeURIComponent(title)}`;

                    // Try to extract description if available
                    const descElement = row.querySelector('.description, .synopsis, .plot');
                    const description = descElement ? descElement.textContent.trim() : '';

                    results.push({
                        rank: rank++,
                        title: title,
                        poster: poster,
                        description: description || 'No description available.',
                        netflixUrl: netflixUrl
                    });
                } catch (e) {
                    console.error(`Error processing row ${index}:`, e.message);
                }
            });

            return results;
        });

        console.log(`✅ Found ${dramas.length} dramas\n`);

        // Display found dramas
        dramas.forEach(drama => {
            console.log(`${drama.rank}. ${drama.title}`);
        });

        await browser.close();
        return dramas;

    } catch (error) {
        console.error('❌ Error scraping FlixPatrol:', error.message);
        if (browser) await browser.close();
        throw error;
    }
}

/**
 * Enrich drama data with default values
 */
function enrichDramaData(dramas) {
    return dramas.map(drama => ({
        rank: drama.rank,
        title: drama.title,
        tmdbId: 0, // Not using TMDB anymore
        poster: drama.poster || 'https://via.placeholder.com/300x450?text=No+Image',
        description: drama.description || 'No description available.',
        rating: 0, // Will need manual update or alternative source
        releaseDate: new Date().toISOString().split('T')[0], // Default to today
        episodes: 0, // Will need manual update
        director: 'Unknown',
        cast: [],
        netflixUrl: drama.netflixUrl,
        youtubeOST: '', // Needs manual addition
        rankChange: 0
    }));
}

/**
 * Save data to JSON file
 */
async function saveData(dramas) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const today = new Date().toISOString().split('T')[0];

    const outputData = {
        month: currentMonth,
        lastUpdated: today,
        rankings: dramas
    };

    await fs.writeFile(OUTPUT_PATH, JSON.stringify(outputData, null, 2));
    console.log(`\n💾 Data saved to ${OUTPUT_PATH}`);
    return outputData;
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('═══════════════════════════════════════');
        console.log('  FlixPatrol K-Drama Scraper');
        console.log('═══════════════════════════════════════\n');

        // Step 1: Scrape FlixPatrol
        const rawDramas = await scrapeFlixPatrol();

        if (rawDramas.length === 0) {
            throw new Error('No dramas found. FlixPatrol structure may have changed.');
        }

        // Step 2: Enrich with default data
        console.log('\n🔧 Enriching data with default values...');
        const enrichedDramas = enrichDramaData(rawDramas);

        // Step 3: Save to file
        await saveData(enrichedDramas);

        console.log('\n✅ Scraping completed successfully!');
        console.log('\n⚠️  NEXT STEPS:');
        console.log('1. Review data/current.json');
        console.log('2. Manually update: rating, releaseDate, episodes, director, cast');
        console.log('3. Add YouTube OST video IDs for each drama');
        console.log('4. Verify poster image URLs are working');
        console.log('\n═══════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ Scraping failed:', error.message);
        console.error('\n💡 TIP: FlixPatrol may have changed its HTML structure.');
        console.error('   You may need to inspect the page and update the selectors in scraper.js');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { scrapeFlixPatrol, enrichDramaData, saveData };
