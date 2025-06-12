// ===== UTILITY FUNCTIONS =====

/**
 * Create a date object that works consistently across browsers, especially iOS Safari
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Date} Properly parsed date object
 */
function createSafeDate(dateString) {
    if (!dateString) return new Date();
    
    // iOS Safari has issues with YYYY-MM-DD format, so we explicitly parse it
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    
    // Fallback to regular Date constructor
    return new Date(dateString);
}

/**
 * Calculate days until a given date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {number} Days until the date
 */
function calculateDaysUntil(dateString) {
    const eventDate = createSafeDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    eventDate.setHours(0, 0, 0, 0);
    
    const timeDiff = eventDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Animate a number counter with smooth transitions
 * @param {HTMLElement} element - The element to animate
 * @param {number} target - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 */
function animateCounter(element, target, duration = 1500) {
    if (!element) return;
    
    let start = 0;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    
    function count() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(count);
        } else {
            element.textContent = target;
        }
    }
    
    // Check if user prefers reduced motion
    if (prefersReducedMotion()) {
        element.textContent = target;
        return;
    }
    
    requestAnimationFrame(count);
}

/**
 * Update dropdown arrow styles based on current theme
 */
function updateSelectArrows() {
    const isLight = document.body.classList.contains('light-theme');
    const arrowColor = isLight ? '%2364748b' : '%2394a3b8'; // Corresponds to --text-muted var
    const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='${arrowColor}' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;
    
    document.querySelectorAll('.language-select, .filter-select').forEach(sel => {
        sel.style.backgroundImage = arrowSvg;
    });
}

/**
 * Create an event card HTML structure
 * @param {Object} event - Event object
 * @param {number} index - Card index for animation delay
 * @returns {string} HTML string for the event card
 */
function createEventCard(event, index) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventEndDate = createSafeDate(event.endDate || event.date);
    eventEndDate.setHours(0, 0, 0, 0);
    
    const daysUntil = calculateDaysUntil(event.date);
    const actualStatus = eventEndDate < today ? 'completed' : 'upcoming';
    const hasFooterContent = event.investment || (actualStatus === 'upcoming' && daysUntil > 0);
    
    const t = translations[currentLang];
    const statusText = actualStatus === 'completed' ? t.statusCompleted : t.statusUpcoming;
    const categoryName = t[event.category] || (event.category.charAt(0).toUpperCase() + event.category.slice(1));

    // Format dates safely for all browsers
    const eventStartDate = createSafeDate(event.date);
    const eventEndDateFormatted = createSafeDate(event.endDate);
    
    const dateOptions = { month: 'short', day: 'numeric' };
    const endDateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    
    // Use safe locale formatting
    const locale = currentLang === 'en' ? 'en-US' : (currentLang === 'ar' ? 'ar' : currentLang);
    
    let startDateFormatted, endDateFormatted, yearFormatted, dateString;
    
    try {
        startDateFormatted = eventStartDate.toLocaleDateString(locale, dateOptions);
        endDateFormatted = eventEndDateFormatted.toLocaleDateString(locale, endDateOptions);
        yearFormatted = eventStartDate.getFullYear();
        
        dateString = event.endDate && event.endDate !== event.date
            ? `${startDateFormatted} - ${endDateFormatted}`
            : `${startDateFormatted}, ${yearFormatted}`;
    } catch (error) {
        // Fallback to basic formatting if locale formatting fails
        console.warn('Date formatting failed, using fallback:', error);
        dateString = `${event.date}${event.endDate && event.endDate !== event.date ? ' - ' + event.endDate : ''}`;
    }

    const tag = event.url ? 'a' : 'div';
    const linkAttrs = event.url ? `href="${event.url}" target="_blank" rel="noopener noreferrer"` : ``;

    // Calculate event duration safely
    let durationText = '';
    if (event.endDate && event.endDate !== event.date) {
        try {
            const startDate = createSafeDate(event.date);
            const endDate = createSafeDate(event.endDate);
            const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            durationText = `
                <div class="detail-item">
                    <span class="detail-icon">⏱️</span>
                    <span>${durationDays} ${t.daysDuration}</span>
                </div>
            `;
        } catch (error) {
            console.warn('Duration calculation failed:', error);
        }
    }

    return `
        <${tag} ${linkAttrs} class="event-item" style="animation-delay: ${index * 0.05}s">
            <div class="event-card ${actualStatus}">
                <div class="event-header">
                    <span class="country-flag">${event.countryFlag}</span>
                    <div class="event-title">${event.name}</div>
                    <span class="event-status status-${actualStatus}">${statusText}</span>
                </div>
                <div class="event-details">
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <span>${event.city}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">${categoryIcons[event.category] || '📅'}</span>
                        <span>${categoryName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🗓️</span>
                        <span>${dateString}</span>
                    </div>
                    ${durationText}
                </div>
                <div class="event-description">${event.description}</div>
                ${hasFooterContent ? `
                    <div class="event-footer">
                        ${event.investment ? `<div class="investment-highlight">${t.investmentPrefix}${event.investment}</div>` : ''}
                        ${actualStatus === 'upcoming' && daysUntil > 0 ? `<div class="countdown">${t.countdownPrefix}${daysUntil} ${t.daysUntil}</div>` : ''}
                    </div>
                ` : ''}
            </div>
        </${tag}>
    `;
}

/**
 * Switch application language and update UI
 * @param {string} lang - Language code ('en', 'ar', 'fa')
 */
function switchLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    const t = translations[lang];
    
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' || lang === 'fa') ? 'rtl' : 'ltr';
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        const type = el.dataset.translateType || 'textContent';
        if (t[key]) {
            el[type] = t[key];
        }
    });

    // Update dynamic option texts
    document.querySelectorAll('#industryFilter option, #continentFilter option, #monthFilter option').forEach(opt => {
        const key = opt.dataset.translateKey;
        if (key && t[key]) {
            if (opt.parentElement.id === 'industryFilter') {
                 opt.textContent = `${categoryIcons[key] || '📁'} ${t[key]}`;
            } else {
                opt.textContent = t[key];
            }
        }
    });
    
    localStorage.setItem('eventHunterLang', lang);
}

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get event statistics for counters
 * @returns {Object} Statistics object with counts
 */
function getEventStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const total = events.length;
    const completed = events.filter(e => {
        const eventEndDate = createSafeDate(e.endDate || e.date);
        eventEndDate.setHours(0, 0, 0, 0);
        return eventEndDate < today;
    }).length;
    const upcoming = total - completed;
    const countries = new Set(events.map(e => e.country)).size;
    
    return { total, completed, upcoming, countries };
}

/**
 * Format date for display in user's locale
 * @param {string} dateString - Date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
function formatDate(dateString, options = {}) {
    try {
        const locale = currentLang === 'en' ? 'en-US' : currentLang;
        const date = createSafeDate(dateString);
        return date.toLocaleDateString(locale, options);
    } catch (error) {
        console.warn('Date formatting failed, using fallback:', error);
        return dateString;
    }
}

/**
 * Check if device prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
} 