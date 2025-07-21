// PDF Export with Light Theme
// Handles clean PDF generation using light theme and simplified layout

let originalTheme = 'dark';

// Enhanced PDF generation function
function downloadPDF() {
    const button = document.querySelector('.futuristic-button');
    if (!button) {
        console.error('Download button not found');
        return;
    }
    
    const originalText = button.querySelector('.download-text')?.textContent || 'Download PDF';
    const buttonIcon = button.querySelector('.download-icon');

    // Store original theme
    originalTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
    
    // Update button state
    const downloadText = button.querySelector('.download-text');
    if (downloadText) {
        downloadText.textContent = 'Generating...';
    }
    button.disabled = true;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(button, { scale: 0.95, duration: 0.1 });
    }

    // Prepare document for PDF export
    preparePDFLayout();

    // Element to be converted to PDF
    const element = document.querySelector('.resume-container');
    if (!element) {
        console.error('Resume container not found');
        restoreOriginalLayout();
        return;
    }

    // Enhanced options for html2pdf
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'Hatef_Mohammad_Ali_CV.pdf',
        image: { 
            type: 'jpeg', 
            quality: 1.0 
        },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 1200,
            windowHeight: 1600,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: ['.experience-item', '.project-item', '.neon-card']
        }
    };

    // Generate PDF with error handling
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf library not loaded');
        restoreOriginalLayout();
        return;
    }

    html2pdf()
        .from(element)
        .set(opt)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
            // Add metadata to PDF
            pdf.setProperties({
                title: 'Hatef Mohammad Ali - CV',
                subject: 'Curriculum Vitae',
                author: 'Hatef Mohammad Ali',
                keywords: 'AI Engineer, Full-Stack Developer, Digital Marketing',
                creator: 'Interactive CV Generator'
            });
        })
        .save()
        .then(() => {
            // Restore layout after successful generation
            restoreOriginalLayout();
            
            // Restore button state
            if (downloadText) {
                downloadText.textContent = originalText;
            }
            button.disabled = false;
            if (typeof gsap !== 'undefined') {
                gsap.to(button, { scale: 1, duration: 0.2 });
            }
        })
        .catch((error) => {
            console.error('Error generating PDF:', error);
            
            // Restore layout on error
            restoreOriginalLayout();
            
            // Show error state
            if (downloadText) {
                downloadText.textContent = 'Error!';
                setTimeout(() => {
                    downloadText.textContent = originalText;
                    button.disabled = false;
                    if (typeof gsap !== 'undefined') {
                        gsap.to(button, { scale: 1, duration: 0.2 });
                    }
                }, 2000);
            }
        });
}

function preparePDFLayout() {
    // Force light theme for PDF
    document.documentElement.classList.add('light-theme');
    document.body.classList.add('pdf-mode');
    
    // Hide complex elements
    hideComplexElements();
    
    // Simplify animations
    disableAnimations();
    
    // Optimize layout for PDF
    optimizeForPDF();
}

function restoreOriginalLayout() {
    // Restore original theme
    if (originalTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
    }
    
    // Remove PDF mode
    document.body.classList.remove('pdf-mode');
    
    // Show hidden elements
    showComplexElements();
    
    // Re-enable animations
    enableAnimations();
    
    // Restore layout
    restoreLayout();
}

function hideComplexElements() {
    const elementsToHide = [
        '#three-canvas',
        '#particles-background',
        '#mouse-follower',
        '#cursor-trail',
        '.theme-toggle-container',
        '.avatar-glow',
        '.avatar-orbit',
        '.experience-glow',
        '.project-glow',
        '.education-glow',
        '.link-glow',
        '.skill-glow',
        '.hero-scroll-indicator',
        '#loading-screen'
    ];
    
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) {
                el.style.display = 'none';
                el.classList.add('pdf-hidden');
            }
        });
    });
}

function showComplexElements() {
    const hiddenElements = document.querySelectorAll('.pdf-hidden');
    hiddenElements.forEach(el => {
        if (el) {
            el.style.display = '';
            el.classList.remove('pdf-hidden');
        }
    });
}

function disableAnimations() {
    // Add CSS to disable animations
    const style = document.createElement('style');
    style.id = 'pdf-animation-disable';
    style.textContent = `
        .pdf-mode * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        .pdf-mode .floating-card {
            transform: none !important;
        }
        .pdf-mode .glass-card {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

function enableAnimations() {
    const style = document.getElementById('pdf-animation-disable');
    if (style) {
        style.remove();
    }
}

function optimizeForPDF() {
    // Simplify hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.height = 'auto';
        heroSection.style.padding = '40px 20px';
    }
    
    // Optimize main container layout
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.display = 'block';
        mainContainer.style.padding = '20px';
    }
    
    // Stack sidebar content
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.position = 'static';
        sidebar.style.width = '100%';
        sidebar.style.marginBottom = '20px';
        sidebar.style.pageBreakInside = 'avoid';
    }
    
    // Optimize content grid
    const contentGrid = document.querySelector('.content-grid');
    if (contentGrid) {
        contentGrid.style.gridTemplateColumns = '1fr';
        contentGrid.style.gap = '20px';
    }
    
    // Add page breaks
    addPageBreaks();
}

function restoreLayout() {
    // Remove inline styles added for PDF
    const elementsToRestore = [
        '.hero-section',
        '.main-container',
        '.sidebar',
        '.content-grid'
    ];
    
    elementsToRestore.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) {
                el.style.cssText = '';
            }
        });
    });
    
    // Remove page break classes
    const pageBreaks = document.querySelectorAll('.page-break-before, .page-break-after');
    pageBreaks.forEach(el => {
        if (el) {
            el.classList.remove('page-break-before', 'page-break-after');
        }
    });
}

function addPageBreaks() {
    // Add strategic page breaks
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
        experienceSection.classList.add('page-break-before');
    }
    
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
        projectsSection.classList.add('page-break-before');
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (!toggleBtn || !themeIcon) {
        console.warn('Theme toggle elements not found');
        return;
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('cv-theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
    
    // Toggle functionality
    toggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        themeIcon.textContent = isLight ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('cv-theme', isLight ? 'light' : 'dark');
        
        // Animate transition if GSAP is available
        if (typeof gsap !== 'undefined') {
            gsap.to(document.body, {
                duration: 0.5,
                ease: 'power2.inOut'
            });
        }
    });
    
    // Add hover effects if GSAP is available
    if (typeof gsap !== 'undefined') {
        toggleBtn.addEventListener('mouseenter', () => {
            gsap.to(toggleBtn, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            gsap.to(toggleBtn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
});

// Override the original downloadPDF function
if (typeof window !== 'undefined') {
    window.downloadPDF = downloadPDF;
}