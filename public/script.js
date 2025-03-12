let html5QrCode;
let foundCodes = 0;

// Create particles for visual enhancement
function createParticles() {
    const body = document.body;
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.left = Math.random() * 100 + 'vw';
        
        particle.style.opacity = Math.random() * 0.6 + 0.1;
        
        const duration = Math.random() * 60 + 30;
        const delay = Math.random() * 10;
        
        particle.style.animation = `float ${duration}s ${delay}s infinite alternate`;
        
        body.appendChild(particle);
    }
}

// Save progress tracking
function saveProgress() {
    const progress = {
        foundCodes: foundCodes,
        qrCodes: window.qrCodes
    };
    localStorage.setItem('treasureHuntProgress', JSON.stringify(progress));
    console.log('Progress saved');
}

// Load saved progress
function loadSavedProgress() {
    const savedProgress = localStorage.getItem('treasureHuntProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Restore QR codes state
        for (const key in progress.qrCodes) {
            if (window.qrCodes[key]) {
                window.qrCodes[key].found = progress.qrCodes[key].found;
            }
        }
        
        // Count found codes
        foundCodes = 0;
        for (const key in window.qrCodes) {
            if (window.qrCodes[key].found) {
                foundCodes++;
                document.getElementById(`point-${window.qrCodes[key].id}`).classList.add('active');
            }
        }
        
        // Update progress bar
        updateProgressBar();
        
        console.log(`Loaded saved progress. Found ${foundCodes} QR codes.`);
        
        // If all codes are found, show the treasure screen
        if (foundCodes === 5) {
            document.getElementById('treasure-location').textContent = window.treasureLocation;
            showScreen('treasure-screen');
            createConfetti();
        }
        // If at least one code found but not all, show the scanner
        else if (foundCodes > 0) {
            showScreen('scanner-screen');
            setTimeout(() => {
                startScanner();
            }, 500);
        }
    }
}

// Show a specific screen and hide others
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Update the progress bar based on found codes
function updateProgressBar() {
    const width = (foundCodes / 5) * 100;
    document.getElementById('progress-fill').style.width = `${width}%`;
}

// Start the game
function startGame() {
    showScreen('scanner-screen');
    startScanner();
}

// Initialize and start the QR scanner
function startScanner() {
    document.getElementById('camera-status').textContent = "Starting camera...";
    document.getElementById('scanner-error').style.display = "none";
    
    // If a scanner is already running, stop it first
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            initializeScanner();
        }).catch(err => {
            console.error("Error stopping scanner:", err);
            initializeScanner();
        });
    } else {
        initializeScanner();
    }
}

// Initialize the QR scanner
function initializeScanner() {
    html5QrCode = new Html5Qrcode("reader");
    
    const qrCodeSuccessCallback = (decodedText) => {
        // Stop the scanner once a QR code is found
        html5QrCode.stop().then(() => {
            console.log("Scanner stopped after successful scan");
            processQrCode(decodedText);
        }).catch(err => {
            console.error("Error stopping scanner:", err);
        });
    };
    
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };
    
    document.getElementById('camera-status').textContent = "Accessing camera...";
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
            console.error(errorMessage);
        }
    ).then(() => {
        document.getElementById('camera-status').textContent = "Camera active! Point at a QR code.";
    }).catch((err) => {
        console.error("Error starting scanner:", err);
        document.getElementById('scanner-error').style.display = "block";
        document.getElementById('scanner-error').innerHTML = 
            "Camera access error: " + err + "<br>Try using a different browser or check camera permissions.";
        document.getElementById('camera-status').textContent = "Camera not available.";
    });
}

