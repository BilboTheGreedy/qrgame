/**
 * Main Application Script
 * 
 * Responsible for initializing the application and binding event listeners
 */

// Global variables
let html5QrCode;
let foundCodes = 0;

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