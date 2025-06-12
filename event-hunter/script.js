// ===== MAIN APPLICATION LOGIC =====

/**
 * Update counter displays with animated numbers
 */
function updateCounters() {
    const stats = getEventStatistics();
    
    animateCounter(document.getElementById('totalEvents'), stats.total);
    animateCounter(document.getElementById('upcomingEvents'), stats.upcoming);
    animateCounter(document.getElementById('completedEvents'), stats.completed);
    animateCounter(document.getElementById('countriesCount'), stats.countries);
}

/**
 * Render events in the grid with proper separation
 * @param {Array} filteredEvents - Array of filtered events
 * @param {string} statusFilter - Current status filter value
 */
function renderEvents(filteredEvents, statusFilter) {
    const eventsGrid = document.getElementById('eventsGrid');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const t = translations[currentLang];

    const upcoming = filteredEvents
        .filter(e => {
            const eventEndDate = createSafeDate(e.endDate || e.date);
            eventEndDate.setHours(0, 0, 0, 0);
            return eventEndDate >= today;
        })
        .sort((a, b) => createSafeDate(a.date) - createSafeDate(b.date));
    
    const completed = filteredEvents
        .filter(e => {
            const eventEndDate = createSafeDate(e.endDate || e.date);
            eventEndDate.setHours(0, 0, 0, 0);
            return eventEndDate < today;
        })
        .sort((a, b) => createSafeDate(b.date) - createSafeDate(a.date));

    let finalHtml = '';
    let cardIndex = 0;
    
    if (statusFilter === 'upcoming') {
        finalHtml = upcoming.map((event, index) => createEventCard(event, index)).join('');
    } else if (statusFilter === 'completed') {
        finalHtml = completed.map((event, index) => createEventCard(event, index)).join('');
    } else {
        const upcomingHtml = upcoming.map(event => createEventCard(event, cardIndex++)).join('');
        const completedHtml = completed.map(event => createEventCard(event, cardIndex++)).join('');
        finalHtml = upcomingHtml;
        
        if (upcoming.length > 0 && completed.length > 0) {
            finalHtml += `<div class="events-separator"><span>${t.completedEventsSeparator}</span></div>`;
        }
        finalHtml += completedHtml;
    }

    eventsGrid.innerHTML = finalHtml || `<p style="color: var(--text-secondary); text-align: center; grid-column: 1 / -1; font-size: 1.2rem;">${t.noEventsFound}</p>`;
}

/**
 * Apply all active filters to the events array
 */
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const monthFilter = document.getElementById('monthFilter');
    const continentFilter = document.getElementById('continentFilter');
    const industryFilter = document.getElementById('industryFilter');
    const countryFilter = document.getElementById('countryFilter');

    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const month = monthFilter.value;
    const continent = continentFilter.value;
    const industry = industryFilter.value;
    const country = countryFilter.value;

    let filtered = events.filter(event => {
        const searchMatch = !searchTerm ||
            event.name.toLowerCase().includes(searchTerm) ||
            event.city.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm);

        const eventDate = createSafeDate(event.date);
        const eventMonth = eventDate.getMonth().toString();
        const monthMatch = month === 'all' || eventMonth === month;
        const continentMatch = continent === 'all' || countryToContinentMap[event.country] === continent;
        const industryMatch = industry === 'all' || event.category === industry;
        const countryMatch = country === 'all' || event.country === country;

        return searchMatch && monthMatch && continentMatch && industryMatch && countryMatch;
    });

    renderEvents(filtered, status);
}

