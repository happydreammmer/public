# Event Migration Scripts

This document explains how to use the migration scripts to move missing event data from the HTML file to the `data.js` file.

## 📁 Files

- `migrate-events.js` - Comprehensive automated migration script
- `simple-migrate.js` - Simple comparison and extraction tool
- `Event Hunter V0.1.html` - Source HTML file with events
- `data.js` - Target data file

## 🚀 Quick Start

### Method 1: Simple Migration (Recommended)

1. **Compare events to see what's missing:**
   ```bash
   node simple-migrate.js compare
   ```

2. **Extract all events from HTML for manual review:**
   ```bash
   node simple-migrate.js extract-all
   ```

3. **Manually copy missing events from `extracted-events.js` to `data.js`**

### Method 2: Automated Migration

1. **Run the full automated migration:**
   ```bash
   node migrate-events.js
   ```

## 📋 Detailed Instructions

### Using simple-migrate.js

This is the recommended approach as it gives you full control over the migration process.

#### Step 1: Compare Event Lists
```bash
node simple-migrate.js compare
```

This will:
- ✅ Count events in both files
- 📋 List events missing from data.js
- 🔍 Show events that exist in data.js but not HTML
- 📝 Display full event objects for missing events

#### Step 2: Extract All Events
```bash
node simple-migrate.js extract-all
```

This creates `extracted-events.js` with all events from the HTML file in a clean format.

#### Step 3: Manual Migration
1. Open both `extracted-events.js` and `data.js`
2. Copy missing events from extracted file
3. Place them in the correct continent section in `data.js`:
   - `// == EUROPE ==`
   - `// == AMERICAS ==`
   - `// == ASIA-PACIFIC ==`
   - `// == MIDDLE EAST & CENTRAL ASIA ==`
   - `// == AFRICA ==`

#### Step 4: Extract Specific Events (Optional)
If you need to extract specific events by name:
```bash
node simple-migrate.js extract "Event Name 1" "Event Name 2"
```

### Using migrate-events.js

This script attempts to automate the entire process:

```bash
node migrate-events.js
```

**What it does:**
- 🔍 Extracts events from HTML file
- 📊 Parses existing events from data.js
- 🔄 Compares and finds missing events
- 💾 Creates backup of data.js
- ➕ Automatically adds missing events
- 📈 Reports results

## 🛡️ Safety Features

- **Automatic Backup**: `migrate-events.js` creates `data.js.backup` before making changes
- **Dry Run**: `simple-migrate.js` doesn't modify files, only reports differences
- **Error Handling**: Both scripts include comprehensive error handling

## 📝 Event Format

Events should follow this format:
```javascript
{
    name: "Event Name",
    country: "countrycode",
    countryFlag: "🏳️",
    city: "City Name",
    date: "YYYY-MM-DD",
    endDate: "YYYY-MM-DD",
    category: "category_name",
    description: "Event description",
    url: "https://event-website.com", // optional
    investment: "Investment details" // optional
}
```

## 🎯 Categories

Available categories:
- `technology` 💻
- `healthcare` 🏥
- `energy` ⚡
- `finance` 💰
- `tourism` ✈️
- `construction` 🏗️
- `food` 🍽️
- `fashion` 👗
- `education` 📚
- `entertainment` 🎭
- `marketing` 📈
- `hr` 👥
- `supply_chain` 📦

## 🌍 Continent Mapping

Events are organized by continent/region:

### Europe
- germany, france, netherlands, spain, italy, unitedkingdom, switzerland, portugal, denmark, finland, cyprus

### Americas
- usa, canada, brazil, mexico, chile, argentina, colombia, peru

### Asia-Pacific
- china, japan, india, southkorea, australia, newzealand, singapore, hongkong, taiwan, malaysia, thailand, indonesia, philippines, vietnam, pakistan, bangladesh, srilanka, nepal, cambodia, myanmar

### Middle East & Central Asia
- uae, saudi, qatar, turkey, israel, iran, iraq, lebanon, bahrain, jordan, azerbaijan, kazakhstan, uzbekistan, turkmenistan, kyrgyzstan, georgia, armenia, mongolia, kuwait, oman

### Africa
- southafrica, nigeria, egypt, kenya, ghana, morocco, ethiopia, angola, algeria, tunisia, rwanda, tanzania, botswana, uganda, senegal, mozambique

## 🔧 Troubleshooting

### "Events array not found"
- Check that the HTML file exists and contains `const events = [`

### "Permission denied"
- Make sure you have write permissions in the directory
- Try running with elevated permissions if needed

### "Parse error"
- The HTML events might have formatting issues
- Use `simple-migrate.js` for manual control

### Missing Node.js modules
```bash
# The scripts use built-in Node.js modules, no npm install needed
# But make sure you have Node.js installed:
node --version
```

## 📊 Example Output

```
🔍 Comparing event lists between HTML and data.js...

📊 HTML Events Count: 350
📊 Data.js Events Count: 320

🔄 Events Missing from data.js (30):
   - New Event Example 2025
   - Another Missing Event
   - ...

📋 Missing Events Details:
================================

// Event: New Event Example 2025
{ name: "New Event Example 2025", country: "usa", countryFlag: "🇺🇸", city: "New York", date: "2025-06-15", endDate: "2025-06-17", category: "technology", description: "An example new event" }
```

## ✅ Verification

After migration, verify by running:
```bash
node simple-migrate.js compare
```

You should see: `✅ None missing!`

---

**💡 Pro Tip**: Always use `simple-migrate.js compare` first to understand what needs to be migrated before running any automated scripts. 