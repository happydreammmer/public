# 🔎 Event Hunter 2025

A modern, responsive web application for discovering and tracking global events across multiple industries and continents. Built with pure HTML, CSS, and JavaScript with support for multiple languages and themes. **Now fully optimized for iPhone and mobile devices!**

![Event Hunter 2025](https://img.shields.io/badge/Version-2025-blue.svg)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20AR%20%7C%20FA-green.svg)
![Mobile Optimized](https://img.shields.io/badge/iPhone-Optimized-brightgreen.svg)
![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen.svg)

## ✨ Features

### 🌍 Global Event Coverage
- **200+ Events** across 6 continents for 2025
- **Multiple Industries**: Technology, Healthcare, Finance, Energy, Tourism, Construction, Food, Fashion, Education, Entertainment, Marketing, HR, and Supply Chain
- **Real-time Status**: Automatic classification of upcoming vs completed events
- **External Links**: Direct links to official event websites where available
- **Global Reach**: Events from 50+ countries worldwide

### 📱 iPhone & Mobile Optimized
- **iOS Safe Area Support**: Proper handling of iPhone notch and home indicator
- **Touch-Optimized**: 44px minimum touch targets following Apple's guidelines
- **No Zoom Issues**: Prevents unwanted zoom when focusing on inputs
- **Native Feel**: Smooth scrolling with iOS momentum and proper tap highlights
- **Cross-Browser Dates**: Reliable date handling that works perfectly on Safari/iOS
- **Performance Optimized**: Reduced backdrop filters and optimized animations for mobile
- **Orientation Support**: Seamless portrait/landscape transitions

### 🎨 Modern UI/UX
- **Glass Morphism Design** with smooth animations and transitions
- **Dark/Light Theme** toggle with automatic persistence
- **Responsive Layout** optimized for desktop, tablet, and mobile
- **Smooth Animations** with performance optimizations
- **Professional Typography** using Inter, Cairo, and Vazirmatn fonts
- **Accessibility First**: Respects user's motion preferences and provides proper ARIA labels

### 🌐 Multi-Language Support
- **English (EN)** - Left-to-right layout
- **Arabic (AR)** - Right-to-left layout with Cairo font
- **Persian/Farsi (FA)** - Right-to-left layout with Vazirmatn font
- **Automatic Layout Direction** switching based on language
- **Complete Translation** of all UI elements and content
- **Locale-Aware Date Formatting** for each language

### 🔍 Advanced Filtering & Search
- **Text Search**: Search by event name, city, or description
- **Status Filter**: Filter by upcoming or completed events
- **Month Filter**: Filter events by specific months
- **Continent Filter**: Filter by Europe, Americas, Asia-Pacific, Middle East & Central Asia, or Africa
- **Industry Filter**: Filter by specific industry categories
- **Country Filter**: Filter by specific countries
- **Real-time Updates**: All filters work together dynamically
- **Debounced Search**: Optimized search performance

### 📊 Analytics Dashboard
- **Total Events Counter**: Shows total number of events with animated counting
- **Upcoming Events**: Count of future events
- **Completed Events**: Count of past events
- **Countries Coverage**: Number of countries represented
- **Interactive Counters**: Hover effects and smooth animations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- **iPhone/iOS**: Safari 13+ or any modern mobile browser
- No additional software or dependencies required

### Installation

1. **Clone or Download** the repository:
```bash
git clone [repository-url]
# or download the ZIP file and extract
```

2. **Navigate** to the Eventhunter directory:
```bash
cd Eventhunter
```

3. **Open** the application:
   - Open `events-listing/index.html` in your web browser
   - Or serve it using a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

4. **Access** the application at `http://localhost:8000/events-listing/index.html` (if using a server)

### Quick Test on iPhone
1. Open Safari on your iPhone
2. Navigate to the local server URL or deployed site
3. Test touch interactions, theme switching, and search functionality
4. Try rotating your device to test orientation changes

## 📁 Project Structure

```
Eventhunter/
├── events-listing/index.html      # Main HTML file with iOS optimizations
├── styles.css       # CSS styles with mobile-first design
├── script.js        # Main application logic with mobile enhancements
├── data.js          # Event data and mappings
├── translations.js  # Multi-language translations
├── utils.js         # Utility functions with safe date handling
├── .nojekyll        # Prevents Jekyll processing
└── README.md        # This file
```

## 🛠️ Technical Details

### Architecture
- **Pure JavaScript**: No frameworks or libraries required
- **Modular Design**: Separated concerns across multiple files
- **Modern CSS**: CSS Grid, Flexbox, CSS Variables, and Glass Morphism
- **Progressive Enhancement**: Works without JavaScript (basic functionality)
- **Mobile-First**: Designed and optimized for mobile devices first

### Browser Support
- **Desktop**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+, Samsung Internet 12+
- **iPhone**: All modern iPhone models (iPhone 6S+)
- **CSS Features**: CSS Grid, Flexbox, CSS Variables, Backdrop Filter, Safe Area Support

### Performance Optimizations
- **Lazy Loading**: Images loaded on demand using Intersection Observer
- **Debounced Search**: Prevents excessive filtering during typing
- **Efficient Rendering**: Minimal DOM manipulation and optimized animations
- **Local Storage**: Theme and language preferences cached locally
- **Mobile Performance**: Reduced blur effects and optimized animations for mobile
- **Passive Touch Listeners**: Better scrolling performance on touch devices

### iOS-Specific Enhancements
- **Safe Date Parsing**: Custom date functions that work reliably across all browsers
- **Touch Target Optimization**: All interactive elements meet Apple's 44px minimum
- **Zoom Prevention**: Input elements sized to prevent unwanted zoom on focus
- **Safe Area Support**: Proper handling of iPhone notch and home indicator areas
- **Orientation Handling**: Smooth transitions between portrait and landscape modes

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
1. **Browse Events**: Scroll through the event cards with smooth touch scrolling
2. **Search**: Use the search bar to find specific events (no zoom on iPhone!)
3. **Filter**: Use dropdown filters to narrow down events
4. **View Details**: Tap on event cards to visit official websites (when available)
5. **Theme Toggle**: Tap the moon/sun icon to switch themes
6. **Language Switch**: Use the language selector for EN/AR/FA

### Mobile-Specific Features
1. **Touch Feedback**: All interactions provide visual feedback
2. **Swipe Scrolling**: Smooth momentum scrolling on iOS
3. **Rotation Support**: Layout adapts automatically to device orientation
4. **Safe Areas**: Content respects iPhone notch and home indicator

### Event Status
- **📅 Upcoming**: Events that haven't started yet with countdown
- **✅ Completed**: Events that have finished
- **⏰ Countdown**: Days remaining until upcoming events start
- **💰 Investment**: Special highlighting for investment-related events

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
2. Update the language selector in `events-listing/index.html`
3. Add font support in `styles.css` if needed
4. Test RTL layout for right-to-left languages

### Styling
- Modify CSS variables in `styles.css` for theme customization
- All colors and styles are centralized using CSS custom properties
- Responsive breakpoints: 1200px, 768px, 480px
- Mobile-first approach with progressive enhancement

## 🐛 Bug Fixes & Improvements

### Fixed Issues
- ✅ **iOS Date Parsing**: Fixed Safari date parsing issues with custom `createSafeDate()` function
- ✅ **Touch Targets**: Increased all interactive elements to 44px minimum
- ✅ **Mobile Grid**: Optimized event card grid for mobile screens (320px minimum)
- ✅ **Zoom Prevention**: Prevents unwanted zoom on input focus in iOS Safari
- ✅ **Performance**: Optimized animations and reduced backdrop blur for mobile
- ✅ **Safe Areas**: Added support for iPhone notch and home indicator
- ✅ **Error Handling**: Enhanced error handling with try-catch blocks
- ✅ **Motion Preferences**: Respects user's reduced motion preferences

### Recent Enhancements
- 🆕 **Mobile Optimizations**: Complete mobile-first redesign
- 🆕 **iOS Enhancements**: Native iOS feel with proper touch handling
- 🆕 **Performance Boost**: Optimized for 60fps on mobile devices
- 🆕 **Accessibility**: Improved ARIA labels and keyboard navigation
- 🆕 **Error Recovery**: Better error handling and fallback mechanisms

## 🌟 Contributing

### Development Guidelines
1. **Mobile First**: Always test on mobile devices first
2. **Cross-Browser**: Test on Safari, Chrome, and Firefox (especially mobile versions)
3. **Performance**: Maintain 60fps on mobile devices
4. **Accessibility**: Follow WCAG guidelines and test with screen readers
5. **iPhone Testing**: Test on actual iPhone devices when possible

### Testing Checklist
- [ ] Touch interactions work smoothly
- [ ] No unwanted zoom on input focus
- [ ] Theme switching works properly
- [ ] Date display is correct across browsers
- [ ] Search and filters function properly
- [ ] Rotation handling works smoothly
- [ ] Safe area content is properly positioned

### Areas for Contribution
- Additional event data for 2025 and beyond
- New language translations
- Mobile UX improvements
- Performance optimizations
- Accessibility enhancements
- PWA features (offline support, install prompt)

## 📱 Mobile Experience

The application is fully optimized for mobile devices with special attention to iPhone:

### iPhone Optimizations
- **Safe Area Support**: Respects iPhone X+ notch and home indicator
- **Native Scrolling**: Uses `-webkit-overflow-scrolling: touch` for momentum
- **Touch Targets**: All buttons and interactive elements are 44px+ (Apple's guideline)
- **No Zoom Issues**: Input fields sized to prevent unwanted zoom
- **Proper Blur**: Optimized backdrop filters for better performance
- **Orientation Handling**: Smooth transitions between portrait/landscape

### Android Optimizations
- **Material Design Touch**: Proper ripple effects and touch feedback
- **Performance**: Optimized for lower-end Android devices
- **Browser Compatibility**: Works across all major Android browsers

### General Mobile Features
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Responsive Grid**: Single-column layout on small screens
- **Fast Loading**: Minimal assets and efficient rendering
- **Offline Resilient**: Core functionality works without internet

## 🔒 Privacy & Security

- **No Data Collection**: No user data is collected or transmitted
- **Local Storage Only**: Theme and language preferences stored locally
- **External Links**: Event links open in new tabs with security attributes
- **No Tracking**: No analytics or tracking scripts included
- **Secure Headers**: Proper CSP and security headers when served

## 🚀 Deployment

### GitHub Pages
This project is configured for GitHub Pages deployment:
- `_config.yml` excludes problematic directories
- `.nojekyll` file prevents Jekyll processing of the app
- Works directly from the main branch

### Local Development
```bash
# Clone the repository
git clone [repository-url]
cd Eventhunter

# Start local server
python -m http.server 8080

# Open browser to
http://localhost:8080/events-listing/index.html
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

For questions, suggestions, or issues:
1. Check this documentation first
2. Test on multiple browsers and devices
3. Review the code comments for implementation details
4. Check the browser console for any error messages

### Common Issues & Solutions
- **Dates not showing properly**: Ensure you're using YYYY-MM-DD format
- **Layout issues on iPhone**: Check that you're testing on a real device
- **Performance problems**: Check if backdrop-filter is supported
- **Search not working**: Verify JavaScript is enabled

## 🎉 Acknowledgments

- **Event Data**: Curated from official sources and industry publications
- **Design Inspiration**: Modern glass morphism and Apple's Human Interface Guidelines
- **Multi-language Support**: Native browser internationalization APIs
- **Performance**: Modern web standards and mobile-first best practices
- **iOS Optimization**: Apple's iOS Safari development guidelines
- **Accessibility**: WCAG 2.1 guidelines and best practices

---

**Built with ❤️ for the global events community - Now optimized for iPhone users worldwide! 📱✨**
