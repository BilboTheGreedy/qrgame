/**
 * UI Effects and Animations
 * 
 * Contains visual effects and animations for the treasure hunt application
 */

// Create background particles
function createParticles() {
    const body = document.body;
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.left = Math.random() * 100 + 'vw';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.6 + 0.1;
        
        // Add animation for floating effect
        const duration = Math.random() * 60 + 30;
        const delay = Math.random() * 10;
        
        particle.style.animation = `float ${duration}s ${delay}s infinite alternate`;
        
        body.appendChild(particle);
    }
}

// Create confetti effect for the treasure completion
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