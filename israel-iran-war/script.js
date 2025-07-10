// Global variables
let selectedScenario = null;
let pollResults = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
let totalVotes = 0;
let probabilityChart = null;
let dynamicChart = null;
let dashboardData = null;

// Dynamic probabilities will be loaded from data.json
let baseProbabilities = {};
let dynamicProbabilities = {};
let riskFactors = {};
let activeRisks = new Set();

// Load dashboard data from JSON file
async function loadDashboardData() {
    try {
        const response = await fetch('./data.json');
        dashboardData = await response.json();
        
        // Set up global variables from loaded data
        baseProbabilities = {...dashboardData.baseProbabilities};
        dynamicProbabilities = {...dashboardData.baseProbabilities};
        riskFactors = dashboardData.riskFactors;
        
        // Populate the page with loaded data
        populatePageContent();
        initCharts(); // Charts are initialized after data is loaded
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to default values if data loading fails
        setDefaultData();
        initCharts(); // Initialize charts with default data on failure
    }
}

// Populate page content from loaded data
function populatePageContent() {
    if (!dashboardData) return;
    
    // Update header content
    updateHeaderContent();
    
    // Update poll section
    updatePollSection();
    
    // Update scenario section
    updateScenarioSection();
    
    // Update risk calculator
    updateRiskCalculator();
    
    // Update timeline
    updateTimeline();
    
    // Update ticker
    updateTicker();
}

function updateHeaderContent() {
    const data = dashboardData;
    
    // Update title and meta info
    document.title = data.meta.title;
    document.querySelector('.header h1').textContent = data.meta.title;
    document.querySelector('.header .subtitle').textContent = data.meta.subtitle;
    
    // Update breaking news
    if (data.breakingNews.isActive) {
        document.querySelector('.breaking-news').textContent = data.breakingNews.text;
    } else {
        document.querySelector('.breaking-news').style.display = 'none';
    }
    
    // Update meta info
    const metaInfo = document.querySelector('.meta-info');
    metaInfo.innerHTML = `<strong>Last Updated:</strong> ${data.meta.lastUpdated} | <strong>Status:</strong> ${data.meta.status}`;
    
    // Update game theory note
    document.querySelector('.game-theory-note h4').textContent = data.gameTheoryNote.title;
    document.querySelector('.game-theory-note p').innerHTML = `<strong>Strategic Assessment:</strong> ${data.gameTheoryNote.description}`;
}

function updatePollSection() {
    const pollData = dashboardData.poll;
    
    // Update poll question
    document.querySelector('.section p').textContent = pollData.question;
    
    // Update poll options
    const pollGrid = document.querySelector('.poll-grid');
    pollGrid.innerHTML = '';
    
    pollData.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'poll-option';
        optionElement.setAttribute('onclick', `selectOption(${option.id})`);
        
        optionElement.innerHTML = `
            <input type="radio" name="scenario" value="${option.id}" id="option${option.id}">
            <div class="poll-content">
                <div class="poll-title">${option.title}</div>
                <div class="poll-probability">${option.probability}</div>
                <div class="poll-description">${option.description}</div>
            </div>
        `;
        
        pollGrid.appendChild(optionElement);
    });
}

function updateScenarioSection() {
    const scenarioData = dashboardData.scenarios;
    
    // Update scenario description
    document.querySelector('.scenario-description-text p').innerHTML = `<strong>Game Theory Assessment:</strong> ${scenarioData.description}`;
    
    // Update chart legend
    document.querySelector('.chart-legend').innerHTML = `<strong>Methodology:</strong> ${scenarioData.chartLegend}`;
    
    // Update scenario cards
    const scenarioGrid = document.querySelector('.scenario-grid');
    scenarioGrid.innerHTML = '';
    
    scenarioData.items.forEach(scenario => {
        const cardElement = document.createElement('div');
        cardElement.className = `scenario-card scenario-${scenario.id}`;
        cardElement.setAttribute('onclick', `toggleScenario(${scenario.id})`);
        
        cardElement.innerHTML = `
            <div class="scenario-title">${scenario.title}</div>
            <div class="scenario-probability" style="color: ${scenario.color};">${scenario.probability}%</div>
            <div class="scenario-description">${scenario.description}</div>
        `;
        
        scenarioGrid.appendChild(cardElement);
    });
}

