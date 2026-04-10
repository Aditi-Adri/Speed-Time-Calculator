// Default speed (load from storage if available)
let currentSpeed = parseFloat(localStorage.getItem('preferredPlaybackSpeed')) || 1.5;

function setSpeed(speed) {
    currentSpeed = speed;
    localStorage.setItem('preferredPlaybackSpeed', speed);
    document.getElementById('speedSlider').value = speed;
    updateSpeedUI();
    calculateTime();
}

function updateSpeedFromSlider() {
    currentSpeed = parseFloat(document.getElementById('speedSlider').value);
    localStorage.setItem('preferredPlaybackSpeed', currentSpeed);
    updateSpeedUI();
    calculateTime();
}

function updateSpeedUI() {
    // Update label
    document.getElementById('currentSpeedLabel').innerText = currentSpeed.toFixed(2) + 'x';
    
    // Update buttons active state
    const buttons = document.querySelectorAll('.speed-btn');
    buttons.forEach(btn => {
        if (parseFloat(btn.innerText) === currentSpeed) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function calculateTime() {
    // Get input values
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    // Calculate total original seconds
    const totalOriginalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalOriginalSeconds === 0) {
        document.getElementById('resultTime').innerText = "0h 0m 0s";
        document.getElementById('timeSaved').style.opacity = 0;
        return;
    }

    // Calculate new total seconds based on speed
    const newTotalSeconds = totalOriginalSeconds / currentSpeed;

    // Convert back to hours, minutes, seconds
    const newHours = Math.floor(newTotalSeconds / 3600);
    const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
    const newSecs = Math.floor(newTotalSeconds % 60);

    // Format output
    let resultText = "";
    if (newHours > 0) resultText += newHours + "h ";
    if (newMinutes > 0 || newHours > 0) resultText += newMinutes + "m ";
    resultText += newSecs + "s";

    document.getElementById('resultTime').innerText = resultText;

    // Calculate time saved/lost
    const timeSavedSeconds = totalOriginalSeconds - newTotalSeconds;
    const timeSavedElement = document.getElementById('timeSaved');
    
    if (timeSavedSeconds > 0) {
        const savedMins = Math.round(timeSavedSeconds / 60);
        if(savedMins > 0) {
            timeSavedElement.innerHTML = `<i class="fas fa-bolt mr-1"></i>You save ${savedMins} minute${savedMins !== 1 ? 's' : ''}!`;
            timeSavedElement.className = "mt-2 text-sm text-green-400 font-medium transition-opacity opacity-100";
        } else {
            timeSavedElement.style.opacity = 0;
        }
    } else if (timeSavedSeconds < 0) {
        const lostMins = Math.round(Math.abs(timeSavedSeconds) / 60);
        if (lostMins > 0) {
            timeSavedElement.innerHTML = `<i class="fas fa-hourglass-half mr-1"></i>It takes ${lostMins} minute${lostMins !== 1 ? 's' : ''} longer`;
            timeSavedElement.className = "mt-2 text-sm text-red-400 font-medium transition-opacity opacity-100";
        } else {
             timeSavedElement.style.opacity = 0;
        }
    } else {
        timeSavedElement.style.opacity = 0;
    }

    // Feature: Finish Time Estimation
    const finishTimeElement = document.getElementById('finishTime');
    if (totalOriginalSeconds > 0) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + newTotalSeconds);
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        finishTimeElement.innerText = timeString;
    } else {
        finishTimeElement.innerText = '--:--';
    }
}

function clearFields() {
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
    calculateTime();
}

// Initialize UI
updateSpeedUI();
calculateTime();