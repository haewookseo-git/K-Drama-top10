// Main application logic
let currentData = null;
let allDramas = [];
let filteredDramas = [];

// DOM elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const dramaGridEl = document.getElementById('drama-grid');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const lastUpdatedEl = document.getElementById('last-updated');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupEventListeners();
});

// Load current rankings data
async function loadData() {
    try {
        const response = await fetch('data/current.json');
        if (!response.ok) throw new Error('Failed to fetch data');

        currentData = await response.json();
        allDramas = currentData.rankings;
        filteredDramas = [...allDramas];

        displayDramas(filteredDramas);
        lastUpdatedEl.textContent = formatDate(currentData.lastUpdated);

        loadingEl.classList.add('hidden');
        dramaGridEl.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading data:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
}

// Display dramas in grid
function displayDramas(dramas) {
    dramaGridEl.innerHTML = dramas.map(drama => createDramaCard(drama)).join('');

    // Add click listeners to cards
    document.querySelectorAll('.drama-card').forEach(card => {
        card.addEventListener('click', () => {
            const dramaId = parseInt(card.dataset.tmdbId);
            const drama = allDramas.find(d => d.tmdbId === dramaId);
            showModal(drama);
        });
    });
}

// Create drama card HTML
function createDramaCard(drama) {
    const rankChangeIcon = getRankChangeIcon(drama.rankChange);

    return `
        <div class="drama-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative" data-tmdb-id="${drama.tmdbId}">
            <div class="rank-badge">#${drama.rank}</div>

            <div class="aspect-[2/3] overflow-hidden bg-gray-200">
                <img
                    src="${drama.poster}"
                    alt="${drama.title}"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'"
                >
            </div>

            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 line-clamp-1">${drama.title}</h3>

                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-1">
                        <span class="rating-stars">★</span>
                        <span class="text-sm font-semibold">${drama.rating}</span>
                    </div>
                    <span class="text-sm text-gray-600">${drama.episodes} episodes</span>
                </div>

                <p class="text-sm text-gray-600 line-clamp-2 mb-3">${drama.description}</p>

                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>${new Date(drama.releaseDate).getFullYear()}</span>
                    ${rankChangeIcon}
                </div>
            </div>
        </div>
    `;
}

// Get rank change indicator
function getRankChangeIcon(change) {
    if (change > 0) {
        return `<span class="rank-up font-semibold">↑ ${change}</span>`;
    } else if (change < 0) {
        return `<span class="rank-down font-semibold">↓ ${Math.abs(change)}</span>`;
    } else {
        return `<span class="rank-same">—</span>`;
    }
}

// Show modal with drama details
function showModal(drama) {
    modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h2 class="text-3xl font-bold text-gray-900">${drama.title}</h2>
            <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <!-- Poster -->
            <div>
                <img
                    src="${drama.poster}"
                    alt="${drama.title}"
                    class="w-full rounded-lg shadow-lg"
                    onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'"
                >
            </div>

            <!-- Details -->
            <div>
                <div class="mb-4">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-3xl rating-stars">★</span>
                        <span class="text-2xl font-bold">${drama.rating}</span>
                        <span class="text-gray-600">/10</span>
                    </div>
                    <div class="text-sm text-gray-600">
                        Rank: <span class="font-semibold">#${drama.rank}</span>
                        ${drama.rankChange !== 0 ? getRankChangeIcon(drama.rankChange) : ''}
                    </div>
                </div>

                <div class="space-y-3 mb-6">
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Synopsis</h3>
                        <p class="text-gray-700">${drama.description}</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Director</h3>
                        <p class="text-gray-700">${drama.director}</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Cast</h3>
                        <p class="text-gray-700">${drama.cast.join(', ')}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-1">Release Date</h3>
                            <p class="text-gray-700">${formatDate(drama.releaseDate)}</p>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-1">Episodes</h3>
                            <p class="text-gray-700">${drama.episodes}</p>
                        </div>
                    </div>
                </div>

                <a
                    href="${drama.netflixUrl}"
                    target="_blank"
                    class="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Watch on Netflix →
                </a>
            </div>
        </div>

        <!-- OST Player -->
        ${drama.youtubeOST ? `
            <div class="mt-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">🎵 Official Soundtrack</h3>
                <div class="youtube-player">
                    <iframe
                        src="https://www.youtube.com/embed/${drama.youtubeOST}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        ` : ''}
    `;

    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        filterAndSort();
    });

    // Sort
    sortSelect.addEventListener('change', (e) => {
        filterAndSort();
    });
}

// Filter and sort dramas
function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    // Filter
    filteredDramas = allDramas.filter(drama => {
        return drama.title.toLowerCase().includes(searchTerm) ||
               drama.description.toLowerCase().includes(searchTerm) ||
               drama.cast.some(actor => actor.toLowerCase().includes(searchTerm));
    });

    // Sort
    switch (sortBy) {
        case 'rank':
            filteredDramas.sort((a, b) => a.rank - b.rank);
            break;
        case 'rating':
            filteredDramas.sort((a, b) => b.rating - a.rating);
            break;
        case 'title':
            filteredDramas.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'date':
            filteredDramas.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            break;
    }

    displayDramas(filteredDramas);
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
