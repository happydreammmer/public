// Main application script for Companies Data
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const searchBox = document.getElementById('searchBox');
    const countryFilter = document.getElementById('countryFilter');
    const sectorFilter = document.getElementById('sectorFilter');
    const locationFilter = document.getElementById('locationFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const clearFilters = document.getElementById('clearFilters');
    const resultsCount = document.getElementById('resultsCount');
    const sectorsContainer = document.getElementById('sectorsContainer');
    const noResults = document.getElementById('noResults');
    
    // Stats elements
    const totalCompaniesElement = document.getElementById('totalCompanies');
    const totalSectorsElement = document.getElementById('totalSectors');
    const highPriorityElement = document.getElementById('highPriorityCount');
    const largeEnterpriseElement = document.getElementById('largeEnterpriseCount');

    let filteredCompanies = [];
    let allCompanies = [];

    // Initialize the application
    function init() {
        populateFilters();
        renderCompanies();
        updateStats();
        bindEvents();
    }

    // Populate filter dropdowns
    function populateFilters() {
        // Populate sector filter
        companiesData.filters.sectors.forEach(sector => {
            if (companiesData.sectors[sector.value]) {
                const option = document.createElement('option');
                option.value = sector.value;
                option.textContent = sector.label;
                sectorFilter.appendChild(option);
            }
        });

        // Populate location filter
        companiesData.filters.locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.value;
            option.textContent = location.label;
            locationFilter.appendChild(option);
        });
    }

    // Render companies to the DOM
    function renderCompanies() {
        sectorsContainer.innerHTML = '';
        allCompanies = [];

        Object.entries(companiesData.sectors).forEach(([sectorKey, sector]) => {
            const sectorDiv = createSectorElement(sectorKey, sector);
            sectorsContainer.appendChild(sectorDiv);
            allCompanies.push(...sector.companies.map(company => ({...company, sector: sectorKey})));
        });

        filterCompanies();
    }

    // Create sector element
    function createSectorElement(sectorKey, sector) {
        const sectorDiv = document.createElement('div');
        sectorDiv.className = 'sector';
        sectorDiv.setAttribute('data-sector', sectorKey);

        const sectorHeader = document.createElement('div');
        sectorHeader.className = 'sector-header';
        sectorHeader.innerHTML = `${sector.icon} ${sector.name}`;

        const companiesList = document.createElement('ul');
        companiesList.className = 'company-list';

        sector.companies.forEach(company => {
            const companyElement = createCompanyElement(company);
            companiesList.appendChild(companyElement);
        });

        sectorDiv.appendChild(sectorHeader);
        sectorDiv.appendChild(companiesList);

        return sectorDiv;
    }

    // Create company element
    function createCompanyElement(company) {
        const li = document.createElement('li');
        li.className = 'company';
        li.setAttribute('data-country', company.country);
        li.setAttribute('data-location', company.location);
        li.setAttribute('data-size', company.size);
        li.setAttribute('data-priority', company.priority);

        // Company header
        const header = document.createElement('div');
        header.className = 'company-header';

        const headerInfo = document.createElement('div');
        
        const name = document.createElement('div');
        name.className = 'company-name';
        name.textContent = company.name;

        const tags = document.createElement('div');
        tags.className = 'company-tags';
        
        const sizeTag = document.createElement('span');
        sizeTag.className = `company-tag company-size ${company.size}`;
        sizeTag.textContent = companiesData.filters.sizes.find(s => s.value === company.size)?.label || company.size;
        
        const locationTag = document.createElement('span');
        locationTag.className = 'company-tag company-location';
        locationTag.textContent = companiesData.filters.locations.find(l => l.value === company.location)?.label || company.location;

        tags.appendChild(sizeTag);
        tags.appendChild(locationTag);

        headerInfo.appendChild(name);
        headerInfo.appendChild(tags);

        const website = document.createElement('a');
        website.href = company.website;
        website.target = '_blank';
        website.className = 'company-website';
        website.textContent = 'Visit Website ↗';

        header.appendChild(headerInfo);
        header.appendChild(website);

        // Company services
        const services = document.createElement('div');
        services.className = 'company-services';
        services.textContent = company.services;

        // Company address
        const address = document.createElement('div');
        address.className = 'company-address';
        address.innerHTML = `<span class="address-icon">📍</span>${company.address}`;

        // Social links
        const socialLinks = document.createElement('div');
        socialLinks.className = 'social-links';

        Object.entries(company.socialLinks || {}).forEach(([platform, url]) => {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.className = 'social-link';
            link.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
            socialLinks.appendChild(link);
        });

        // AI use case
        const aiUseCase = document.createElement('div');
        aiUseCase.className = 'ai-use-case';
        aiUseCase.innerHTML = `Opportunities: ${company.aiUseCase}`;

        li.appendChild(header);
        li.appendChild(services);
        li.appendChild(address);
        li.appendChild(socialLinks);
        li.appendChild(aiUseCase);

        return li;
    }

    // Filter companies based on current filter values
    function filterCompanies() {
        const searchTerm = searchBox.value.toLowerCase().trim();
        const selectedCountry = countryFilter.value;
        const selectedSector = sectorFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedSize = sizeFilter.value;
        const selectedPriority = priorityFilter.value;

        const sectors = document.querySelectorAll('.sector');
        let visibleCompanies = 0;
        let visibleSectors = 0;

        sectors.forEach(sector => {
            const sectorType = sector.getAttribute('data-sector');
            let sectorHasVisibleCompanies = false;
            
            const isSectorVisibleByFilter = !selectedSector || sectorType === selectedSector;

            const companies = sector.querySelectorAll('.company');
            companies.forEach(company => {
                const companyCountry = company.getAttribute('data-country') || '';
                const companyLocation = company.getAttribute('data-location') || '';
                const companySize = company.getAttribute('data-size') || '';
                const companyPriority = company.getAttribute('data-priority') || '';
                
                const searchableText = (
                    getTextContent(company, '.company-name') +
                    getTextContent(company, '.company-services') +
                    getTextContent(company, '.ai-use-case') +
                    getTextContent(company, '.company-address') +
                    companyLocation
                );

                let isVisible = true;
                if (searchTerm && !searchableText.includes(searchTerm)) isVisible = false;
                if (selectedCountry && companyCountry !== selectedCountry) isVisible = false;
                if (selectedSector && sectorType !== selectedSector) isVisible = false;
                if (selectedLocation && companyLocation !== selectedLocation) isVisible = false;
                if (selectedSize && companySize !== selectedSize) isVisible = false;
                if (selectedPriority && companyPriority !== selectedPriority) isVisible = false;

                if (isVisible) {
                    company.classList.remove('hidden');
                    visibleCompanies++;
                    sectorHasVisibleCompanies = true;
                } else {
                    company.classList.add('hidden');
                }
            });

            if (sectorHasVisibleCompanies && isSectorVisibleByFilter) {
                sector.classList.remove('hidden');
                visibleSectors++;
            } else {
                sector.classList.add('hidden');
            }
        });

        // Update results count and show/hide no results message
        if (visibleCompanies === 0) {
            resultsCount.textContent = 'No companies found';
            noResults.classList.remove('hidden');
        } else {
            resultsCount.textContent = `Showing ${visibleCompanies} companies in ${visibleSectors} sectors`;
            noResults.classList.add('hidden');
        }
    }

    // Helper function to safely get text content
    function getTextContent(element, selector) {
        const target = selector ? element.querySelector(selector) : element;
        return target ? target.textContent.toLowerCase().trim() : '';
    }

    // Clear all filters
    function clearAllFilters() {
        searchBox.value = '';
        countryFilter.value = '';
        sectorFilter.value = '';
        locationFilter.value = '';
        sizeFilter.value = '';
        priorityFilter.value = '';
        filterCompanies();
    }

    // Update statistics
    function updateStats() {
        totalCompaniesElement.textContent = getCompanyCount() + '+';
        totalSectorsElement.textContent = getSectorCount();
        highPriorityElement.textContent = getHighPriorityCount();
        largeEnterpriseElement.textContent = getLargeEnterpriseCount();
    }

    // Bind event listeners
    function bindEvents() {
        searchBox.addEventListener('input', filterCompanies);
        countryFilter.addEventListener('change', filterCompanies);
        sectorFilter.addEventListener('change', filterCompanies);
        locationFilter.addEventListener('change', filterCompanies);
        sizeFilter.addEventListener('change', filterCompanies);
        priorityFilter.addEventListener('change', filterCompanies);
        clearFilters.addEventListener('click', clearAllFilters);
    }

    // Initialize the application
    init();
}); 