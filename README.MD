# 🌐 Public Directory - Portfolio Showcase

A comprehensive collection of interactive web applications showcasing data visualization, business intelligence, and event discovery platforms. Built with modern web technologies including React, D3.js, and responsive design principles.

![Portfolio](https://img.shields.io/badge/Portfolio-2025-blue.svg)
![Technologies](https://img.shields.io/badge/Tech-React%20%7C%20D3.js%20%7C%20JavaScript-brightgreen.svg) 
![Mobile](https://img.shields.io/badge/Mobile-Optimized-green.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-purple.svg)

## 🚀 Live Demo

**🔗 Main Portfolio**: [View Portfolio](./public.html)

Access all applications through the main portfolio dashboard with beautiful animations, theme switching, and mobile-optimized navigation.

## 📱 Applications Overview

### 🔎 [Event Hunter 2025](./event-hunter/)
**Global Events Discovery Platform**

- **200+ Events** across 6 continents for 2025
- **Multi-Industry Coverage**: Technology, Healthcare, Finance, Energy, Tourism, and more
- **Mobile-Optimized** with iPhone-specific enhancements
- **Multi-Language Support**: English, Arabic, Persian/Farsi with RTL support
- **Advanced Filtering**: Search by industry, country, date, and status
- **Real-time Analytics**: Live event counters and status tracking

**Tech Stack**: Pure JavaScript, CSS3, HTML5, Glass Morphism Design
**Features**: PWA-ready, offline support, touch-optimized

### 🏢 [Companies Data - UAE & Oman](./companies-data/)
**B2B Sales Intelligence Platform**

- **80+ Strategic Companies** across UAE & Oman
- **15+ Key Sectors** including finance, energy, telecommunications
- **AI Opportunities Mapping** for each company
- **Interactive Search & Filtering** by sector, location, size, priority
- **Contact Intelligence** including websites and social media
- **GitHub Pages Ready** static deployment

**Tech Stack**: JavaScript, CSS Variables, Modular Architecture
**Features**: Responsive design, real-time statistics, SEO optimized

### 🌍 [Country Data Visualization](./country-data/)
**Interactive Data Dashboard**

- **Interactive Scatter Plot** with D3.js visualization
- **Multi-dimensional Analysis**: GDP, population, economic freedom, political systems
- **React-Powered** with Material-UI components
- **Mobile-First Design** with touch interactions
- **Real-time Filtering** and dynamic search capabilities
- **Accessibility Features** with screen reader support

**Tech Stack**: React 19.1.0, D3.js 7.9.0, Material-UI 6.4.12
**Features**: PWA-ready, responsive charts, colorblind-friendly palette

## 🛠️ Tech Stack

### Frontend Technologies
- **React 19.1.0** - Modern React with hooks and performance optimizations
- **D3.js 7.9.0** - Powerful data visualization library
- **Material-UI 6.4.12** - React component library
- **Pure JavaScript** - Vanilla JS for lightweight applications
- **CSS3** - Modern styling with Grid, Flexbox, and CSS Variables
- **HTML5** - Semantic markup with accessibility features

### Build & Deployment
- **GitHub Pages** - Static site hosting with Jekyll
- **Webpack** - Module bundling and optimization
- **Babel** - JavaScript compilation
- **Progressive Web App** - PWA capabilities across applications

### Design & UX
- **Glass Morphism** - Modern design language
- **Dark/Light Themes** - User preference support
- **Mobile-First** - Responsive design approach
- **Multi-Language** - RTL support for Arabic and Persian
- **Accessibility** - WCAG compliant features

## 🏗️ Project Structure

```
public-directory/
├── 📄 public.html                    # Main portfolio dashboard
├── 📄 README.MD                      # This file
├── ⚙️ _config.yml                    # Jekyll configuration
├── 🔎 event-hunter/
│   ├── 📄 events.html               # Event discovery app
│   ├── 📊 data.js                   # 200+ global events
│   ├── 🎨 styles.css                # Mobile-optimized styles
│   ├── ⚙️ script.js                 # App logic & filters
│   ├── 🌐 translations.js           # Multi-language support
│   └── 📖 README.md                 # Event Hunter docs
├── 🏢 companies-data/
│   ├── 📄 Companies.html            # B2B intelligence app
│   ├── 📊 data.js                   # UAE & Oman companies
│   ├── 🎨 styles.css                # Professional styling
│   ├── ⚙️ script.js                 # Search & filter logic
│   ├── 🛠️ utils.js                  # Utility functions
│   └── 📖 README.md                 # Companies Data docs
└── 🌍 country-data/
    ├── 📦 package.json              # React dependencies
    ├── 🏗️ src/
    │   ├── 📄 App.js                # Main React app
    │   └── 🧩 components/
    │       ├── CountryVisualization.js  # D3.js charts
    │       ├── FilterPanel.js           # Interactive filters
    │       └── LoadingSpinner.js        # Loading states
    ├── 🌐 public/
    │   ├── 📄 index.html            # React entry point
    │   └── 📊 data/                 # Country datasets
    ├── 🚀 build/                    # Production build
    └── 📖 README.md                 # Country Data docs
```

## 🚀 Quick Start

### Option 1: Direct Access (Recommended)
1. **Open** `public.html` in your browser
2. **Navigate** through the portfolio dashboard
3. **Launch** any application with one click

### Option 2: Individual Applications
1. **Event Hunter**: Open `event-hunter/events.html`
2. **Companies Data**: Open `companies-data/Companies.html`
3. **Country Data**: Open `country-data/public/index.html`

### Option 3: Development Setup
```bash
# Clone repository
git clone <repository-url>
cd public-directory

# For React app (Country Data)
cd country-data
npm install
npm start

# For static apps, use any local server
python -m http.server 8000
# or
npx http-server
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
    index public.html;
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