/**
 * Setup filter controls and populate dropdown options
 */
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const monthFilter = document.getElementById('monthFilter');
    const continentFilter = document.getElementById('continentFilter');
    const industryFilter = document.getElementById('industryFilter');
    const countryFilter = document.getElementById('countryFilter');
    
    // Populate month options
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    monthKeys.forEach((key, index) => {
        const option = document.createElement('option');
        option.value = index; // 0-11
        option.dataset.translateKey = key;
        monthFilter.appendChild(option);
    });
    
    // Populate continent options
    const continents = [...new Set(Object.values(countryToContinentMap))].sort();
    continents.forEach(cont => {
        const option = document.createElement('option');
        option.value = cont;
        option.dataset.translateKey = cont;
        continentFilter.appendChild(option);
    });

    // Populate industry options
    const industries = [...new Set(events.map(e => e.category))].sort();
    industries.forEach(ind => {
        const option = document.createElement('option');
        option.value = ind;
        option.dataset.translateKey = ind;
        industryFilter.appendChild(option);
    });

    // Populate country options
    const countries = [...new Set(events.map(e => e.country))]
        .sort((a,b) => (countryDisplayNames[a] || a).localeCompare(countryDisplayNames[b] || b));
    countries.forEach(cty => {
        const option = document.createElement('option');
        option.value = cty;
        option.textContent = countryDisplayNames[cty] || cty;
        countryFilter.appendChild(option);
    });

    // Add debounced event listeners
    const debouncedApplyFilters = debounce(applyFilters, 300);
    
    [searchInput].forEach(el => {
        el.addEventListener('input', debouncedApplyFilters);
    });
    
    [statusFilter, monthFilter, continentFilter, industryFilter, countryFilter].forEach(el => {
        el.addEventListener('change', applyFilters);
    });
}

/**
 * Setup theme and language controls
 */
function setupControls() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('eventHunterTheme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('eventHunterTheme', 'light');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('eventHunterTheme', 'dark');
        }
        updateSelectArrows();
    });

    // Language selector
    const langSelector = document.getElementById('languageSelector');
    const savedLang = localStorage.getItem('eventHunterLang') || 'en';
    langSelector.value = savedLang;
    
    langSelector.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
        applyFilters(); // Re-render with new language
    });
    
    // Initialize
    updateSelectArrows();
    switchLanguage(savedLang);
}

/**
 * Performance optimization: Lazy load images if IntersectionObserver is available
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    lazyImageObserver.unobserve(img);
                }
            });
        }, {
            // Add some margin for better user experience
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe images when they're added to the DOM
        const observer = new MutationObserver((mutations) => {
            // Throttle the observer to prevent excessive calls
            clearTimeout(observer.timeout);
            observer.timeout = setTimeout(() => {
                document.querySelectorAll('img[data-src].lazy').forEach(img => {
                    lazyImageObserver.observe(img);
                });
            }, 100);
        });

        const eventsGrid = document.getElementById('eventsGrid');
        if (eventsGrid) {
            observer.observe(eventsGrid, {
                childList: true,
                subtree: true
            });
        }
    }
}

/**
 * Initialize the application
 */
function initializeApp() {
    try {
        // Setup core functionality
        updateCounters();
        setupFilters();
        setupControls();
        setupLazyLoading();
        
        // Initial render
        applyFilters();
        
        // Add mobile-specific event listeners
        setupMobileOptimizations();
        
        // Handle potential errors gracefully
        window.addEventListener('error', (e) => {
            console.error('EventHunter Error:', e.error);
            handleError(e.error, 'window error');
        });
        
        // Log successful initialization
        console.log('🔎 Event Hunter 2025 initialized successfully!');
        
    } catch (error) {
        handleError(error, 'during initialization');
    }
}

/**
 * Setup mobile-specific optimizations
 */
function setupMobileOptimizations() {
    // Prevent zoom on iOS when focusing on inputs
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Ensure font-size is at least 16px to prevent zoom
            const computedStyle = window.getComputedStyle(input);
            const fontSize = parseFloat(computedStyle.fontSize);
            if (fontSize < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
    
    // Add passive touch listeners for better performance
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Recalculate layout after orientation change
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
}

/**
 * Error boundary for the application
 */
function handleError(error, context = '') {
    console.error(`EventHunter Error ${context}:`, error);
    
    // Fallback UI or user notification could be implemented here
    const eventsGrid = document.getElementById('eventsGrid');
    if (eventsGrid && eventsGrid.children.length === 0) {
        eventsGrid.innerHTML = `
            <div style="color: var(--text-secondary); text-align: center; grid-column: 1 / -1; font-size: 1.2rem;">
                <p>⚠️ Something went wrong. Please refresh the page.</p>
            </div>
        `;
    }
}

// ===== APPLICATION STARTUP =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApp();
    } catch (error) {
        handleError(error, 'during initialization');
    }
});

// Handle potential unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'unhandled promise rejection');
});

// ===== EXPORT FOR POTENTIAL MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCounters,
        renderEvents,
        applyFilters,
        setupFilters,
        setupControls,
        initializeApp
    };
} 