function updateRiskCalculator() {
    const riskData = dashboardData.riskCalculator;
    
    // Update intro text
    document.querySelector('.calculator-intro p').innerHTML = `<strong>Game Theory Analysis:</strong> ${riskData.intro}`;
    
    // Update escalation analysis
    document.querySelector('.escalation-analysis h5').textContent = riskData.escalationAnalysis.title;
    document.querySelector('.escalation-analysis p').innerHTML = `<strong>Current Risk Level:</strong> ${riskData.escalationAnalysis.description}`;
    
    // Update risk categories
    const riskFactorsContainer = document.querySelector('.risk-factors');
    riskFactorsContainer.innerHTML = '';
    
    riskData.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'risk-category';
        
        let factorsHTML = '';
        category.factors.forEach(factor => {
            factorsHTML += `
                <div class="risk-item">
                    <div class="risk-label">
                        <div>${factor.label}</div>
                        <div class="risk-impact">${factor.impact}</div>
                    </div>
                    <div class="risk-toggle" data-factor="${factor.id}" onclick="toggleRisk(this)"></div>
                </div>
            `;
        });
        
        categoryElement.innerHTML = `
            <h4>${category.title}</h4>
            ${factorsHTML}
        `;
        
        riskFactorsContainer.appendChild(categoryElement);
    });
}

function updateTimeline() {
    const timelineData = dashboardData.timeline;
    
    // Update timeline description
    document.querySelector('.section h2 + p').textContent = timelineData.description;
    
    // Update timeline events
    const timelineContainer = document.querySelector('.timeline-container');
    timelineContainer.innerHTML = '';
    
    timelineData.events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-item';
        
        eventElement.innerHTML = `
            <div class="timeline-date">${event.date}</div>
            <div class="timeline-content">
                <div class="timeline-title">${event.title}</div>
                <div class="timeline-description">
                    <strong>${event.description.split(':')[0]}:</strong> ${event.description.split(':').slice(1).join(':')}
                </div>
            </div>
        `;
        
        timelineContainer.appendChild(eventElement);
    });
}

function updateTicker() {
    const headlines = dashboardData.tickerHeadlines;
    const ticker = document.querySelector('.headline-ticker');
    
    ticker.innerHTML = '';
    headlines.forEach(headline => {
        const span = document.createElement('span');
        span.className = 'headline-item';
        span.textContent = headline;
        ticker.appendChild(span);
    });
}

function setDefaultData() {
    // Fallback default values if JSON loading fails
    baseProbabilities = {
        covert: 35,
        breakout: 20,
        diplomatic: 25,
        strike: 15,
        statusQuo: 5
    };
    
    dynamicProbabilities = {...baseProbabilities};
    
    riskFactors = {
        'covert-reconstruction': { covert: 30, breakout: 5, diplomatic: -15, strike: 10, statusQuo: -10 },
        'npt-exit': { covert: -20, breakout: 40, diplomatic: -25, strike: 15, statusQuo: -15 },
        'iaea-suspension': { covert: 25, breakout: 10, diplomatic: -10, strike: 5, statusQuo: -5 },
        'enrichment-restart': { covert: 10, breakout: 15, diplomatic: -10, strike: 20, statusQuo: -10 }
    };
}

function selectOption(scenario) {
    selectedScenario = scenario;
    
    const pollOptions = document.querySelectorAll('.poll-option');
    pollOptions.forEach(option => option.classList.remove('selected'));
    
    if (pollOptions[scenario - 1]) {
        pollOptions[scenario - 1].classList.add('selected');
        const radioInput = pollOptions[scenario - 1].querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.checked = true;
        }
    }
}

function submitVote() {
    if (!selectedScenario) {
        alert('Please select a scenario before voting.');
        return;
    }
    
    pollResults[selectedScenario]++;
    totalVotes++;
    
    updatePollResults();
    
    const resultsDiv = document.getElementById('voteResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
    }
    
    const voteButton = document.querySelector('.vote-button');
    if (voteButton) {
        voteButton.textContent = 'Vote Submitted!';
        voteButton.disabled = true;
    }
}

function updatePollResults() {
    if (!dashboardData) return;
    
    const scenarios = dashboardData.poll.options.map(option => option.title);
    
    const resultsDiv = document.getElementById('pollResults');
    if (!resultsDiv) return;
    
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
    
    for (let i = 1; i <= 5; i++) {
        const percentage = totalVotes > 0 ? Math.round((pollResults[i] / totalVotes) * 100) : 0;
        html += `
            <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                <div style="font-weight: bold; margin-bottom: 10px; font-size: 0.9em;">${scenarios[i-1]}</div>
                <div style="font-size: 1.5em; color: #2a5298;">${percentage}%</div>
                <div style="color: #666;">${pollResults[i]} votes</div>
            </div>
        `;
    }
    html += '</div>';
    html += `<p style="text-align: center; margin-top: 15px;"><strong>Total Votes: ${totalVotes}</strong></p>`;
    
    resultsDiv.innerHTML = html;
}

function toggleRisk(element) {
    try {
        const factor = element.getAttribute('data-factor');
        
        if (element.classList.contains('active')) {
            element.classList.remove('active');
            activeRisks.delete(factor);
        } else {
            element.classList.add('active');
            activeRisks.add(factor);
        }
        
        updateDynamicProbabilities();
    } catch (error) {
        console.error('Error toggling risk:', error);
    }
}

