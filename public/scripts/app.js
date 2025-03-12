/**
 * Main Application Script
 * 
 * Responsible for initializing the application and binding event listeners
 */

// Global variables
let html5QrCode;
let foundCodes = 0;
// Declare these as global variables (window properties)
window.html5QrCode = null;
window.foundCodes = 0;

// Make sure key functions are exposed globally
window.showScreen = function(screenId) {
  // your showScreen code
};

window.startScanner = function() {
  // your startScanner code
};

function initApp() {
    // Initialize the app
    console.log("Initializing app");
    // Bind event listeners
    document.getElementById('begin-hunt-btn').addEventListener('click', startGame);
    document.getElementById('manual-entry-btn').addEventListener('click', showManualEntry);
    document.getElementById('continue-btn').addEventListener('click', returnToScanner);
    document.getElementById('reset-btn').addEventListener('click', resetProgress);
    
    // Load saved progress
    loadSavedProgress();
    
    // Create visual effects
    createParticles();
  }
  
  // Call this when the DOM is ready
  document.addEventListener('DOMContentLoaded', initApp);


// Check if HTML5 QR Code library is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof Html5Qrcode === 'undefined') {
            const scannerError = document.getElementById('scanner-error');
            if (scannerError) {
                scannerError.style.display = "block";
                scannerError.innerHTML = `
                    <strong>Library Load Error:</strong> QR scanner library not loaded.<br>
                    Please check your internet connection and refresh the page.
                `;
            }
            console.error("Html5Qrcode library not loaded!");
        }
    }, 1000); // Give it a second to load
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Bind event listeners
    document.getElementById('begin-hunt-btn').addEventListener('click', startGame);
    document.getElementById('manual-entry-btn').addEventListener('click', showManualEntry);
    document.getElementById('continue-btn').addEventListener('click', returnToScanner);
    document.getElementById('reset-btn').addEventListener('click', resetProgress);
    
    // Load saved progress
    loadSavedProgress();
    
    // Create visual effects
    createParticles();
    
    console.log('QR Code Treasure Hunt initialized');
});

// Show a specific screen and hide others
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    console.log(`Screen changed to: ${screenId}`);
}

// Start the game
function startGame() {
    console.log('Starting the hunt');
    showScreen('scanner-screen');
    startScanner();
}

// Return to scanner from clue screen
function returnToScanner() {
    showScreen('scanner-screen');
    startScanner();
}