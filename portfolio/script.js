// ========================================
// NAVIGATION
// ========================================
function navigate(pageId) {
    // 1. Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active-page'));

    // 2. Show the selected page
    document.getElementById(pageId).classList.add('active-page');

    // 3. Update Sidebar Buttons
    const buttons = document.querySelectorAll('nav button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to the clicked button (or matching nav button)
    const activeBtn = document.getElementById('btn-' + pageId);
    if(activeBtn) activeBtn.classList.add('active');

    // 4. Scroll to top (main container + window for mobile)
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // 5. Re-observe elements for scroll reveal
    observeElements();
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

function observeElements() {
    // Observe all cards and sections
    const elements = document.querySelectorAll('.card, .stat-item, h1, .intro');
    elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ========================================
// LIGHTBOX MODAL FOR PORTFOLIO ITEMS
// ========================================
let currentLightboxIndex = 0;
let lightboxItems = [];

function openLightbox(title, description, mediaSrc, tags, metrics, mediaType) {
    mediaType = mediaType || 'image';
    const lightbox = document.getElementById('lightbox');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxPdf = document.getElementById('lightbox-pdf');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxTags = document.getElementById('lightbox-tags');
    const lightboxMetrics = document.getElementById('lightbox-metrics');

    lightboxImage.style.display = 'none';
    lightboxVideo.style.display = 'none';
    lightboxPdf.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');

    if (mediaType === 'video') {
        lightboxVideo.src = mediaSrc;
        lightboxVideo.style.display = 'block';
    } else if (mediaType === 'pdf') {
        lightboxPdf.src = mediaSrc;
        lightboxPdf.style.display = 'block';
    } else {
        lightboxImage.src = mediaSrc;
        lightboxImage.style.display = 'block';
    }

    lightboxTitle.textContent = title;
    lightboxDesc.textContent = description;

    lightboxTags.innerHTML = '';
    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tag;
            lightboxTags.appendChild(tagEl);
        });
    }

    if (metrics) {
        lightboxMetrics.innerHTML = `<p class="metrics-text">${metrics}</p>`;
        lightboxMetrics.style.display = 'block';
    } else {
        lightboxMetrics.style.display = 'none';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxPdf = document.getElementById('lightbox-pdf');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxPdf.removeAttribute('src');
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ========================================
// CONTACT FORM HANDLING
// ========================================
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    
    // Get form data
    const formData = {
        name: form.querySelector('#contact-name').value,
        email: form.querySelector('#contact-email').value,
        message: form.querySelector('#contact-message').value
    };
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success state
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
        submitBtn.textContent = 'Message Sent!';
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            successMsg.style.display = 'none';
        }, 3000);
    }, 1500);
    
    // For actual implementation, use:
    // fetch('your-endpoint', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // }).then(response => { ... });
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-open');
}

// ========================================
// SKILL BAR ANIMATIONS
// ========================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('.skills-section');
    
    if (!skillsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll reveal
    observeElements();
    
    // Initialize skill bar animations
    animateSkillBars();
    
    // Add smooth scroll behavior to main container
    const main = document.querySelector('main');
    if (main) {
        main.style.scrollBehavior = 'smooth';
    }
    
    // Initialize contact form if it exists
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    console.log('Portfolio initialized!');
});
