// DOM Elements
let title = document.querySelector('#song-title');
let artist = document.querySelector('#song-artist');
let cover = document.querySelector('#song-album');
let playBtn = document.querySelector('#playBtn');
let prevBtn = document.querySelector('#prevBtn');
let nextBtn = document.querySelector('#nextBtn');
let progressBar = document.querySelector('#progressBar');
let currentTimeEl = document.querySelector('.time-current');
let totalTimeEl = document.querySelector('.time-total');

// Tracks Array
const tracks = [
  {
    title: 'I Think They Call This Love',
    artist: 'matthew ifield',
    src: 'assets/music/I Think They Call This Love (Cover).mp3',
    cover: 'assets/images/pic1.jpg'
  },
  {
    title: 'Wanna Be Yours',
    artist: 'artic monkey',
    src: 'assets/music/song2.mp3',
    cover: 'assets/images/pic2.jpg'
  },
  // Add more tracks here
];

// Player State
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Initialize Player
function initializePlayer() {
  loadTrack(currentTrackIndex);
  setupEventListeners();
}

// Load Track
function loadTrack(index) {
  const track = tracks[index];
  
  // Update UI elements
  title.textContent = track.title;
  artist.textContent = track.artist;
  cover.src = track.cover;
  cover.alt = `${track.title} album cover`;
  
  // Update audio source
  audio.src = track.src;
  
  // Reset progress
  progressBar.value = 0;
  
  // Update play button to show play icon
  updatePlayButton(false);
  
  console.log(`Loaded: ${track.title} by ${track.artist}`);
}

// Play/Pause Functions
function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  audio.play()
    .then(() => {
      isPlaying = true;
      updatePlayButton(true);
    })
    .catch(error => {
      console.error('Error playing track:', error);
    });
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  updatePlayButton(false);
}

// Navigation Functions
function nextTrack() {
  const prevIndex = currentTrackIndex;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  
  // Apply background color immediately with the new track index
  if (typeof window.applyBackground === 'function') {
    window.applyBackground(currentTrackIndex);
  }
  
  // Then load the track (which updates UI elements)
  loadTrack(currentTrackIndex);
  
  if (isPlaying) {
    playTrack();
  }
}

function prevTrack() {
  currentTrackIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
  
  // Apply background color immediately with the new track index
  if (typeof window.applyBackground === 'function') {
    window.applyBackground(currentTrackIndex);
  }
  
  // Then load the track (which updates UI elements)
  loadTrack(currentTrackIndex);
  
  if (isPlaying) {
    playTrack();
  }
}

// UI Update Functions
function updatePlayButton(playing) {
  const iconPlay = document.querySelector('#iconPlay');
  const iconPause = document.querySelector('#iconPause');
  
  if (playing) {
    iconPlay?.classList.add('hidden');
    iconPause?.classList.remove('hidden');
  } else {
    iconPlay?.classList.remove('hidden');
    iconPause?.classList.add('hidden');
  }
}

function updateProgress() {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    
    // Update time displays if elements exist
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Progress Bar Control
function setProgress(e) {
  if (audio.duration) {
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Control buttons
  playBtn?.addEventListener('click', togglePlayPause);
  nextBtn?.addEventListener('click', nextTrack);
  prevBtn?.addEventListener('click', prevTrack);
  
  // Progress bar
  progressBar?.addEventListener('input', setProgress);
  
  // Audio events
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', nextTrack);
  audio.addEventListener('loadedmetadata', () => {
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  });
  
  // Error handling
  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    alert('Error loading audio file. Please check the file path.');
  });
}

// Keyboard Controls (Optional)
function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
        nextTrack();
        break;
      case 'ArrowLeft':
        prevTrack();
        break;
    }
  });
}

// Public API
window.musicPlayer = {
  play: playTrack,
  pause: pauseTrack,
  next: nextTrack,
  prev: prevTrack,
  loadTrack: (index) => {
    if (index >= 0 && index < tracks.length) {
      currentTrackIndex = index;
      loadTrack(index);
    }
  },
  getCurrentTrack: () => tracks[currentTrackIndex],
  getAllTracks: () => tracks,
  addTrack: (track) => {
    tracks.push(track);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializePlayer();
  setupKeyboardControls(); // Optional
});

// For immediate initialization if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePlayer);
} else {
  initializePlayer();
}