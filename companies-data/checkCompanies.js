const fs = require('fs');
const path = require('path');

// Helper to extract company names from HTML
function extractNamesFromHTML(html) {
    const regex = /<div class="company-name">(.*?)<\/div>/g;
    const names = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        names.push(match[1].trim());
    }
    return names;
}

// Helper to extract company names from data.js
function extractNamesFromDataJS(js) {
    // This regex assumes each company object has a "name": "..." field at the top level
    const regex = /"name"\s*:\s*"([^"]+)"/g;
    const names = [];
    let match;
    while ((match = regex.exec(js)) !== null) {
        // Ignore social/link objects
        if (match[1] !== 'LinkedIn' && match[1] !== 'Twitter' && match[1] !== 'Instagram') {
            names.push(match[1].trim());
        }
    }
    return names;
}

const htmlPath = path.join(__dirname, 'Companies - V0.1.html');
const datajsPath = path.join(__dirname, 'data.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const datajs = fs.readFileSync(datajsPath, 'utf8');

const htmlNames = extractNamesFromHTML(html);
const datajsNames = extractNamesFromDataJS(datajs);

const htmlSet = new Set(htmlNames);
const datajsSet = new Set(datajsNames);

const missingInDataJS = htmlNames.filter(name => !datajsSet.has(name));
const extraInDataJS = datajsNames.filter(name => !htmlSet.has(name));

console.log(`Companies in HTML: ${htmlNames.length}`);
console.log(`Companies in data.js: ${datajsNames.length}`);
console.log('---');
if (missingInDataJS.length) {
    console.log('Companies in HTML but missing in data.js:');
    missingInDataJS.forEach(name => console.log('  -', name));
} else {
    console.log('No companies missing in data.js!');
}
console.log('---');
if (extraInDataJS.length) {
    console.log('Companies in data.js but not in HTML:');
    extraInDataJS.forEach(name => console.log('  -', name));
} else {
    console.log('No extra companies in data.js!');
} 