let timer;
let timeLeft;
let isRunning = false;
let sessionCount = 0;
const workDuration = 25 * 60;
const shortBreakDuration = 5 * 60;
const longBreakDuration = 15 * 60;

// Load sound file
const alarmSound = new Audio("alarm.mp3");

const timerDisplay = document.getElementById("timer");
const sessionTypeDisplay = document.getElementById("session-type");
const sessionIndicator = document.getElementById("session-indicator"); // Added session count display
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                alarmSound.play(); // Play sound when session ends
                handleSessionEnd();
            }
        }, 1000);
    }
}

function handleSessionEnd() {
    sessionCount++;
    sessionIndicator.textContent = `Sessions Completed: ${sessionCount}/4`;

    // Play alarm sound before showing alert
    alarmSound.play();

    if (sessionCount % 4 === 0) {
        timeLeft = longBreakDuration;
        sessionTypeDisplay.textContent = "Long Break";
        updateDisplay();

        startTimer(); // Start long break timer

        // Stop further sessions after long break finishes
        setTimeout(() => {
            stopTimer();
            alert("That's all folks! Press start to do another session.");
            sessionCount = 0;
            timeLeft = workDuration;
            sessionTypeDisplay.textContent = "Work Session";
            sessionIndicator.textContent = "Sessions Completed: 0/4";
            updateDisplay();
        }, longBreakDuration * 1000);
    } else {
        timeLeft = (sessionCount % 2 !== 0) ? shortBreakDuration : workDuration;
        sessionTypeDisplay.textContent = (sessionCount % 2 !== 0) ? "Short Break" : "Work Session";
        updateDisplay();

        setTimeout(() => {
            alert("Session Complete! Starting next phase.");
            startTimer(); // Only continue here for short breaks / work
        }, 100); // Slight delay for sound playback
    }
}



function stopTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    sessionCount = 0;
    timeLeft = workDuration;
    sessionTypeDisplay.textContent = "Work Session";
    sessionIndicator.textContent = "Sessions Completed: 0/4"; // Ensure reset updates UI
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Initialize timer
timeLeft = workDuration;
updateDisplay();
sessionIndicator.textContent = "Sessions Completed: 0/4"; // Initialize session count display

// Event Listeners
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
