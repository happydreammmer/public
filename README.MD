# 🌐 Public Directory - Portfolio Showcase

A comprehensive collection of interactive web applications showcasing data visualization, business intelligence, event discovery, and strategic analysis platforms. Built with modern web technologies including React, D3.js, and responsive design principles.

![Portfolio](https://img.shields.io/badge/Portfolio-2025-blue.svg)
![Technologies](https://img.shields.io/badge/Tech-React%20%7C%20D3.js%20%7C%20JavaScript-brightgreen.svg) 
![Mobile](https://img.shields.io/badge/Mobile-Optimized-green.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-purple.svg)

## 🚀 Live Demo

**🔗 Main Portfolio**: [View Portfolio](./index/)

Access all applications through the main portfolio dashboard with beautiful animations, theme switching, and mobile-optimized navigation.

## 📱 Applications Overview

### 🔎 [Event Hunter 2025](./event-hunter/events-listing/)
**Global Events Discovery Platform**
- **200+ Events** across 6 continents for 2025
- **Multi-Industry Coverage**: Technology, Healthcare, Finance, Energy, Tourism
- **Multi-Language Support**: English, Arabic, Persian/Farsi with RTL support
- **Advanced Filtering**: Search by industry, country, date, and status

### 🏢 [Companies Data - UAE & Oman](./companies-data/companies-listing/)
**B2B Sales Intelligence Platform**
- **80+ Strategic Companies** across UAE & Oman
- **15+ Key Sectors** including finance, energy, telecommunications
- **AI Opportunities Mapping** for each company
- **Interactive Search & Filtering** by sector, location, size, priority

### 🌍 [Country Data Visualization](./country-data/political-system/)
**Interactive Data Dashboard**
- **Interactive Scatter Plot** with D3.js visualization
- **Multi-dimensional Analysis**: GDP, population, economic freedom, political systems
- **React-Powered** with Material-UI components
- **Real-time Filtering** and dynamic search capabilities

### 🎯 [Iran-Israel Crisis Dashboard](./israel-iran-war/prediction/) **[NEW]**
**Strategic Analysis & Game Theory Assessment**
- **Interactive Poll System** with persistent data storage
- **Multi-Language Support**: English, Arabic, Persian with strategic translations
- **Game Theory Framework**: Chicken Game dynamics analysis
- **Real-time Probability Calculator** with dynamic risk assessment
- **Strategic Timeline** with critical decision points

## 🛠️ Implementation Action Plan

### Phase 1: Integration & Structure
1. **Portfolio Integration**
   - Add 4th project card to `index/index.html` with crisis-themed styling
   - Update stats section (4 Active Projects)
   - Add crisis dashboard project description and features

2. **File Organization**
   - Reorganize `israel-iran-war/` directory structure
   - Create dedicated CSS, JS, and data files
   - Implement modular architecture

### Phase 2: Persistent Poll Data System
**Challenge**: Static GitHub Pages doesn't support server-side storage

**Solution**: Hybrid Approach
1. **localStorage**: Immediate persistence per browser
2. **Export/Import**: JSON data backup functionality
3. **GitHub Integration**: Optional community data aggregation

**Implementation**:
```javascript
// Data persistence architecture
const PollDataManager = {
    save: (data) => localStorage.setItem('crisis-poll-data', JSON.stringify(data)),
    load: () => JSON.parse(localStorage.getItem('crisis-poll-data') || '{}'),
    export: () => downloadJSON(data),
    import: (file) => loadJSONFile(file)
}
```

### Phase 3: Multi-Language System
**Languages**: English (EN), Arabic (AR), Persian/Farsi (FA)

**Implementation Strategy**:
1. **Language Selector**: Fixed dropdown in upper-left corner
2. **Translation Object**: Centralized translations with simple language
3. **RTL Support**: Arabic and Persian right-to-left layout
4. **Cultural Adaptation**: Appropriate terminology for each language

```javascript
const translations = {
    en: { /* English */ },
    ar: { /* Arabic - Simple */ },
    fa: { /* Persian - Simple */ }
}
```

### Phase 4: Enhanced Features
1. **Real-time Updates**: Dynamic probability recalculation
2. **Data Visualization**: Enhanced charts with Chart.js
3. **Mobile Optimization**: Touch-friendly interactions
4. **Accessibility**: Screen reader support and keyboard navigation

## 🏗️ Project Structure

```
public-directory/
├── 📄 index/index.html                    # Main portfolio dashboard (UPDATE)
├── 📄 README.MD                      # This file (UPDATED)
├── 🎯 israel-iran-war/               # Crisis analysis dashboard (NEW)
│   ├── 📄 index.html                # Main dashboard page
│   ├── 📊 data/
│   │   ├── poll-data.json           # Persistent poll results
│   │   └── translations.js          # Multi-language support
│   ├── 🎨 assets/
│   │   ├── styles.css               # Crisis-themed styling
│   │   └── crisis-theme.css         # Strategic analysis theme
│   ├── ⚙️ js/
│   │   ├── poll-manager.js          # Poll data persistence
│   │   ├── language-manager.js      # Multi-language system
│   │   ├── chart-manager.js         # Dynamic probability charts
│   │   └── game-theory.js           # Strategic analysis logic
│   └── 📖 README.md                 # Crisis dashboard docs
├── 🔎 event-hunter/                 # (Existing)
├── 🏢 companies-data/               # (Existing)
└── 🌍 country-data/                 # (Existing)
```

## 🎯 Technical Implementation Plan

### Data Persistence Strategy
1. **Local Storage**: Browser-based persistence
2. **Export Feature**: Download poll data as JSON
3. **Import Feature**: Upload and restore poll data
4. **Data Validation**: Ensure data integrity across sessions

### Multi-Language Architecture
1. **Language Detection**: Browser language preference
2. **Dynamic Content**: Real-time language switching
3. **RTL Layout**: CSS-based directional support
4. **Font Loading**: Arabic (Cairo) and Persian (Vazirmatn) fonts

### Deployment Considerations
- **GitHub Actions**: Automated deployment pipeline
- **Data Files**: Poll data committed to repository
- **Version Control**: Track poll data changes over time
- **Backup Strategy**: Multiple data persistence layers

## 🚀 Quick Start

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd public-directory

# Install dependencies (for React apps)
cd country-data && npm install && cd ..

# Start local development server
python -m http.server 8000
# Navigate to: http://localhost:8000/index/index.html
```

### Crisis Dashboard Standalone
```bash
# Direct access to crisis dashboard
open israel-iran-war/prediction/index.html
# or via local server: http://localhost:8000/israel-iran-war/prediction/
```

## 📱 Mobile Experience

### iPhone Optimizations
- **Safe Area Support** - Proper handling of notches and home indicators
- **Touch Targets** - 44px minimum following Apple guidelines  
- **No Zoom Issues** - Prevents unwanted zoom on input focus
- **Native Scrolling** - Smooth momentum scrolling on iOS
- **Orientation Support** - Seamless portrait/landscape transitions

### Android Enhancements
- **Material Design** - Following Android design principles
- **Chrome Features** - PWA installation and offline support
- **Performance** - Optimized animations and interactions
- **Accessibility** - TalkBack and screen reader support

## 🎯 Key Features

### 🔍 Advanced Search & Filtering
- **Real-time Search** across all applications
- **Multi-dimensional Filtering** by various criteria
- **Debounced Input** for optimal performance
- **Visual Feedback** for user interactions

### 🎨 Modern Design System
- **Glass Morphism** effects throughout
- **Consistent Color Palette** across applications
- **Typography Hierarchy** with Inter, Cairo, and Vazirmatn fonts
- **Responsive Grid** system with mobile-first approach

### 🌐 Internationalization
- **Multi-language Support** (EN/AR/FA)
- **RTL Layout** for Arabic and Persian
- **Locale-aware Formatting** for dates and numbers
- **Cultural Adaptations** in design and UX

### ♿ Accessibility
- **Screen Reader Support** with ARIA labels
- **Keyboard Navigation** throughout applications
- **High Contrast Mode** compatibility
- **Reduced Motion** respect for user preferences

## 📊 Data & Analytics

### Event Hunter
- **200+ Global Events** for 2025
- **50+ Countries** represented
- **12 Industry Categories** covered
- **Real-time Status** tracking

### Companies Data
- **80+ Companies** in UAE & Oman
- **15+ Business Sectors** analyzed
- **AI Opportunities** mapped for each company
- **Contact Intelligence** aggregated

### Country Data
- **195+ Countries** visualized
- **4 Key Metrics** compared (GDP, Population, Economic Freedom, Political Systems)
- **Interactive Correlations** explored
- **Real-time Filtering** capabilities

## 🚀 Deployment Options

### GitHub Pages (Recommended)
```yaml
# Automatic deployment via GitHub Actions
# Site URL: https://yourusername.github.io/public-directory/
```

### Static Hosting
- **Netlify**: Drag & drop deployment
- **Vercel**: Git-based deployment
- **Surge.sh**: Command-line deployment
- **Firebase Hosting**: Google Cloud deployment

### Custom Server
```bash
# Using Nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/public-directory;
    index index/index.html;
}
```

## 🔧 Configuration

### Environment Variables
```env
# Optional customization
REACT_APP_TITLE=Country Data Visualization
REACT_APP_DATA_SOURCE=public/data/final_country_data.csv
```

### Jekyll Configuration
The project includes `_config.yml` for GitHub Pages deployment with:
- Automatic exclusion of node_modules
- Relative links support
- Markdown processing with Kramdown

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow mobile-first responsive design
- Maintain accessibility standards (WCAG 2.1)
- Use semantic HTML and proper ARIA labels
- Test across multiple browsers and devices
- Optimize for performance and loading speed

## 📄 License

This project is for educational and portfolio purposes. Individual data sources and company information are publicly available and compiled for demonstration.

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please refer to individual application documentation or create an issue in this repository.

---

## 🏆 Project Highlights

- **🎯 Business Intelligence**: Comprehensive company and event data
- **📊 Data Visualization**: Interactive charts and analytics
- **🌍 Global Scope**: International events and multi-country data
- **📱 Mobile Excellence**: Optimized for all devices and screen sizes
- **♿ Accessibility First**: Inclusive design for all users
- **🚀 Performance**: Fast loading and smooth interactions
- **🎨 Modern Design**: Glass morphism and contemporary UI/UX

**Built with ❤️ using modern web technologies**
