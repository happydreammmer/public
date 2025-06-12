/**
 * Simple Event Migration Script
 * This script provides a more manual but reliable approach to move events from HTML to data.js
 */

const fs = require('fs');

// File paths
const HTML_FILE = './Event Hunter V0.1.html';
const DATA_JS_FILE = './data.js';

/**
 * Simple function to extract event names from both files for comparison
 */
function compareEventLists() {
    try {
        console.log('🔍 Comparing event lists between HTML and data.js...\n');
        
        // Read both files
        const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
        const dataJSContent = fs.readFileSync(DATA_JS_FILE, 'utf8');
        
        // Extract event names from HTML using regex
        const htmlEventMatches = htmlContent.match(/name: "([^"]+)"/g) || [];
        const htmlEvents = htmlEventMatches.map(match => match.replace('name: "', '').replace('"', ''));
        
        // Extract event names from data.js using regex
        const dataJSEventMatches = dataJSContent.match(/name: "([^"]+)"/g) || [];
        const dataJSEvents = dataJSEventMatches.map(match => match.replace('name: "', '').replace('"', ''));
        
        console.log(`📊 HTML Events Count: ${htmlEvents.length}`);
        console.log(`📊 Data.js Events Count: ${dataJSEvents.length}\n`);
        
        // Find events in HTML but not in data.js
        const missingEvents = [];
        htmlEvents.forEach(eventName => {
            if (!dataJSEvents.includes(eventName)) {
                missingEvents.push(eventName);
            }
        });
        
        // Find events in data.js but not in HTML
        const extraEvents = [];
        dataJSEvents.forEach(eventName => {
            if (!htmlEvents.includes(eventName)) {
                extraEvents.push(eventName);
            }
        });
        
        console.log(`🔄 Events Missing from data.js (${missingEvents.length}):`);
        if (missingEvents.length === 0) {
            console.log('   ✅ None missing!');
        } else {
            missingEvents.forEach(event => console.log(`   - ${event}`));
        }
        
        console.log(`\n➕ Events in data.js but not in HTML (${extraEvents.length}):`);
        if (extraEvents.length === 0) {
            console.log('   ✅ None extra!');
        } else {
            extraEvents.forEach(event => console.log(`   - ${event}`));
        }
        
        // Extract full event objects for manual review
        if (missingEvents.length > 0) {
            console.log('\n📋 Missing Events Details:');
            console.log('================================');
            
            missingEvents.forEach(eventName => {
                // Find the full event object in HTML
                const eventPattern = new RegExp(`{[^}]*name: "${eventName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*}`, 'g');
                const eventMatch = htmlContent.match(eventPattern);
                
                if (eventMatch && eventMatch[0]) {
                    console.log(`\n// Event: ${eventName}`);
                    console.log(eventMatch[0].replace(/},/g, '}'));
                }
            });
            
            console.log('\n📝 Instructions:');
            console.log('1. Copy the missing events shown above');
            console.log('2. Add them to the appropriate section in data.js');
            console.log('3. Make sure to place them in the correct continent section');
            console.log('4. Verify the formatting matches the existing events');
        }
        
    } catch (error) {
        console.error('❌ Error comparing files:', error.message);
    }
}

/**
 * Function to extract specific events by name for manual copying
 */
function extractSpecificEvents(eventNames) {
    try {
        const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
        
        console.log('🎯 Extracting specific events:\n');
        
        eventNames.forEach(eventName => {
            // Create a more flexible regex that captures the entire event object
            const patterns = [
                new RegExp(`{[^}]*name:\\s*"${eventName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*}`, 'g'),
                new RegExp(`{[^}]*"${eventName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*}`, 'g')
            ];
            
            let found = false;
            for (const pattern of patterns) {
                const matches = htmlContent.match(pattern);
                if (matches && matches[0]) {
                    console.log(`// ${eventName}`);
                    console.log(matches[0].replace(/},\s*$/, '').trim() + ',\n');
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                console.log(`❌ Could not find event: ${eventName}`);
            }
        });
        
    } catch (error) {
        console.error('❌ Error extracting events:', error.message);
    }
}

/**
 * Function to create a clean copy of all events from HTML
 */
function extractAllEventsFromHTML() {
    try {
        const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
        
        // Find the events array start and end
        const eventsStart = htmlContent.indexOf('const events = [');
        const eventsEnd = htmlContent.indexOf('];', eventsStart) + 2;
        
        if (eventsStart === -1 || eventsEnd === -1) {
            throw new Error('Could not find events array in HTML file');
        }
        
        const eventsSection = htmlContent.substring(eventsStart, eventsEnd);
        
        // Write to a new file for manual review
        fs.writeFileSync('./extracted-events.js', eventsSection);
        
        console.log('✅ All events extracted to: extracted-events.js');
        console.log('📝 You can now manually copy missing events from this file to data.js');
        
    } catch (error) {
        console.error('❌ Error extracting all events:', error.message);
    }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'compare':
        compareEventLists();
        break;
    case 'extract':
        if (args.length < 2) {
            console.log('Usage: node simple-migrate.js extract "Event Name 1" "Event Name 2"');
            process.exit(1);
        }
        extractSpecificEvents(args.slice(1));
        break;
    case 'extract-all':
        extractAllEventsFromHTML();
        break;
    default:
        console.log('📖 Event Migration Tool Usage:');
        console.log('================================');
        console.log('node simple-migrate.js compare          - Compare event lists');
        console.log('node simple-migrate.js extract "Event"  - Extract specific events');
        console.log('node simple-migrate.js extract-all      - Extract all events to file');
        console.log('');
        console.log('🎯 Recommended workflow:');
        console.log('1. Run "compare" to see missing events');
        console.log('2. Run "extract-all" to get a clean copy');
        console.log('3. Manually copy missing events to data.js');
        break;
} 