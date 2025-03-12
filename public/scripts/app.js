/**
 * Main Application Script
 * 
 * Responsible for initializing the application and binding event listeners
 */

// Global variables
let html5QrCode = null;
let foundCodes = 0;

// Expose key functions globally
window.html5QrCode = null;
window.foundCodes = 0;

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

// Manual entry for QR codes (stub function to be completed in scanner.js)
function showManualEntry() {
    // This function is implemented in scanner.js
    console.log("Show manual entry triggered");
}

// Initialize the application
function initApp() {
    console.log("Initializing app");
    
    // Log our startup status
    console.log("Document loaded, libraries status:");
    console.log("Html5Qrcode available:", typeof Html5Qrcode !== 'undefined');
    console.log("QR codes config available:", typeof window.qrCodes !== 'undefined');
    
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
}

// Expose necessary functions to the global scope
window.showScreen = showScreen;
window.startGame = startGame;
window.returnToScanner = returnToScanner;
window.initApp = initApp;

// Call initApp when the DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Check if HTML5 QR Code library is loaded with a delay to ensure everything is properly initialized
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