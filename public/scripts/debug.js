/**
 * Debug Helper Functions
 * Add to public/scripts/debug.js
 */

// Check the status of all QR codes
function checkQRCodeStatus() {
    console.log("--- QR Code Status ---");
    let found = 0;
    for (const key in window.qrCodes) {
        console.log(`${key}: ${window.qrCodes[key].found ? 'Found' : 'Not Found'}`);
        if (window.qrCodes[key].found) {
            found++;
        }
    }
    console.log(`Total found: ${found} / 5`);
    console.log(`Window.foundCodes = ${window.foundCodes}`);
    console.log(`Local foundCodes = ${foundCodes}`);
    console.log("---------------------");
    return found;
}

// Fix QR code counting if needed
function fixQRCodeCounting() {
    let actualFound = 0;
    for (const key in window.qrCodes) {
        if (window.qrCodes[key].found) {
            actualFound++;
        }
    }
    
    if (actualFound !== window.foundCodes) {
        console.log(`Fixing QR code count. Actual: ${actualFound}, Recorded: ${window.foundCodes}`);
        window.foundCodes = actualFound;
        foundCodes = actualFound;
        console.log(`Count fixed to ${window.foundCodes}`);
    } else {
        console.log("QR code count is correct");
    }
    
    return actualFound;
}

// Force celebration screen (for testing)
function forceCelebration() {
    console.log("Forcing celebration screen");
    document.getElementById('treasure-location').textContent = window.treasureLocation || "Look for your special surprise!";
    showScreen('treasure-screen');
    
    if (typeof createEnhancedConfetti === 'function') {
        createEnhancedConfetti();
        enhanceTreasureScreen();
    } else if (typeof createConfetti === 'function') {
        createConfetti();
    }
}

// Expose debugging functions to console
window.checkQRCodeStatus = checkQRCodeStatus;
window.fixQRCodeCounting = fixQRCodeCounting;
window.forceCelebration = forceCelebration;