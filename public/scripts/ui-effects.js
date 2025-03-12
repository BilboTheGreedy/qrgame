/**
 * UI Effects and Animations
 * 
 * Handles visual effects and animations for the app
 */

// Create particle background effect
function createParticles() {
    const container = document.querySelector('.app-container');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 5px and 15px
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5;
        
        // Add animation with random duration and delay
        particle.style.animation = `float ${Math.random() * 5 + 5}s infinite alternate`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

// Create confetti effect for the treasure screen
function createConfetti() {
    const container = document.querySelector('.treasure-complete');
    const colors = ['#2196F3', '#03A9F4', '#00BCD4', '#E91E63', '#FFC107'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random shape
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 4 + 2}px`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        }
        
        // Random color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random position
        confetti.style.left = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(confetti);
    }
}