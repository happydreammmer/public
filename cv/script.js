// AI Data Flow Visualization
class DataFlowVisualization {
    constructor() {
        this.canvas = document.getElementById('dataflow-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.streams = [];
        this.aiTerms = [
            'AI', 'ML', 'React', 'Node.js', 'LangChain', 'OpenAI', 'Claude', 
            'Python', 'API', 'Vector', 'Neural', 'Data', 'Deep', 'Learn',
            'Prompt', 'Model', 'GPT', 'Train', 'Infer', 'Algo', 'Code',
            'Deploy', 'Scale', 'Cloud', 'Ops', 'Dev', 'Build', 'Test'
        ];
        
        this.isActive = true;
        this.isMobile = window.innerWidth <= 768;
        
        this.resize();
        this.initStreams();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
        
        // Pause animation when tab is not visible to save performance
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
        });
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            this.initStreams();
        }
        
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initStreams() {
        // Reduce particles and streams on mobile for better performance
        const streamCount = this.isMobile ? 
            Math.floor(this.canvas.width / 150) : 
            Math.floor(this.canvas.width / 100);
        const particleCount = this.isMobile ? 15 : 30;
        
        this.streams = [];
        this.particles = [];
        
        for (let i = 0; i < streamCount; i++) {
            this.streams.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: 0.3 + Math.random() * (this.isMobile ? 0.8 : 1.5),
                angle: Math.random() * Math.PI * 2,
                length: 80 + Math.random() * (this.isMobile ? 120 : 200),
                opacity: 0.08 + Math.random() * (this.isMobile ? 0.15 : 0.25),
                hue: 220 + Math.random() * 40
            });
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.5),
                vy: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.5),
                size: 1 + Math.random() * (this.isMobile ? 1.5 : 2),
                opacity: 0.2 + Math.random() * 0.4,
                term: this.aiTerms[Math.floor(Math.random() * this.aiTerms.length)],
                termOpacity: 0.1 + Math.random() * 0.2,
                lastTermTime: 0,
                showTerm: false
            });
        }
    }
    
    drawStream(stream) {
        this.ctx.save();
        this.ctx.translate(stream.x, stream.y);
        this.ctx.rotate(stream.angle);
        
        const gradient = this.ctx.createLinearGradient(0, 0, stream.length, 0);
        gradient.addColorStop(0, `hsla(${stream.hue}, 70%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${stream.hue}, 70%, 60%, ${stream.opacity})`);
        gradient.addColorStop(1, `hsla(${stream.hue}, 70%, 60%, 0)`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = this.isMobile ? 0.8 : 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(stream.length, 0);
        this.ctx.stroke();
        
        // Add flowing dots (fewer on mobile)
        const dotCount = this.isMobile ? 2 : 3;
        for (let i = 0; i < dotCount; i++) {
            const dotX = (Date.now() * stream.speed * 0.01 + i * stream.length / dotCount) % stream.length;
            this.ctx.fillStyle = `hsla(${stream.hue}, 70%, 70%, ${stream.opacity * 2})`;
            this.ctx.beginPath();
            this.ctx.arc(dotX, 0, this.isMobile ? 0.8 : 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawParticle(particle) {
        // Draw particle
        this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Show AI terms less frequently on mobile
        const termInterval = this.isMobile ? 5000 : 3000;
        if (Date.now() - particle.lastTermTime > termInterval + Math.random() * 5000) {
            particle.lastTermTime = Date.now();
            particle.showTerm = true;
            setTimeout(() => {
                particle.showTerm = false;
            }, this.isMobile ? 1500 : 2000);
        }
        
        if (particle.showTerm && !this.isMobile) {
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.termOpacity})`;
            this.ctx.font = '10px monospace';
            this.ctx.fillText(particle.term, particle.x + 5, particle.y - 5);
        }
    }
    
    animate() {
        if (!this.isActive) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw streams
        this.streams.forEach(stream => {
            this.drawStream(stream);
            
            // Move streams slowly
            const moveSpeed = this.isMobile ? 0.05 : 0.1;
            stream.x += Math.cos(stream.angle) * stream.speed * moveSpeed;
            stream.y += Math.sin(stream.angle) * stream.speed * moveSpeed;
            
            // Wrap around screen
            if (stream.x < -stream.length) stream.x = this.canvas.width;
            if (stream.x > this.canvas.width + stream.length) stream.x = -stream.length;
            if (stream.y < -stream.length) stream.y = this.canvas.height;
            if (stream.y > this.canvas.height + stream.length) stream.y = -stream.length;
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
            
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Profile photo loading
async function loadProfilePhoto() {
    const img = document.getElementById('profile-photo');
    const initials = document.getElementById('initials');
    
    if (!img || !initials) return;
    
    try {
        // Check if image loads successfully
        img.onload = function() {
            img.style.display = 'block';
            initials.style.display = 'none';
            console.log('Profile photo loaded successfully');
        };
        
        img.onerror = function() {
            console.log('Profile photo not found, using initials');
            img.style.display = 'none';
            initials.style.display = 'flex';
        };
        
        // Set the source to trigger loading
        img.src = 'hatef.jpg';
        
    } catch (error) {
        console.log('Error loading profile photo:', error);
        img.style.display = 'none';
        initials.style.display = 'flex';
    }
}

// PDF Download functionality
function downloadPDF() {
    // Hide animations and interactive elements for print
    const canvas = document.getElementById('dataflow-canvas');
    const downloadSection = document.querySelector('.download-section');
    
    if (canvas) canvas.style.display = 'none';
    if (downloadSection) downloadSection.style.display = 'none';
    
    const originalTitle = document.title;
    document.title = 'Hatef_Kouzechi_AI_Engineer_Resume';
    
    // Add print-specific styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            body { transform: scale(0.9); transform-origin: top left; }
            .resume-container { box-shadow: none !important; }
        }
    `;
    document.head.appendChild(printStyles);
    
    // Use setTimeout to ensure styles are applied
    setTimeout(() => {
        window.print();
        
        // Restore after print
        setTimeout(() => {
            if (canvas) canvas.style.display = 'block';
            if (downloadSection) downloadSection.style.display = 'block';
            document.title = originalTitle;
            document.head.removeChild(printStyles);
        }, 1000);
    }, 200);
}

// Smooth skill bar animations
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 200);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add touch feedback for mobile
function addTouchFeedback() {
    if ('ontouchstart' in window) {
        document.querySelectorAll('.download-btn, .social-link, .tech-chip').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
}

// Performance optimized resize handler
function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-trigger skill bar animations if they're visible
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const rect = bar.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    bar.style.transition = 'none';
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.transition = 'width 1.2s ease';
                        bar.style.width = width;
                    }, 100);
                }
            });
        }, 250);
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('CV page loaded');
    
    // Load profile photo
    loadProfilePhoto();
    
    // Initialize animations only on desktop for better mobile performance
    if (window.innerWidth > 768) {
        new DataFlowVisualization();
    }
    
    // Initialize other features
    animateSkillBars();
    initSmoothScrolling();
    addTouchFeedback();
    handleResize();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any running animations
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('download-btn')) {
            e.preventDefault();
            downloadPDF();
        }
    }
});

// Preload critical resources
function preloadResources() {
    const preloadImage = new Image();
    preloadImage.src = 'hatef.jpg';
}

// Call preload on page load
window.addEventListener('load', preloadResources); 