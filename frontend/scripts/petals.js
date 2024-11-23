// petals.js
document.addEventListener('DOMContentLoaded', function() {
    const petalCount = 50; // Increased number of petals
    const petalsContainer = document.getElementById('petals-container');
    
    if (!petalsContainer) {
        console.error('Petals container not found');
        return;
    }

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Random starting position
        petal.style.left = `${Math.random() * 100}vw`;
        
        // More varied animations
        petal.style.animationDuration = `${8 + Math.random() * 12}s`; // Between 8-20s
        petal.style.animationDelay = `${Math.random() * 5}s`;
        
        // Random size variation
        const size = 15 + Math.random() * 15; // Between 15-30px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        // Random rotation
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        petalsContainer.appendChild(petal);
    }
});