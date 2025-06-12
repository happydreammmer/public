// Companies Data 2025 - Main Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeCompanies();
    setupEventListeners();
    setupThemeToggle();
    setupLanguageSelector();
});

let currentLanguage = 'en';
let filteredCompanies = [];

function initializeCompanies() {
    populateFilters();
    renderCompanies();
    updateCounters();
    animateCounters();
}

function populateFilters() {
    populateSectorFilter();
    populateLocationFilter();
}

function populateSectorFilter() {
    const sectorFilter = document.getElementById('sectorFilter');
    const sectors = [...new Set(companies.map(company => company.sector))];
    
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = formatSectorName(sector);
        sectorFilter.appendChild(option);
    });
}

function populateLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    const locations = [...new Set(companies.map(company => company.location))];
    
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = formatLocationName(location);
        locationFilter.appendChild(option);
    });
}

function formatSectorName(sector) {
    const sectorMap = {
        'investment-finance': '💰 Investment & Finance',
        'technology': '💻 Technology',
        'energy': '⚡ Energy',
        'healthcare': '🏥 Healthcare',
        'manufacturing': '🏭 Manufacturing',
        'real-estate': '🏢 Real Estate',
        'logistics': '🚚 Logistics',
        'retail': '🛍️ Retail',
        'aviation': '✈️ Aviation',
        'telecommunications': '📡 Telecommunications'
    };
    return sectorMap[sector] || `🏢 ${sector.charAt(0).toUpperCase() + sector.slice(1)}`;
}

function formatLocationName(location) {
    const locationMap = {
        'abudhabi': '🏛️ Abu Dhabi',
        'dubai': '🏙️ Dubai',
        'sharjah': '🌆 Sharjah',
        'ajman': '🏘️ Ajman',
        'fujairah': '🏔️ Fujairah',
        'rasalkhaimah': '🏝️ Ras Al Khaimah',
        'ummalquwain': '🏖️ Umm Al Quwain',
        'muscat': '🏛️ Muscat',
        'salalah': '🌴 Salalah',
        'sohar': '🏭 Sohar',
        'nizwa': '🏰 Nizwa',
        'sur': '🚢 Sur'
    };
    return locationMap[location] || `📍 ${location.charAt(0).toUpperCase() + location.slice(1)}`;
}

function renderCompanies() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const countryFilter = document.getElementById('countryFilter').value;
    const sectorFilter = document.getElementById('sectorFilter').value;
    const sizeFilter = document.getElementById('sizeFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;

    filteredCompanies = companies.filter(company => {
        const matchesSearch = !searchTerm || 
            company.name.toLowerCase().includes(searchTerm) ||
            company.description.toLowerCase().includes(searchTerm) ||
            company.sector.toLowerCase().includes(searchTerm) ||
            company.location.toLowerCase().includes(searchTerm);
            
        const matchesCountry = countryFilter === 'all' || company.country === countryFilter;
        const matchesSector = sectorFilter === 'all' || company.sector === sectorFilter;
        const matchesSize = sizeFilter === 'all' || company.size === sizeFilter;
        const matchesPriority = priorityFilter === 'all' || company.priority === priorityFilter;
        const matchesLocation = locationFilter === 'all' || company.location === locationFilter;

        return matchesSearch && matchesCountry && matchesSector && matchesSize && matchesPriority && matchesLocation;
    });

    renderCompanyCards();
    updateCounters();
}

function renderCompanyCards() {
    const companiesGrid = document.getElementById('companiesGrid');
    companiesGrid.innerHTML = '';

    if (filteredCompanies.length === 0) {
        companiesGrid.innerHTML = `
            <div class="no-results">
                <h3 data-translate-key="noCompaniesFound">No companies found</h3>
                <p data-translate-key="tryAdjustingFilters">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    filteredCompanies.forEach((company, index) => {
        const companyCard = createCompanyCard(company, index);
        companiesGrid.appendChild(companyCard);
    });
}

function createCompanyCard(company, index) {
    const companyItem = document.createElement('div');
    companyItem.className = 'company-item';
    companyItem.style.animationDelay = `${index * 0.1}s`;

    const websiteUrl = company.website && company.website !== '#' ? company.website : '#';
    
    companyItem.innerHTML = `
        <div class="company-card">
            <div class="company-header">
                <span class="country-flag">${getCountryFlag(company.country)}</span>
                <h3 class="company-title">${company.name}</h3>
                <span class="priority-badge priority-${company.priority}">${getPriorityText(company.priority)}</span>
            </div>
            
            <div class="company-details">
                <div class="detail-item">
                    <span class="detail-icon">🏢</span>
                    <span>${formatSectorName(company.sector)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span>${formatLocationName(company.location)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📊</span>
                    <span>${getSizeText(company.size)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🎯</span>
                    <span>${getPriorityText(company.priority)} Priority</span>
                </div>
            </div>
            
            <div class="company-description">
                ${company.description || 'No description available.'}
            </div>
            
            <div class="company-footer">
                ${company.ai_use_case ? `
                    <div class="ai-use-case">
                        <strong>AI Opportunities:</strong> ${company.ai_use_case}
                    </div>
                ` : ''}
                ${websiteUrl !== '#' ? `
                    <a href="${websiteUrl}" target="_blank" class="website-link">
                        Visit Website →
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    return companyItem;
}

function getCountryFlag(country) {
    const flags = {
        'uae': '🇦🇪',
        'oman': '🇴🇲'
    };
    return flags[country] || '🏢';
}

function getPriorityText(priority) {
    const priorities = {
        'high': '🔥 High',
        'medium': '📊 Medium',
        'low': '📝 Low'
    };
    return priorities[priority] || priority;
}

function getSizeText(size) {
    const sizes = {
        'large': '🏭 Large',
        'medium': '🏢 Medium',
        'small': '🏪 Small'
    };
    return sizes[size] || size;
}

function updateCounters() {
    const totalCompanies = filteredCompanies.length;
    const uaeCompanies = filteredCompanies.filter(c => c.country === 'uae').length;
    const omanCompanies = filteredCompanies.filter(c => c.country === 'oman').length;
    const sectorsCount = new Set(filteredCompanies.map(c => c.sector)).size;

    document.getElementById('totalCompanies').textContent = totalCompanies;
    document.getElementById('uaeCompanies').textContent = uaeCompanies;
    document.getElementById('omanCompanies').textContent = omanCompanies;
    document.getElementById('sectorsCount').textContent = sectorsCount;
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));
    
    // Filter selects
    document.getElementById('countryFilter').addEventListener('change', applyFilters);
    document.getElementById('sectorFilter').addEventListener('change', applyFilters);
    document.getElementById('sizeFilter').addEventListener('change', applyFilters);
    document.getElementById('priorityFilter').addEventListener('change', applyFilters);
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

function setupLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    
    languageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        
        // Apply translations if translations.js is loaded
        if (typeof applyTranslations === 'function') {
            applyTranslations(currentLanguage);
        }
    });
}

// Utility function for debouncing
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