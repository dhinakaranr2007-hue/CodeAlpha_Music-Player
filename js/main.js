// --- Global DOM Elements ---
const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const imgContainer = document.querySelector('.img-container');
// Reference the main container to trigger arm animation via class toggle
const playerContainer = document.querySelector('.player-container');


// --- 1. Playlist Data ---
const songs = [
    // IMPORTANT: Ensure you have music files (track1.mp3, track2.mp3, etc.)
    // and images (art1.jpg, art2.jpg, etc.) in the correct folders!
    { title: 'Beyond the Horizon', artist: ' Beats', src: 'music/track1.mp3', cover: 'samueldhinakaranimages/samuel.png' },
    { title: 'Coding Flow', artist: 'Raja Tech', src: 'music/track2.mp3', cover: 'samueldhinakaranimages/samuel.png' },
    { title: 'Pixel Dream', artist: 'The Dev', src: 'music/track3.mp3', cover:'samueldhinakaranimages/samuel.png'}
];

let songIndex = 0;
let isPlaying = false;


// --- 2. Core Functions ---

// Load Song Details
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    
    // Set total duration when metadata is loaded
    audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        updateProgress({ target: audio });
    };
}

// Play Song
function playSong() {
    isPlaying = true;
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    
    // START ROTATION & ARM ANIMATION
    imgContainer.classList.add('play'); // Start album art spin
    playerContainer.classList.add('playing'); // Move arm into position
    
    audio.play();
}

// Pause Song
function pauseSong() {
    isPlaying = false;
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    
    // STOP ROTATION & MOVE ARM OUT
    imgContainer.classList.remove('play'); // Stop album art spin
    playerContainer.classList.remove('playing'); // Move arm to resting position
    
    audio.pause();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) { songIndex = 0; }
    loadSong(songs[songIndex]);
    playSong();
}

// Previous Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) { songIndex = songs.length - 1; }
    loadSong(songs[songIndex]);
    playSong();
}


// --- 3. Progress and Time Functions ---

// Format time from seconds
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Update Progress Bar and Time
function updateProgress(e) {
    const { duration, currentTime } = e.target;
    
    if (isNaN(duration)) return; // Prevents error if metadata is not loaded
    
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeSpan.innerText = formatTime(currentTime);
}

// Set Total Duration
function setDuration(duration) {
    durationSpan.innerText = formatTime(duration);
}

// Skip to a specific spot in the song (Seek)
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}


// --- 4. Event Listeners and Initialization ---
playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong); // Autoplay

// Volume Control
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});


// --- Initialization ---
loadSong(songs[songIndex]); 
audio.volume = volumeControl.value;