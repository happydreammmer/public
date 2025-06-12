/**
 * Event Migration Script
 * This script extracts events from the HTML file and moves missing ones to data.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const HTML_FILE = './Event Hunter V0.1.html';
const DATA_JS_FILE = './data.js';
const BACKUP_FILE = './data.js.backup';

/**
 * Extract events array from HTML file
 */
function extractEventsFromHTML(htmlContent) {
    try {
        // Find the start of the events array
        const eventsStart = htmlContent.indexOf('const events = [');
        if (eventsStart === -1) {
            throw new Error('Events array not found in HTML file');
        }

        // Find the end of the events array by counting brackets
        let bracketCount = 0;
        let inArray = false;
        let eventsEnd = eventsStart;
        
        for (let i = eventsStart; i < htmlContent.length; i++) {
            if (htmlContent[i] === '[') {
                if (!inArray) inArray = true;
                bracketCount++;
            } else if (htmlContent[i] === ']') {
                bracketCount--;
                if (inArray && bracketCount === 0) {
                    eventsEnd = i + 1;
                    break;
                }
            }
        }

        const eventsArrayStr = htmlContent.substring(eventsStart, eventsEnd);
        
        // Extract the array content between [ and ]
        const arrayContent = eventsArrayStr.substring(
            eventsArrayStr.indexOf('[') + 1, 
            eventsArrayStr.lastIndexOf(']')
        );

        // Parse individual event objects
        const events = [];
        let currentEvent = '';
        let braceCount = 0;
        let inString = false;
        let escapeNext = false;

        for (let i = 0; i < arrayContent.length; i++) {
            const char = arrayContent[i];
            
            if (escapeNext) {
                escapeNext = false;
                currentEvent += char;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                currentEvent += char;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
            }
            
            if (!inString) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                }
            }
            
            currentEvent += char;
            
            // If we've closed all braces and found a comma or end, we have a complete event
            if (braceCount === 0 && !inString && (char === ',' || i === arrayContent.length - 1)) {
                const eventStr = currentEvent.trim().replace(/,$/, '').trim();
                if (eventStr.startsWith('{') && eventStr.endsWith('}')) {
                    try {
                        // Clean up the event string for parsing
                        const cleanEventStr = eventStr
                            .replace(/(\w+):/g, '"$1":') // Add quotes around property names
                            .replace(/'/g, '"') // Replace single quotes with double quotes
                            .replace(/,(\s*})/g, '$1'); // Remove trailing commas
                        
                        const event = JSON.parse(cleanEventStr);
                        events.push(event);
                    } catch (parseError) {
                        console.warn('Failed to parse event:', eventStr.substring(0, 100) + '...');
                        console.warn('Parse error:', parseError.message);
                    }
                }
                currentEvent = '';
            }
        }

        return events;
    } catch (error) {
        console.error('Error extracting events from HTML:', error.message);
        return [];
    }
}

/**
 * Parse events from data.js file
 */
function parseDataJSEvents(dataJSContent) {
    try {
        // Extract the events array using regex
        const eventsMatch = dataJSContent.match(/const events = \[([\s\S]*?)\];/);
        if (!eventsMatch) {
            throw new Error('Events array not found in data.js');
        }

        // Use eval to parse the events (in a controlled environment)
        const eventsArrayStr = 'const events = [' + eventsMatch[1] + '];';
        const events = [];
        
        // Create a sandbox to evaluate the events array
        const sandbox = {
            events: null
        };
        
        // Execute the code in the sandbox context
        const vm = require('vm');
        vm.createContext(sandbox);
        vm.runInContext(eventsArrayStr, sandbox);
        
        return sandbox.events || [];
    } catch (error) {
        console.error('Error parsing data.js events:', error.message);
        return [];
    }
}

/**
 * Compare events and find missing ones
 */
