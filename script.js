// background music logic

const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2; // adjust volume

// --- configuration for each mode (in seconds) ---
const MODES = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};



let currentMode = 'pomodoro';
let remainingSec = MODES[currentMode];
let timerInterval = null;
let isRunning = false;

// grab DOM
const modeButtons = document.querySelectorAll('#buttons button');
const displayEl = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const volumeBtn = document.getElementById('volume-off');

// set initial volume icon (playing by default)
volumeBtn.classList.add('ri-volume-up-fill');

// format seconds → "MM:SS"
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// update the display
function updateDisplay() {
  displayEl.textContent = formatTime(remainingSec);
}

// switch mode handler
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // clear any running timer
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'start';

    // set active button
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // switch mode
    currentMode = btn.dataset.mode;
    remainingSec = MODES[currentMode];
    updateDisplay();
  });
});

// start / pause handler

const audio = new Audio('notification.mp3');

function playAudioForDuration(duration) {
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, duration);
}
startBtn.addEventListener('click', () => {
  if (!isRunning) {
    // start countdown
    timerInterval = setInterval(() => {
      if (remainingSec > 0) {
        remainingSec--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'start';
        backgroundMusic.pause();  // pause music when done
        // you could play a sound or auto-switch here
        playAudioForDuration(7000);
      }
    }, 1000);
    startBtn.textContent = 'pause';
    isRunning = true;
    backgroundMusic.play(); // 🎵 Start music

  } else {
    // pause
    clearInterval(timerInterval);
    startBtn.textContent = 'start';
    isRunning = false;
    backgroundMusic.pause();

  }
});

// reset handler
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
  remainingSec = MODES[currentMode];
  updateDisplay();
  startBtn.textContent = 'start';
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
});

// volume toggle handler
volumeBtn.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    volumeBtn.classList.replace('ri-volume-mute-fill', 'ri-volume-up-fill');
  } else {
    backgroundMusic.pause();
    volumeBtn.classList.replace('ri-volume-up-fill', 'ri-volume-mute-fill');
  }
});

// initialize display
updateDisplay();
