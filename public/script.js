let html5QrCode;
let foundCodes = 0;

// Check for camera support
function checkCameraSupport() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera access is not supported on this device.');
    return false;
  }
  return true;
}

// Show a specific screen
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

// Start the game: show scanner and start scanning
function startGame() {
  showScreen('scanner-screen');
  startScanner();
}

// Bind the Begin button on DOM load, and initialize progress and particles
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('begin-hunt-btn').addEventListener('click', startGame);
  loadSavedProgress();
  createParticles();
});

// Initialize and start the QR scanner
function startScanner() {
  if (!checkCameraSupport()) return;

  document.getElementById('camera-status').textContent = "Starting camera...";
  document.getElementById('scanner-error').style.display = "none";

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

function initializeScanner() {
  html5QrCode = new Html5Qrcode("reader");

  const qrCodeSuccessCallback = (decodedText) => {
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
      console.error("QR scan error:", errorMessage);
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
  if (window.qrCodes[qrValue]) {
    const qrCode = window.qrCodes[qrValue];

    if (qrCode.found) {
      alert("You've already found this QR code!");
      startScanner();
      return;
    }

    qrCode.found = true;
    foundCodes++;

    saveProgress();
    document.getElementById(`point-${qrCode.id}`).classList.add('active');
    updateProgressBar();

    document.getElementById('found-which-qr').textContent = `You found QR Code #${qrCode.id}!`;
    document.getElementById('clue-content').textContent = qrCode.clue;
    document.getElementById('next-hint').textContent = qrCode.nextHint;

    showScreen('clue-screen');

    if (foundCodes === 5) {
      setTimeout(() => {
        document.getElementById('treasure-location').textContent = window.treasureLocation;
        showScreen('treasure-screen');
        createConfetti();
      }, 5000);
    }
  } else {
    alert("This doesn't seem to be one of the treasure hunt QR codes. Keep looking!");
    startScanner();
  }
}

// Show manual entry dialog
function showManualEntry() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const title = document.createElement('h3');
  title.className = 'modal-title';
  title.textContent = 'Enter QR Code Manually';
  
  const description = document.createElement('p');
  description.textContent = 'If camera scanning isn\'t working, enter the QR code value manually:';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'modal-input';
  input.placeholder = 'Enter QR Code (e.g., QR_CODE_1)';
  
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancel';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn';
  submitBtn.textContent = 'Submit';
  
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
  
  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);
  
  modalContent.appendChild(title);
  modalContent.appendChild(description);
  modalContent.appendChild(input);
  modalContent.appendChild(actions);
  
  modal.appendChild(modalContent);
  
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().catch(err => {
      console.error("Error stopping scanner:", err);
    });
  }
  
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
    for (const key in progress.qrCodes) {
      if (window.qrCodes[key]) {
        window.qrCodes[key].found = progress.qrCodes[key].found;
      }
    }
    foundCodes = 0;
    for (const key in window.qrCodes) {
      if (window.qrCodes[key].found) {
        foundCodes++;
        document.getElementById(`point-${window.qrCodes[key].id}`).classList.add('active');
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
  if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
    for (const key in window.qrCodes) {
      window.qrCodes[key].found = false;
    }
    
    foundCodes = 0;
    updateProgressBar();
    
    for (let i = 1; i <= 5; i++) {
      document.getElementById(`point-${i}`).classList.remove('active');
    }
    
    localStorage.removeItem('treasureHuntProgress');
    
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop().catch(err => {
        console.error("Error stopping scanner:", err);
      });
    }
    
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
      
      confetti.style.left = Math.random() * 100 + '%';
      
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      
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
      
      const size = Math.random() * 10 + 5;
      if (shape !== 'triangle') {
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
      }
      
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = (Math.random() * 5) + 's';
      
      appContainer.appendChild(confetti);
      
      setTimeout(() => {
        if (appContainer.contains(confetti)) {
          appContainer.removeChild(confetti);
        }
      }, 8000);
    }, i * 25);
  }
}

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