function findMissingEvents(htmlEvents, dataJSEvents) {
    const missingEvents = [];
    
    // Create a set of existing event signatures for quick lookup
    const existingEvents = new Set();
    dataJSEvents.forEach(event => {
        const signature = `${event.name}|${event.country}|${event.city}|${event.date}`;
        existingEvents.add(signature);
    });
    
    // Find events that exist in HTML but not in data.js
    htmlEvents.forEach(event => {
        const signature = `${event.name}|${event.country}|${event.city}|${event.date}`;
        if (!existingEvents.has(signature)) {
            missingEvents.push(event);
        }
    });
    
    return missingEvents;
}

/**
 * Format event object as string for insertion
 */
function formatEventForInsertion(event) {
    const props = [];
    
    // Define the order of properties
    const propertyOrder = ['name', 'country', 'countryFlag', 'city', 'date', 'endDate', 'category', 'description', 'url', 'investment'];
    
    propertyOrder.forEach(prop => {
        if (event[prop] !== undefined) {
            props.push(`${prop}: "${event[prop].replace(/"/g, '\\"')}"`);
        }
    });
    
    return `{ ${props.join(', ')} }`;
}

/**
 * Insert missing events into data.js
 */
function insertMissingEvents(dataJSContent, missingEvents) {
    if (missingEvents.length === 0) {
        console.log('No missing events found.');
        return dataJSContent;
    }
    
    console.log(`Found ${missingEvents.length} missing events to add.`);
    
    // Group missing events by continent/region
    const eventsByRegion = {
        europe: [],
        americas: [],
        asia_pacific: [],
        middle_east_central_asia: [],
        africa: []
    };
    
    // Country to continent mapping
    const countryToContinentMap = {
        // Europe
        germany: "europe", france: "europe", netherlands: "europe", spain: "europe", 
        italy: "europe", unitedkingdom: "europe", switzerland: "europe", portugal: "europe", 
        denmark: "europe", finland: "europe", cyprus: "europe",
        
        // Americas
        usa: "americas", canada: "americas", brazil: "americas", mexico: "americas", 
        chile: "americas", argentina: "americas", colombia: "americas", peru: "americas",
        
        // Asia-Pacific
        china: "asia_pacific", japan: "asia_pacific", india: "asia_pacific", southkorea: "asia_pacific", 
        australia: "asia_pacific", newzealand: "asia_pacific", singapore: "asia_pacific", 
        hongkong: "asia_pacific", taiwan: "asia_pacific", malaysia: "asia_pacific", 
        thailand: "asia_pacific", indonesia: "asia_pacific", philippines: "asia_pacific", 
        vietnam: "asia_pacific", pakistan: "asia_pacific", bangladesh: "asia_pacific", 
        srilanka: "asia_pacific", nepal: "asia_pacific", cambodia: "asia_pacific", myanmar: "asia_pacific",
        
        // Middle East & Central Asia
        uae: "middle_east_central_asia", saudi: "middle_east_central_asia", qatar: "middle_east_central_asia", 
        turkey: "middle_east_central_asia", israel: "middle_east_central_asia", iran: "middle_east_central_asia", 
        iraq: "middle_east_central_asia", lebanon: "middle_east_central_asia", bahrain: "middle_east_central_asia", 
        jordan: "middle_east_central_asia", azerbaijan: "middle_east_central_asia", kazakhstan: "middle_east_central_asia", 
        uzbekistan: "middle_east_central_asia", turkmenistan: "middle_east_central_asia", kyrgyzstan: "middle_east_central_asia", 
        georgia: "middle_east_central_asia", armenia: "middle_east_central_asia", mongolia: "middle_east_central_asia", 
        kuwait: "middle_east_central_asia", oman: "middle_east_central_asia",
        
        // Africa
        southafrica: "africa", nigeria: "africa", egypt: "africa", kenya: "africa", 
        ghana: "africa", morocco: "africa", ethiopia: "africa", angola: "africa", 
        algeria: "africa", tunisia: "africa", rwanda: "africa", tanzania: "africa", 
        botswana: "africa", uganda: "africa", senegal: "africa", mozambique: "africa"
    };
    
    // Categorize missing events
    missingEvents.forEach(event => {
        const region = countryToContinentMap[event.country] || 'other';
        if (eventsByRegion[region]) {
            eventsByRegion[region].push(event);
        }
    });
    
    // Find insertion points for each region
    let modifiedContent = dataJSContent;
    
    Object.keys(eventsByRegion).forEach(region => {
        const events = eventsByRegion[region];
        if (events.length === 0) return;
        
        console.log(`Adding ${events.length} events to ${region.toUpperCase()}`);
        
        // Format events for insertion
        const formattedEvents = events.map(event => '    ' + formatEventForInsertion(event));
        
        // Find the region section
        const regionComment = region === 'europe' ? '// == EUROPE ==' :
                              region === 'americas' ? '// == AMERICAS ==' :
                              region === 'asia_pacific' ? '// == ASIA-PACIFIC ==' :
                              region === 'middle_east_central_asia' ? '// == MIDDLE EAST & CENTRAL ASIA ==' :
                              region === 'africa' ? '// == AFRICA ==' : '';
        
        if (regionComment) {
            const regionIndex = modifiedContent.indexOf(regionComment);
            if (regionIndex !== -1) {
                // Find the end of the region (next region comment or end of array)
                const nextRegionIndex = modifiedContent.indexOf('//', regionIndex + regionComment.length);
                const insertionPoint = nextRegionIndex !== -1 ? nextRegionIndex : modifiedContent.indexOf('];', regionIndex);
                
                if (insertionPoint !== -1) {
                    const eventsText = formattedEvents.join(',\n') + ',\n    ';
                    modifiedContent = modifiedContent.slice(0, insertionPoint) + eventsText + modifiedContent.slice(insertionPoint);
                }
            }
        }
    });
    
    return modifiedContent;
}

