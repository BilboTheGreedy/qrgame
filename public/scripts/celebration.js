/**
 * Enhanced Celebration Effects
 * Add to public/scripts/celebration.js
 */

// Create a more elaborate confetti effect
function createEnhancedConfetti() {
    console.log("Creating enhanced confetti celebration!");
    const container = document.querySelector('.treasure-complete');
    if (!container) {
        console.error("Container not found for confetti");
        return;
    }
    
    // Clear any existing confetti
    const existingConfetti = document.querySelectorAll('.confetti');
    existingConfetti.forEach(el => el.remove());
    
    // Add more particles with vibrant colors
    const colors = [
        '#FF577F', '#FF884B', '#FFDF6B', '#A2FF86', 
        '#6BC1FF', '#C03AFF', '#FF5CBD', '#FF3333',
        '#FFCE54', '#A0D468', '#4FC1E9', '#AC92EC'
    ];
    
    const confettiCount = 150;
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random shape
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.borderLeft = `${Math.random() * 7 + 5}px solid transparent`;
            confetti.style.borderRight = `${Math.random() * 7 + 5}px solid transparent`;
            confetti.style.borderBottom = `${Math.random() * 10 + 10}px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
            confetti.style.background = 'none';
        } else {
            confetti.style.width = `${Math.random() * 10 + 8}px`;
            confetti.style.height = `${Math.random() * 6 + 4}px`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        }
        
        // Random color
        if (shape !== 'triangle') {
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Random position
        confetti.style.left = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(confetti);
    }
    
    // Add floating hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 20 + 15}px`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.opacity = `${Math.random() * 0.5 + 0.5}`;
        heart.style.animation = `float ${Math.random() * 4 + 3}s infinite alternate ease-in-out`;
        heart.style.animationDelay = `${Math.random() * 2}s`;
        heart.style.zIndex = '100';
        heart.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
        
        container.appendChild(heart);
    }
    
    // Sound effect (browser needs user interaction first)
    try {
        // Create success sounds using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a 'tada' type sound
        const playSuccessSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            
            // Start with a higher frequency and slide down
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
            
            // Control volume
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        };
        
        // Play success sounds in sequence
        playSuccessSound();
        setTimeout(playSuccessSound, 300);
        setTimeout(playSuccessSound, 600);
        
        // Add vibration pattern for mobile
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
    } catch (e) {
        console.log("Error creating celebration sounds:", e);
    }
    
    // Add a congratulatory message that fades in
    const message = document.createElement('div');
    message.className = 'animate__animated animate__fadeIn animate__delay-1s celebration-message';
    message.style.position = 'absolute';
    message.style.top = '10%';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = 'linear-gradient(135deg, #ff4d8d, #ff6b6b)';
    message.style.color = 'white';
    message.style.padding = '15px 30px';
    message.style.borderRadius = '30px';
    message.style.boxShadow = '0 5px 20px rgba(255, 77, 141, 0.4)';
    message.style.fontSize = '20px';
    message.style.fontWeight = 'bold';
    message.style.zIndex = '200';
    message.style.textAlign = 'center';
    message.innerHTML = 'You did it! 🎉<br>You found all the clues!';
    
    container.appendChild(message);
}

// Enhanced treasure screen animation
function enhanceTreasureScreen() {
    const treasureLocationElement = document.getElementById('treasure-location');
    if (!treasureLocationElement) {
        console.error("Treasure location element not found");
        return;
    }
    
    // Enhance the styling of the treasure location
    treasureLocationElement.style.fontSize = '24px';
    treasureLocationElement.style.padding = '20px';
    treasureLocationElement.style.background = 'linear-gradient(to right, rgba(33, 150, 243, 0.2), rgba(3, 169, 244, 0.2))';
    treasureLocationElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    treasureLocationElement.style.transform = 'scale(1.05)';
    treasureLocationElement.style.transition = 'all 0.5s ease';
    
    // Add a glowing border that pulses
    const keyframes = `
    @keyframes glow {
        0% { box-shadow: 0 0 10px rgba(33, 150, 243, 0.5); }
        50% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.8); }
        100% { box-shadow: 0 0 10px rgba(33, 150, 243, 0.5); }
    }`;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    treasureLocationElement.style.animation = 'glow 2s infinite';
}

// Export the celebration functions to global scope
window.createEnhancedConfetti = createEnhancedConfetti;
window.enhanceTreasureScreen = enhanceTreasureScreen;