// Process a scanned QR code
function processQrCode(qrValue) {
    // Check if this is one of our QR codes
    if (window.qrCodes[qrValue]) {
        const qrCode = window.qrCodes[qrValue];
        
        // Check if this code has already been found
        if (qrCode.found) {
            alert("You've already found this QR code!");
            startScanner(); // Restart the scanner
            return;
        }
        
        // Mark as found
        qrCode.found = true;
        foundCodes++;
        
        // Save progress
        saveProgress();
        
        // Update UI
        document.getElementById(`point-${qrCode.id}`).classList.add('active');
        updateProgressBar();
        
        // Show the clue
        document.getElementById('found-which-qr').textContent = `You found QR Code #${qrCode.id}!`;
        document.getElementById('clue-content').textContent = qrCode.clue;
        document.getElementById('next-hint').textContent = qrCode.nextHint;
        
        showScreen('clue-screen');
        
        // If all codes are found, show the treasure screen
        if (foundCodes === 5) {
            setTimeout(() => {
                document.getElementById('treasure-location').textContent = window.treasureLocation;
                showScreen('treasure-screen');
                createConfetti();
            }, 5000);
        }
    } else {
        alert("This doesn't seem to be one of the treasure hunt QR codes. Keep looking!");
        startScanner(); // Restart the scanner
    }
}

// Show manual entry dialog
function showManualEntry() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Add title
    const title = document.createElement('h3');
    title.className = 'modal-title';
    title.textContent = 'Enter QR Code Manually';
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'If camera scanning isn\'t working, enter the QR code value manually:';
    
    // Add input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'modal-input';
    input.placeholder = 'Enter QR Code (e.g., QR_CODE_1)';
    
    // Add buttons
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel';
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit';
    
    // Add event listeners
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        startScanner();
    });
    
    submitBtn.addEventListener('click', () => {
        const qrValue = input.value.trim();
        if (qrValue) {
            document.body.removeChild(modal);
            processQrCode(qrValue);
        } else {
            alert('Please enter a valid QR code.');
        }
    });
    
    // Assemble modal
    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);
    
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(input);
    modalContent.appendChild(actions);
    
    modal.appendChild(modalContent);
    
    // Stop scanner while modal is open
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
            console.error("Error stopping scanner:", err);
        });
    }
    
    // Add to body and focus
    document.body.appendChild(modal);
    setTimeout(() => {
        input.focus();
    }, 100);
}

// Return to scanner from clue screen
function returnToScanner() {
    showScreen('scanner-screen');
    startScanner();
}

// Reset all progress
function resetProgress() {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
        // Reset QR codes
        for (const key in window.qrCodes) {
            window.qrCodes[key].found = false;
        }
        
        // Reset UI
        foundCodes = 0;
        updateProgressBar();
        
        // Reset progress points
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`point-${i}`).classList.remove('active');
        }
        
        // Clear local storage
        localStorage.removeItem('treasureHuntProgress');
        
        // Stop scanner if running
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(err => {
                console.error("Error stopping scanner:", err);
            });
        }
        
        // Show welcome screen
        showScreen('welcome-screen');
        
        alert("Progress has been reset. You can start the hunt again.");
    }
}

// Create confetti effect
function createConfetti() {
    const appContainer = document.querySelector('.app-container');
    const confettiColors = ['#2196F3', '#03A9F4', '#00BCD4', '#3F51B5', '#673AB7', '#4CAF50', '#8BC34A', '#FFEB3B'];
    const confettiShapes = ['square', 'circle', 'triangle'];
    
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random position
            confetti.style.left = Math.random() * 100 + '%';
            
            // Random color
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            
            // Random shape
            const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = '5px solid transparent';
                confetti.style.borderRight = '5px solid transparent';
                confetti.style.borderBottom = '10px solid ' + confettiColors[Math.floor(Math.random() * confettiColors.length)];
            }
            
            // Random size
            const size = Math.random() * 10 + 5;
            if (shape !== 'triangle') {
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
            }
            
            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Random animation duration and delay
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 5) + 's';
            
            appContainer.appendChild(confetti);
            
            // Remove after animation completes
            setTimeout(() => {
                if (appContainer.contains(confetti)) {
                    appContainer.removeChild(confetti);
                }
            }, 8000);
        }, i * 25);  // More staggered for a longer effect
    }
}

// Create particle background on page load
window.onload = function() {
    loadSavedProgress();
    createParticles();
};