/**
 * Main migration function
 */
async function migrateEvents() {
    try {
        console.log('Starting event migration...');
        
        // Read files
        console.log('Reading HTML file...');
        const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
        
        console.log('Reading data.js file...');
        const dataJSContent = fs.readFileSync(DATA_JS_FILE, 'utf8');
        
        // Create backup
        console.log('Creating backup of data.js...');
        fs.writeFileSync(BACKUP_FILE, dataJSContent);
        
        // Extract events
        console.log('Extracting events from HTML...');
        const htmlEvents = extractEventsFromHTML(htmlContent);
        console.log(`Found ${htmlEvents.length} events in HTML file`);
        
        console.log('Parsing events from data.js...');
        const dataJSEvents = parseDataJSEvents(dataJSContent);
        console.log(`Found ${dataJSEvents.length} events in data.js file`);
        
        // Find missing events
        console.log('Comparing events...');
        const missingEvents = findMissingEvents(htmlEvents, dataJSEvents);
        
        if (missingEvents.length === 0) {
            console.log('✅ No missing events found. Migration complete!');
            return;
        }
        
        console.log(`📋 Found ${missingEvents.length} missing events:`);
        missingEvents.forEach(event => {
            console.log(`  - ${event.name} (${event.country}, ${event.date})`);
        });
        
        // Insert missing events
        console.log('Inserting missing events into data.js...');
        const updatedContent = insertMissingEvents(dataJSContent, missingEvents);
        
        // Write updated file
        fs.writeFileSync(DATA_JS_FILE, updatedContent);
        
        console.log('✅ Migration completed successfully!');
        console.log(`📄 Backup saved as: ${BACKUP_FILE}`);
        console.log(`📈 Added ${missingEvents.length} new events to data.js`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error.stack);
    }
}

// Run the migration if this script is executed directly
if (require.main === module) {
    migrateEvents();
}

module.exports = {
    migrateEvents,
    extractEventsFromHTML,
    parseDataJSEvents,
    findMissingEvents,
    insertMissingEvents
}; 