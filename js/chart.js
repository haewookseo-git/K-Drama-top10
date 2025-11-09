// Ranking history chart functionality
let rankingChart = null;
let historyData = [];

// Initialize chart functionality
document.addEventListener('DOMContentLoaded', async () => {
    await loadHistoryData();
    setupChartListeners();
});

// Load all history data
async function loadHistoryData() {
    try {
        // Load current month
        const currentResponse = await fetch('data/current.json');
        const currentData = await currentResponse.json();

        // Try to load previous months (we'll expand this as we add more data)
        const historyMonths = ['2024-10']; // Add more months as they become available
        const historyPromises = historyMonths.map(month =>
            fetch(`data/history/${month}.json`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        );

        const historyResults = await Promise.all(historyPromises);
        historyData = [currentData, ...historyResults.filter(data => data !== null)];

        // Sort by month
        historyData.sort((a, b) => new Date(a.month) - new Date(b.month));

        if (historyData.length > 1) {
            populateChartDramaSelect();
            document.getElementById('chart-section').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading history data:', error);
    }
}

// Populate drama select dropdown
function populateChartDramaSelect() {
    const select = document.getElementById('chart-drama-select');
    const currentDramas = historyData[historyData.length - 1].rankings;

    // Get unique dramas from current month
    currentDramas.forEach(drama => {
        const option = document.createElement('option');
        option.value = drama.tmdbId;
        option.textContent = drama.title;
        select.appendChild(option);
    });
}

// Setup chart event listeners
function setupChartListeners() {
    const select = document.getElementById('chart-drama-select');
    select.addEventListener('change', (e) => {
        const tmdbId = parseInt(e.target.value);
        if (tmdbId) {
            updateChart(tmdbId);
        } else {
            // Clear chart
            if (rankingChart) {
                rankingChart.destroy();
                rankingChart = null;
            }
        }
    });
}

// Update chart with drama ranking history
function updateChart(tmdbId) {
    const dramaHistory = [];
    const labels = [];

    // Collect ranking data across months
    historyData.forEach(monthData => {
        const drama = monthData.rankings.find(d => d.tmdbId === tmdbId);
        if (drama) {
            dramaHistory.push(drama.rank);
        } else {
            dramaHistory.push(null); // Not in top 10 that month
        }
        labels.push(formatMonthLabel(monthData.month));
    });

    // Destroy previous chart if exists
    if (rankingChart) {
        rankingChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('ranking-chart').getContext('2d');
    rankingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ranking',
                data: dramaHistory,
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#dc2626',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const rank = context.parsed.y;
                            return rank ? `Rank: #${rank}` : 'Not in Top 10';
                        }
                    }
                }
            },
            scales: {
                y: {
                    reverse: true, // Lower rank number = better position
                    min: 1,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return '#' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Format month label
function formatMonthLabel(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
