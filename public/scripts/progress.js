/**
 * Progress Management
 * 
 * Handles saving, loading, and updating progress in the treasure hunt
 */

// Update the progress bar based on found codes
function updateProgressBar() {
    const width = (foundCodes / 5) * 100;
    document.getElementById('progress-fill').style.width = `${width}%`;
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        foundCodes: foundCodes,
        qrCodes: window.qrCodes
    };
    localStorage.setItem('treasureHuntProgress', JSON.stringify(progress));
    console.log('Progress saved:', progress);
}

// Load saved progress from localStorage
function loadSavedProgress() {
    const savedProgress = localStorage.getItem('treasureHuntProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        for (const key in progress.qrCodes) {
            if (window.qrCodes[key]) {
                window.qrCodes[key].found = progress.qrCodes[key].found;
            }
        }
        foundCodes = 0;
        for (const key in window.qrCodes) {
            if (window.qrCodes[key].found) {
                foundCodes++;
                const pointElem = document.getElementById(`point-${window.qrCodes[key].id}`);
                if (pointElem) {
                    pointElem.classList.add('active');
                }
            }
        }
        updateProgressBar();
        console.log(`Loaded saved progress. Found ${foundCodes} QR codes.`);
        if (foundCodes === 5) {
            document.getElementById('treasure-location').textContent = window.treasureLocation;
            showScreen('treasure-screen');
            createConfetti();
        } else if (foundCodes > 0) {
            showScreen('scanner-screen');
            setTimeout(() => {
                startScanner();
            }, 500);
        }
    }
}

// Reset all progress
function resetProgress() {
    console.log("Reset button clicked");
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
        for (const key in window.qrCodes) {
            window.qrCodes[key].found = false;
        }
        
        foundCodes = 0;
        updateProgressBar();
        
        for (let i = 1; i <= 5; i++) {
            const pointElem = document.getElementById(`point-${i}`);
            if (pointElem) {
                pointElem.classList.remove('active');
            }
        }
        
        localStorage.removeItem('treasureHuntProgress');
        
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(err => {
                console.error("Error stopping scanner during reset:", err);
            });
        }
        
        showScreen('welcome-screen');
        
        alert("Progress has been reset. You can start the hunt again.");
        console.log("Reset complete, welcome screen displayed");
    } else {
        console.log("Reset cancelled");
    }
}