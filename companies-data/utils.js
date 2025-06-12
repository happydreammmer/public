// Utility functions for Companies Data application

// Format company size for display
function formatCompanySize(size) {
    const sizeMap = {
        'large': 'Large Enterprise',
        'medium': 'Medium Enterprise',
        'small': 'Small/Medium Enterprise'
    };
    return sizeMap[size] || size;
}

// Format priority for display
function formatPriority(priority) {
    const priorityMap = {
        'high': 'High Priority',
        'medium': 'Medium Priority',
        'low': 'Low Priority',
        'emerging': 'Emerging Opportunity'
    };
    return priorityMap[priority] || priority;
}

// Format location for display
function formatLocation(location) {
    const locationMap = {
        'abudhabi': 'Abu Dhabi',
        'dubai': 'Dubai',
        'muscat': 'Muscat',
        'sohar': 'Sohar',
        'salalah': 'Salalah',
        'sharjah': 'Sharjah',
        'rasalkhaimah': 'Ras Al Khaimah',
        'duqm': 'Duqm',
        'sur': 'Sur',
        'nizwa': 'Nizwa',
        'rusayl': 'Rusayl',
        'multiple': 'Multiple Locations'
    };
    return locationMap[location] || location;
}

// Format country for display
function formatCountry(country) {
    const countryMap = {
        'uae': 'United Arab Emirates',
        'oman': 'Oman'
    };
    return countryMap[country] || country;
}

// Debounce function for search input
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

// Sanitize text for search
function sanitizeText(text) {
    return text.toLowerCase().trim().replace(/[^\w\s]/gi, '');
}

// Check if text matches search term
function matchesSearch(text, searchTerm) {
    const sanitizedText = sanitizeText(text);
    const sanitizedSearch = sanitizeText(searchTerm);
    return sanitizedText.includes(sanitizedSearch);
}

// Get company count by country
function getCompanyCountByCountry(country) {
    let count = 0;
    Object.values(companiesData.sectors).forEach(sector => {
        count += sector.companies.filter(company => company.country === country).length;
    });
    return count;
}

// Get company count by sector
function getCompanyCountBySector(sectorKey) {
    return companiesData.sectors[sectorKey]?.companies.length || 0;
}

// Get companies by priority
function getCompaniesByPriority(priority) {
    const companies = [];
    Object.values(companiesData.sectors).forEach(sector => {
        companies.push(...sector.companies.filter(company => company.priority === priority));
    });
    return companies;
}

// Get companies by size
function getCompaniesBySize(size) {
    const companies = [];
    Object.values(companiesData.sectors).forEach(sector => {
        companies.push(...sector.companies.filter(company => company.size === size));
    });
    return companies;
}

// Generate company card HTML
function generateCompanyCardHTML(company) {
    const sizeLabel = formatCompanySize(company.size);
    const locationLabel = formatLocation(company.location);
    
    let socialLinksHTML = '';
    if (company.socialLinks) {
        Object.entries(company.socialLinks).forEach(([platform, url]) => {
            socialLinksHTML += `<a href="${url}" target="_blank" class="social-link">${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`;
        });
    }

    return `
        <li class="company" data-country="${company.country}" data-location="${company.location}" data-size="${company.size}" data-priority="${company.priority}">
            <div class="company-header">
                <div>
                    <div class="company-name">${company.name}</div>
                    <div class="company-tags">
                        <span class="company-tag company-size ${company.size}">${sizeLabel}</span>
                        <span class="company-tag company-location">${locationLabel}</span>
                    </div>
                </div>
                <a href="${company.website}" target="_blank" class="company-website">Visit Website ↗</a>
            </div>
            <div class="company-services">${company.services}</div>
            <div class="company-address">
                <span class="address-icon">📍</span>
                ${company.address}
            </div>
            <div class="social-links">
                ${socialLinksHTML}
            </div>
            <div class="ai-use-case">Opportunities: ${company.aiUseCase}</div>
        </li>
    `;
}

// Get total company count
function getCompanyCount() {
    return companies.length;
}

// Get total sector count
function getSectorCount() {
    return Object.keys(companiesData.sectors).length;
}

// Get high priority companies count
function getHighPriorityCount() {
    return companies.filter(company => company.priority === 'high').length;
}

// Get large enterprise companies count
function getLargeEnterpriseCount() {
    return companies.filter(company => company.size === 'large').length;
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get country display name
function getCountryDisplayName(countryCode) {
    return countryDisplayNames[countryCode] || countryCode.toUpperCase();
}

// Get sector icon
function getSectorIcon(sectorKey) {
    return sectorIcons[sectorKey] || "🏢";
}

// Search companies by text
function searchCompanies(searchTerm) {
    if (!searchTerm) return companies;
    
    const term = searchTerm.toLowerCase();
    return companies.filter(company => 
        company.name.toLowerCase().includes(term) ||
        company.description.toLowerCase().includes(term) ||
        company.sector.toLowerCase().includes(term) ||
        company.location.toLowerCase().includes(term) ||
        company.ai_use_case.toLowerCase().includes(term)
    );
}

// Filter companies by criteria
function filterCompanies(filters) {
    return companies.filter(company => {
        if (filters.country && company.country !== filters.country) return false;
        if (filters.sector && company.sector !== filters.sector) return false;
        if (filters.location && company.location !== filters.location) return false;
        if (filters.size && company.size !== filters.size) return false;
        if (filters.priority && company.priority !== filters.priority) return false;
        return true;
    });
}

// Get unique values for a field
function getUniqueValues(field) {
    return [...new Set(companies.map(company => company[field]))].sort();
}

// Get companies by sector
function getCompaniesBySector(sectorKey) {
    return companies.filter(company => company.sector === sectorKey);
}

// Get companies by country
function getCompaniesByCountry(countryCode) {
    return companies.filter(company => company.country === countryCode);
}

// Get priority distribution
function getPriorityDistribution() {
    const distribution = {};
    companies.forEach(company => {
        distribution[company.priority] = (distribution[company.priority] || 0) + 1;
    });
    return distribution;
}

// Get size distribution
function getSizeDistribution() {
    const distribution = {};
    companies.forEach(company => {
        distribution[company.size] = (distribution[company.size] || 0) + 1;
    });
    return distribution;
}

// Get sector distribution
function getSectorDistribution() {
    const distribution = {};
    companies.forEach(company => {
        distribution[company.sector] = (distribution[company.sector] || 0) + 1;
    });
    return distribution;
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.CompaniesUtils = {
        formatCompanySize,
        formatPriority,
        formatLocation,
        formatCountry,
        debounce,
        sanitizeText,
        matchesSearch,
        getCompanyCountByCountry,
        getCompanyCountBySector,
        getCompaniesByPriority,
        getCompaniesBySize,
        generateCompanyCardHTML,
        getCompanyCount,
        getSectorCount,
        getHighPriorityCount,
        getLargeEnterpriseCount,
        formatNumber,
        getCountryDisplayName,
        getSectorIcon,
        searchCompanies,
        filterCompanies,
        getUniqueValues,
        getCompaniesBySector,
        getCompaniesByCountry,
        getPriorityDistribution,
        getSizeDistribution,
        getSectorDistribution
    };
} 