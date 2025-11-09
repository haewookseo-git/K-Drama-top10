// YouTube player utility functions
// This file contains helper functions for YouTube iframe API integration

// Load YouTube iframe API (if we need more advanced features in the future)
let youtubeAPIReady = false;

// Initialize YouTube API
function loadYouTubeAPI() {
    if (youtubeAPIReady) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
        youtubeAPIReady = true;
        console.log('YouTube iframe API ready');
    };
}

// Extract YouTube video ID from URL
function extractYouTubeID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Create YouTube embed HTML
function createYouTubeEmbed(videoId, autoplay = false) {
    const autoplayParam = autoplay ? '&autoplay=1' : '';
    return `
        <div class="youtube-player">
            <iframe
                src="https://www.youtube.com/embed/${videoId}?rel=0${autoplayParam}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
    `;
}

// Pause all YouTube videos (useful when closing modal)
function pauseAllYouTubeVideos() {
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    iframes.forEach(iframe => {
        const src = iframe.src;
        iframe.src = src; // Reload iframe to stop video
    });
}

// Optional: Initialize API on page load if needed
// document.addEventListener('DOMContentLoaded', loadYouTubeAPI);
