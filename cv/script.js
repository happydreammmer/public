// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global variables
let scene, camera, renderer, particles, mouseFollower, cursorTrail = [];
let isLoading = true;
let animationId;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initThreeJS();
    initParticles();
    initCursor();
    initGSAPAnimations();
    initInteractiveElements();
    initCounters();
    initTypingAnimation();
    initScrollAnimations();
    loadProfilePhoto();
    
    // Start loading sequence
    simulateLoading();
});

// Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    gsap.set(loadingProgress, { width: '0%' });
}

function simulateLoading() {
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingScreen = document.getElementById('loading-screen');
    
    gsap.to(loadingProgress, {
        width: '100%',
        duration: 3,
        ease: 'power2.inOut',
        onComplete: () => {
            setTimeout(() => {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                        document.body.classList.remove('loading');
                        isLoading = false;
                        startMainAnimations();
                    }
                });
            }, 500);
        }
    });
}

// Three.js 3D Background
function initThreeJS() {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    const canvas = document.getElementById('three-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create 3D particles
    createThreeParticles();
    
    // Create floating geometries
    createFloatingGeometries();
    
    camera.position.z = 5;
    
    // Animation loop
    animate3D();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createThreeParticles() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createFloatingGeometries() {
    const geometries = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.SphereGeometry(0.3, 8, 6),
        new THREE.ConeGeometry(0.3, 0.6, 8),
        new THREE.OctahedronGeometry(0.4),
        new THREE.TetrahedronGeometry(0.4)
    ];
    
    const material = new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.1,
        color: 0x667eea
    });
    
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material.clone());
        
        mesh.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        
        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        mesh.userData = {
            originalPosition: mesh.position.clone(),
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        scene.add(mesh);
    }
}

function animate3D() {
    if (isLoading) {
        animationId = requestAnimationFrame(animate3D);
        return;
    }
    
    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
    }
    
    // Animate floating geometries
    scene.children.forEach(child => {
        if (child.userData && child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
            
            // Floating motion
            child.position.y += Math.sin(Date.now() * 0.001 + child.id) * 0.001;
        }
    });
    
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate3D);
}