function updateDynamicProbabilities() {
    try {
        dynamicProbabilities = {...baseProbabilities};
        
        activeRisks.forEach(factor => {
            const impacts = riskFactors[factor];
            if (impacts) {
                dynamicProbabilities.covert += impacts.covert || 0;
                dynamicProbabilities.breakout += impacts.breakout || 0;
                dynamicProbabilities.diplomatic += impacts.diplomatic || 0;
                dynamicProbabilities.strike += impacts.strike || 0;
                dynamicProbabilities.statusQuo += impacts.statusQuo || 0;
            }
        });
        
        const total = Object.values(dynamicProbabilities).reduce((sum, val) => sum + Math.max(0, val), 0);
        if (total > 0) {
            Object.keys(dynamicProbabilities).forEach(key => {
                dynamicProbabilities[key] = Math.max(0, dynamicProbabilities[key]);
                dynamicProbabilities[key] = Math.round((dynamicProbabilities[key] / total) * 100);
            });
        }
        
        updateDynamicChart();
    } catch (error) {
        console.error('Error updating dynamic probabilities:', error);
    }
}

function updateDynamicChart() {
    try {
        if (!dashboardData) return;

        const scenarioItems = dashboardData.scenarios.items;
        
        const scenarioTitleMap = {
            'covert': "Covert Nuclear Reconstruction",
            'breakout': "Open Nuclear Breakout",
            'diplomatic': "Renewed Diplomatic Engagement",
            'strike': "Israeli Preventive Strike 2.0",
            'statusQuo': "Status Quo Maintenance"
        };
        
        const dataKeys = Object.keys(dynamicProbabilities);
        const labels = dataKeys.map(key => `${scenarioTitleMap[key] || key} (${dynamicProbabilities[key]}%)`);
        const data = dataKeys.map(key => dynamicProbabilities[key]);

        if (dynamicChart) {
            dynamicChart.data.datasets[0].data = data;
            dynamicChart.data.labels = labels;
            dynamicChart.update('none');
        }
    } catch (error) {
        console.error('Error updating dynamic chart:', error);
    }
}

function toggleScenario(scenarioNum) {
    if (event && event.currentTarget) {
        event.currentTarget.style.transform = 'scale(0.98)';
        setTimeout(() => {
            event.currentTarget.style.transform = '';
        }, 150);
    }
}

function closeTicker() {
    const ticker = document.getElementById('stickyTicker');
    if (ticker) {
        ticker.style.display = 'none';
    }
}

function initCharts() {
    try {
        const scenarioItems = dashboardData ? dashboardData.scenarios.items : [];
        const baseProbs = dashboardData ? dashboardData.baseProbabilities : {};
        
        const staticChartLabels = scenarioItems.map(item => `${item.title} (${item.probability}%)`);
        const staticChartData = scenarioItems.map(item => item.probability);
        const staticChartColors = scenarioItems.map(item => item.color);

        const ctx1 = document.getElementById('probabilityChart');
        if (ctx1) {
            probabilityChart = new Chart(ctx1.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: staticChartLabels.length > 0 ? staticChartLabels : ['Loading...'],
                    datasets: [{
                        data: staticChartData.length > 0 ? staticChartData : [100],
                        backgroundColor: staticChartColors.length > 0 ? staticChartColors : ['#cccccc'],
                        borderWidth: 3,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: { size: 10 }
                            }
                        }
                    }
                }
            });
        }

        const scenarioTitleMap = {
            'covert': "Covert Nuclear Reconstruction",
            'breakout': "Open Nuclear Breakout",
            'diplomatic': "Renewed Diplomatic Engagement",
            'strike': "Israeli Preventive Strike 2.0",
            'statusQuo': "Status Quo Maintenance"
        };

        const dynamicChartKeys = Object.keys(baseProbs);
        const dynamicChartLabels = dynamicChartKeys.length > 0 ? dynamicChartKeys.map(key => `${scenarioTitleMap[key] || key} (${baseProbs[key]}%)`) : ['Loading...'];
        const dynamicChartData = dynamicChartKeys.length > 0 ? dynamicChartKeys.map(key => baseProbs[key]) : [100];
        
        const ctx2 = document.getElementById('dynamicChart');
        if (ctx2) {
            dynamicChart = new Chart(ctx2.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: dynamicChartLabels,
                    datasets: [{
                        data: dynamicChartData,
                        backgroundColor: staticChartColors.length > 0 ? staticChartColors : ['#cccccc'],
                        borderWidth: 3,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: { size: 10 }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load data first, which will then initialize charts
        await loadDashboardData();
        
        // Update poll results view
        updatePollResults();
        
        // Show ticker
        const ticker = document.getElementById('stickyTicker');
        if (ticker) {
            ticker.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}); 