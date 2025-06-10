# 🔎 Event Hunter 2025

A modern, responsive web application for discovering and tracking global events across multiple industries and continents. Built with pure HTML, CSS, and JavaScript with support for multiple languages and themes.

![Event Hunter 2025](https://img.shields.io/badge/Version-2025-blue.svg)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20AR%20%7C%20FA-green.svg)
![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen.svg)

## ✨ Features

### 🌍 Global Event Coverage
- **200+ Events** across 6 continents for 2025
- **Multiple Industries**: Technology, Healthcare, Finance, Energy, Tourism, Construction, Food, Fashion, Education, Entertainment, Marketing, HR, and Supply Chain
- **Real-time Status**: Automatic classification of upcoming vs completed events
- **External Links**: Direct links to official event websites where available

### 🎨 Modern UI/UX
- **Glass Morphism Design** with smooth animations and transitions
- **Dark/Light Theme** toggle with automatic persistence
- **Responsive Layout** optimized for desktop, tablet, and mobile
- **Smooth Animations** with performance optimizations
- **Professional Typography** using Inter, Cairo, and Vazirmatn fonts

### 🌐 Multi-Language Support
- **English (EN)** - Left-to-right layout
- **Arabic (AR)** - Right-to-left layout with Arabic fonts
- **Persian/Farsi (FA)** - Right-to-left layout with Persian fonts
- **Automatic Layout Direction** switching based on language
- **Complete Translation** of all UI elements and content

### 🔍 Advanced Filtering & Search
- **Text Search**: Search by event name, city, or description
- **Status Filter**: Filter by upcoming or completed events
- **Month Filter**: Filter events by specific months
- **Continent Filter**: Filter by Europe, Americas, Asia-Pacific, Middle East & Central Asia, or Africa
- **Industry Filter**: Filter by specific industry categories
- **Country Filter**: Filter by specific countries
- **Real-time Updates**: All filters work together dynamically

### 📊 Analytics Dashboard
- **Total Events Counter**: Shows total number of events
- **Upcoming Events**: Count of future events
- **Completed Events**: Count of past events
- **Countries Coverage**: Number of countries represented

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation

1. **Clone or Download** the repository:
```bash
git clone [repository-url]
# or download the ZIP file and extract
```

2. **Navigate** to the EH directory:
```bash
cd EH
```

3. **Open** the application:
   - Open `EH.html` in your web browser
   - Or serve it using a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

4. **Access** the application at `http://localhost:8000` (if using a server)

## 📁 Project Structure

```
EH/
├── EH.html          # Main HTML file
├── styles.css       # CSS styles with theme support
├── script.js        # Main application logic
├── data.js          # Event data and mappings
├── translations.js  # Multi-language translations
├── utils.js         # Utility functions
└── README.md        # This file
```

## 🛠️ Technical Details

### Architecture
- **Pure JavaScript**: No frameworks or libraries required
- **Modular Design**: Separated concerns across multiple files
- **Modern CSS**: CSS Grid, Flexbox, CSS Variables, and Glass Morphism
- **Progressive Enhancement**: Works without JavaScript (basic functionality)

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **CSS Features**: CSS Grid, Flexbox, CSS Variables, Backdrop Filter

### Performance Optimizations
- **Lazy Loading**: Images loaded on demand using Intersection Observer
- **Debounced Search**: Prevents excessive filtering during typing
- **Efficient Rendering**: Minimal DOM manipulation and optimized animations
- **Local Storage**: Theme and language preferences cached locally

### Data Structure
Events are stored in a JavaScript array with the following structure:
```javascript
{
    name: "Event Name",
    country: "countryCode",
    countryFlag: "🇺🇸",
    city: "City Name",
    date: "2025-MM-DD",
    endDate: "2025-MM-DD", // Optional
    category: "industry",
    description: "Event description",
    url: "https://event-website.com" // Optional
}
```

## 🎯 Usage

### Basic Navigation
1. **Browse Events**: Scroll through the event cards
2. **Search**: Use the search bar to find specific events
3. **Filter**: Use dropdown filters to narrow down events
4. **View Details**: Click on event cards to visit official websites (when available)

### Customization
1. **Theme**: Click the moon/sun icon to toggle between dark and light themes
2. **Language**: Use the language selector to switch between EN/AR/FA
3. **Filters**: Combine multiple filters for precise event discovery

### Event Status
- **📅 Upcoming**: Events that haven't started yet
- **✅ Completed**: Events that have finished
- **⏰ Countdown**: Days remaining until upcoming events start

## 🔧 Customization

### Adding New Events
Edit `data.js` and add events to the `events` array:
```javascript
{
    name: "New Event 2025",
    country: "usa",
    countryFlag: "🇺🇸",
    city: "New York",
    date: "2025-06-15",
    endDate: "2025-06-17",
    category: "technology",
    description: "Description of the new event",
    url: "https://newevent.com"
}
```

### Adding New Languages
1. Add translations to `translations.js`
2. Update the language selector in `EH.html`
3. Add font support in `styles.css` if needed

### Styling
- Modify CSS variables in `styles.css` for theme customization
- All colors and styles are centralized using CSS custom properties
- Responsive breakpoints can be adjusted in the media queries

## 🌟 Contributing

### Development Guidelines
1. **Code Style**: Follow existing code formatting and structure
2. **Testing**: Test across different browsers and devices
3. **Performance**: Ensure optimizations don't break functionality
4. **Accessibility**: Maintain ARIA labels and keyboard navigation

### Areas for Contribution
- Additional event data for 2025 and beyond
- New language translations
- UI/UX improvements
- Performance optimizations
- Mobile app version
- API integration for real-time event data

## 📱 Mobile Experience

The application is fully responsive and optimized for mobile devices:
- **Touch-friendly**: Large tap targets and smooth scrolling
- **Optimized Layout**: Single-column layout on mobile
- **Fast Loading**: Minimal assets and efficient rendering
- **Offline Capable**: Core functionality works without internet

## 🔒 Privacy & Security

- **No Data Collection**: No user data is collected or transmitted
- **Local Storage Only**: Theme and language preferences stored locally
- **External Links**: Event links open in new tabs with security attributes
- **No Tracking**: No analytics or tracking scripts included

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

For questions, suggestions, or issues:
1. Check existing documentation
2. Review the code comments for implementation details
3. Test in different browsers before reporting issues

## 🎉 Acknowledgments

- **Event Data**: Curated from official sources and industry publications
- **Design Inspiration**: Modern glass morphism and minimalist design principles
- **Multi-language Support**: Native browser internationalization APIs
- **Performance**: Modern web standards and best practices

---

**Built with ❤️ for the global events community**