function onWindowResize() {
    if (window.innerWidth <= 768) {
        if (renderer) {
            renderer.domElement.style.display = 'none';
        }
        return;
    }
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Particle.js Background
function initParticles() {
    if (window.innerWidth <= 768) return;
    
    particlesJS('particles-background', {
        particles: {
            number: { value: 50 },
            color: { value: ['#667eea', '#764ba2', '#00f5ff'] },
            shape: { type: 'circle' },
            opacity: {
                value: 0.3,
                random: true,
                animation: { enable: true, speed: 1 }
            },
            size: {
                value: 3,
                random: true,
                animation: { enable: true, speed: 2 }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#667eea',
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                out_mode: 'out'
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' }
            }
        }
    });
}

// Custom Cursor
function initCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.getElementById('mouse-follower');
    const trail = document.getElementById('cursor-trail');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail effect
        createCursorTrail(mouseX, mouseY);
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Interactive cursor effects
    document.querySelectorAll('a, button, .interactive').forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2, duration: 0.3 });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail-dot';
    trail.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #bf00ff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${x}px;
        top: ${y}px;
        mix-blend-mode: screen;
    `;
    
    document.body.appendChild(trail);
    
    gsap.to(trail, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => trail.remove()
    });
}

// GSAP Animations
function initGSAPAnimations() {
    // Set initial states
    gsap.set('.hero-name .name-part', { y: 100, opacity: 0 });
    gsap.set('.hero-title', { y: 50, opacity: 0 });
    gsap.set('.hero-description', { y: 30, opacity: 0 });
    gsap.set('.stat-item', { scale: 0, opacity: 0 });
    gsap.set('.avatar-3d', { scale: 0, rotation: 180 });
}

function startMainAnimations() {
    // Hero animations
    const tl = gsap.timeline();
    
    tl.to('.avatar-3d', {
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
    })
    .to('.hero-name .name-part', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=1')
    .to('.hero-title', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.hero-description', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.2')
    .to('.stat-item', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    }, '-=0.2');
}

// Scroll Animations
function initScrollAnimations() {
    // Sidebar animations
    gsap.fromTo('.sidebar-section', {
        x: -100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.sidebar',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Skills animation
    gsap.fromTo('.morphing-skill', {
        x: -50,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.skills-section',
            start: 'top 80%',
            onEnter: () => animateSkills()
        }
    });
    
    // Experience timeline
    gsap.fromTo('.experience-item', {
        x: 100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.experience-section',
            start: 'top 80%'
        }
    });
    
    // Projects animation
    gsap.fromTo('.floating-card', {
        y: 100,
        rotation: 10,
        opacity: 0
    }, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 80%'
        }
    });
    
    // Background items
    gsap.fromTo('.neon-card', {
        x: 100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.background-section',
            start: 'top 80%'
        }
    });
    
    // Parallax effects
    gsap.utils.toArray('.floating-element').forEach(element => {
        const speed = element.dataset.floatSpeed || 1;
        gsap.to(element, {
            y: -50 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

// Skill Bars Animation
function animateSkills() {
    document.querySelectorAll('.morphing-skill').forEach((skill, index) => {
        const progressBar = skill.querySelector('.skill-progress-3d');
        const percentage = skill.dataset.skill;
        
        gsap.to(progressBar, {
            width: percentage + '%',
            duration: 1.5,
            delay: index * 0.2,
            ease: 'power2.out'
        });
    });
}

// Counter Animation
function initCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        const value = Math.ceil(this.targets()[0].textContent);
                        if (value >= 1000000) {
                            counter.textContent = (value / 1000000).toFixed(1) + 'M+';
                        } else if (value >= 1000) {
                            counter.textContent = (value / 1000).toFixed(0) + 'K+';
                        } else {
                            counter.textContent = value + '+';
                        }
                    }
                });
            }
        });
    });
}

// Typing Animation
function initTypingAnimation() {
    const titles = [
        'AI Engineer',
        'Full-Stack Developer',
        'Digital Marketing Expert',
        'Innovation Catalyst',
        'Tech Entrepreneur'
    ];
    
    let currentTitle = 0;
    const typingElement = document.querySelector('.typing-text');
    
    function typeTitle() {
        gsap.to(typingElement, {
            text: titles[currentTitle],
            duration: 2,
            ease: 'none',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(typingElement, {
                        text: '',
                        duration: 1,
                        ease: 'none',
                        onComplete: () => {
                            currentTitle = (currentTitle + 1) % titles.length;
                            setTimeout(typeTitle, 500);
                        }
                    });
                }, 2000);
            }
        });
    }
    
    setTimeout(typeTitle, 1000);
}

// Interactive Elements
function initInteractiveElements() {
    // Floating chips
    document.querySelectorAll('.floating-chip').forEach(chip => {
        chip.addEventListener('mouseenter', () => {
            gsap.to(chip, {
                scale: 1.1,
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        chip.addEventListener('mouseleave', () => {
            gsap.to(chip, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Glass cards hover effects
    document.querySelectorAll('.glass-card, .floating-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                rotationX: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                rotationX: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Interactive buttons
    document.querySelectorAll('.interactive-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Neon cards
    document.querySelectorAll('.neon-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                x: 15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Profile photo loading
function loadProfilePhoto() {
    const img = document.getElementById('profile-photo');
    const initials = document.getElementById('initials');
    
    if (!img || !initials) return;
    
    img.onload = function() {
        gsap.to(initials, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            onComplete: () => {
                initials.style.display = 'none';
                img.style.display = 'block';
                gsap.fromTo(img, {
                    opacity: 0,
                    scale: 0
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            }
        });
    };
    
    img.onerror = function() {
        console.log('Profile photo not found, using initials');
    };
    
    img.src = 'hatef.jpg';
}

// Download PDF function
function downloadPDF() {
    // Create loading animation
    const button = document.querySelector('.futuristic-button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>Generating PDF...</span>';
    gsap.to(button, { scale: 0.95, duration: 0.1 });
    
    // Hide elements for print
    const elementsToHide = [
        '#three-canvas',
        '#particles-background',
        '#mouse-follower',
        '#cursor-trail',
        '.download-section'
    ];
    
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'none';
    });
    
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
        @media print {
            body { 
                background: white !important; 
                color: black !important;
                transform: scale(0.8);
                transform-origin: top left;
            }
            .sidebar, .glass-card, .floating-card, .neon-card {
                background: #f8f9fa !important;
                border: 1px solid #dee2e6 !important;
                box-shadow: none !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
    
    setTimeout(() => {
        window.print();
        
        // Restore elements
        setTimeout(() => {
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element && selector !== '.download-section') {
                    element.style.display = 'block';
                }
            });
            
            const downloadSection = document.querySelector('.download-section');
            if (downloadSection) downloadSection.style.display = 'block';
            
            document.head.removeChild(printStyles);
            button.innerHTML = originalText;
            gsap.to(button, { scale: 1, duration: 0.2 });
        }, 1000);
    }, 500);
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: target,
                    duration: 1.5,
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// Performance optimizations
function optimizePerformance() {
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        gsap.globalTimeline.timeScale(0.5);
    }
    
    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            gsap.globalTimeline.resume();
            if (scene && camera && renderer) {
                animate3D();
            }
        }
    });
}

// Initialize performance optimizations
optimizePerformance();

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize mobile-specific features
    if (window.innerWidth <= 768) {
        const cursor = document.getElementById('mouse-follower');
        const trail = document.getElementById('cursor-trail');
        if (cursor) cursor.style.display = 'none';
        if (trail) trail.style.display = 'none';
        
        // Stop Three.js animation
        if (renderer) {
            renderer.domElement.style.display = 'none';
        }
        
        // Stop particles
        const particlesContainer = document.getElementById('particles-background');
        if (particlesContainer) {
            particlesContainer.style.display = 'none';
        }
    } else {
        const cursor = document.getElementById('mouse-follower');
        if (cursor) cursor.style.display = 'block';
        
        if (renderer) {
            renderer.domElement.style.display = 'block';
        }
        
        const particlesContainer = document.getElementById('particles-background');
        if (particlesContainer) {
            particlesContainer.style.display = 'block';
        }
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Easter egg animation
        gsap.to('.resume-container', {
            rotationY: 360,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        // Show message
        const message = document.createElement('div');
        message.textContent = '🎉 You found the easter egg! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px 40px;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10001;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(message);
        
        gsap.fromTo(message, {
            scale: 0,
            rotation: 180
        }, {
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });
        
        setTimeout(() => {
            gsap.to(message, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                onComplete: () => message.remove()
            });
        }, 3000);
        
        konamiCode = [];
    }
});

console.log('🚀 Welcome to Hatef\'s Interactive CV! 🚀');
console.log('💡 Try the Konami code for a surprise!');
console.log('🎨 Built with Three.js, GSAP, and lots of creativity!'); 