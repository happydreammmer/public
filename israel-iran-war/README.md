# Iran-Israel Crisis Dashboard

A strategic analysis dashboard with game theory framework for tracking the Iran-Israel conflict. This dashboard has been restructured into modular components for easy content management and updates.

## 📁 Project Structure

```
israel-iran-war/
├── index.html          # Main HTML structure (skeleton)
├── styles.css          # All CSS styles and animations
├── script.js           # JavaScript functionality and data loading
├── data.json           # All dynamic content (EDIT THIS TO UPDATE CONTENT)
└── README.md           # This documentation
```

## 🔧 How It Works

The dashboard is now separated into:

1. **`index.html`** - Contains only the basic HTML structure and placeholders
2. **`styles.css`** - Contains all styling, animations, and responsive design
3. **`script.js`** - Handles all functionality and dynamically loads content from data.json
4. **`data.json`** - Contains ALL dynamic content that you want to update regularly

## 📝 Updating Content

To update the dashboard content (breaking news, scenarios, timeline, etc.), **only edit the `data.json` file**. You don't need to touch the HTML, CSS, or JavaScript files.

### Key Sections in data.json:

#### Meta Information
```json
"meta": {
  "title": "Iran-Israel Crisis Dashboard",
  "subtitle": "Strategic Analysis & Game Theory Assessment", 
  "lastUpdated": "June 13, 2025",
  "status": "Active Crisis"
}
```

#### Breaking News
```json
"breakingNews": {
  "text": "🚨 BREAKING: Your latest breaking news here",
  "isActive": true
}
```
Set `"isActive": false` to hide the breaking news banner.

#### Poll Options
```json
"poll": {
  "question": "Your poll question here",
  "options": [
    {
      "id": 1,
      "title": "Option 1 Title",
      "probability": "Strategic: 25%",
      "description": "Brief description"
    }
  ]
}
```

#### Scenarios
Update probabilities and descriptions:
```json
"scenarios": {
  "description": "Game theory assessment text",
  "items": [
    {
      "id": 1,
      "title": "Scenario Name",
      "probability": 25,
      "color": "#28a745",
      "description": "Detailed scenario description"
    }
  ]
}
```

#### Risk Calculator
Add or modify risk factors:
```json
"riskCalculator": {
  "categories": [
    {
      "title": "🏛️ Category Name",
      "factors": [
        {
          "id": "unique-factor-id",
          "label": "Factor Description",
          "impact": "+15% Impact Description"
        }
      ]
    }
  ]
}
```

#### Timeline Events
```json
"timeline": {
  "events": [
    {
      "date": "72hrs",
      "title": "🎯 Event Title",
      "description": "Event description with analysis"
    }
  ]
}
```

#### Ticker Headlines
```json
"tickerHeadlines": [
  "Your headline 1",
  "Your headline 2", 
  "Your headline 3"
]
```

## 🚀 Quick Updates

### To update breaking news:
1. Open `data.json`
2. Find the `"breakingNews"` section
3. Change the `"text"` field
4. Save the file
5. Refresh the webpage

### To update probabilities:
1. Open `data.json`
2. Find `"scenarios"` → `"items"`
3. Change the `"probability"` numbers
4. Save the file
5. Refresh the webpage

### To add new risk factors:
1. Open `data.json`
2. Find `"riskCalculator"` → `"categories"`
3. Add new factors to existing categories or create new categories
4. Also add the factor to `"riskFactors"` at the bottom with impact values
5. Save and refresh

## 🎨 Customization

### Colors
Scenario colors can be changed in the `data.json` file:
- `#28a745` - Green (positive scenarios)
- `#ffc107` - Yellow/Orange (neutral scenarios)  
- `#dc3545` - Red (negative scenarios)
- `#6f42c1` - Purple (special scenarios)
- `#fd7e14` - Orange (intervention scenarios)

### Styling
To modify visual appearance, edit `styles.css`. The CSS is well-organized with clear section comments.

### Functionality  
To modify behavior or add new features, edit `script.js`. The code is modular and well-commented.

## 📱 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Charts**: Dynamic probability charts using Chart.js
- **Real-time Updates**: Content loads from JSON without page reload
- **Risk Calculator**: Interactive toggles that update probabilities in real-time
- **Animated Ticker**: Scrolling news ticker at bottom
- **Modern UI**: Clean, professional design with smooth animations

## 🔍 Troubleshooting

### Content not updating?
1. Check that your JSON is valid (use a JSON validator)
2. Ensure all required fields are present
3. Check browser console for errors (F12)
4. Try hard refresh (Ctrl+F5)

### Charts not showing?
1. Ensure Chart.js CDN is loading
2. Check that probability values are numbers, not strings
3. Verify `baseProbabilities` and `riskFactors` sections are correct

### Layout broken?
1. Validate your JSON syntax
2. Check that all HTML elements have matching IDs
3. Ensure CSS file is loading correctly

## 📊 Data Structure Reference

The `data.json` file follows a specific structure. Always maintain this structure when making updates:

- `meta` - Basic page information
- `breakingNews` - Alert banner content  
- `gameTheoryNote` - Strategic framework explanation
- `poll` - Community assessment poll
- `scenarios` - Strategic scenario analysis
- `riskCalculator` - Interactive risk assessment tool
- `timeline` - Critical decision timeline
- `tickerHeadlines` - Bottom scrolling news
- `baseProbabilities` - Default probability values
- `riskFactors` - Risk impact calculations

## 🛡️ Best Practices

1. **Always backup** `data.json` before making changes
2. **Validate JSON** syntax before saving
3. **Test changes** in a browser after updates
4. **Keep descriptions concise** but informative
5. **Use consistent formatting** for dates and percentages
6. **Maintain strategic tone** appropriate for the analysis

## 📞 Support

This modular structure makes the dashboard much easier to maintain and update. You can now focus on content updates through the simple JSON file rather than editing complex HTML/CSS/JavaScript code.

For any technical issues or questions about the structure, refer to the code comments in each file.
