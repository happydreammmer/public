# 🌍 Interactive Country Data Visualization

An interactive data visualization dashboard that explores relationships between GDP per capita, population, economic freedom, and political systems across countries worldwide. Built with React, D3.js, and Material-UI.

![Country Data Visualization](https://img.shields.io/badge/React-19.1.0-blue) ![D3.js](https://img.shields.io/badge/D3.js-7.9.0-orange) ![Material--UI](https://img.shields.io/badge/Material--UI-6.4.12-blue)

## 📊 Live Demo

Experience the interactive visualization: [View Demo](http://localhost:3000)

## ✨ Features

### 🎯 Interactive Visualization
- **Scatter Plot Analysis**: Explore country data through an interactive scatter plot
- **Multi-dimensional Data**: Visualize GDP per capita, population size, economic freedom, and political systems
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Filtering**: Dynamic search and filter capabilities

### 🎨 Visual Elements
- **Circle Size**: Represents population (larger circles = larger population)
- **X-Axis**: Economic Freedom Index (0-100 scale)
- **Y-Axis**: GDP per capita in USD
- **Colors**: Different political systems and governance types
- **Legends**: Interactive legends with hover effects

### 🛠️ Interactive Controls
- **Search Functionality**: Search countries by name
- **Political System Filter**: Filter by governance type
- **GDP Range Slider**: Set minimum and maximum GDP per capita range
- **Responsive Legends**: Desktop legends with mobile-friendly chip display

### 📱 Mobile Optimization
- **Collapsible Filters**: Accordion-style filter panel for mobile
- **Touch-Friendly**: Optimized for touch interactions
- **Responsive Charts**: Automatically adjusts chart dimensions
- **Mobile Legends**: Chip-based legend display for smaller screens

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd country-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

## 🎮 Usage Guide

### Navigation
1. **Statistics Cards**: View high-level statistics at the top
2. **Filter Panel**: Use interactive filters to explore specific data
3. **Visualization**: Hover over circles for detailed country information
4. **Legend**: Use legends to understand color coding and size scaling

### Filtering Data
- **Search**: Type country names in the search box
- **Political Systems**: Select specific governance types from dropdown
- **GDP Range**: Use slider to set GDP per capita range

### Understanding the Visualization
- **Position**: Higher and further right = wealthier and more economically free
- **Size**: Larger circles represent countries with bigger populations
- **Color**: Each color represents a different political system
- **Hover**: Get detailed information about any country

## 🏗️ Project Structure

```
country-data/
├── public/
│   ├── data/
│   │   └── final_country_data.csv      # Country dataset
│   └── index.html                      # HTML template
├── src/
│   ├── components/
│   │   ├── CountryVisualization.js     # Main visualization component
│   │   ├── FilterPanel.js              # Interactive filters
│   │   ├── LoadingSpinner.js           # Loading state component
│   │   └── ErrorBoundary.js            # Error handling
│   ├── App.js                          # Main application component
│   └── index.js                        # Application entry point
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.1.0**: Modern React with latest features
- **React DOM**: DOM manipulation for React

### Data Visualization
- **D3.js 7.9.0**: Powerful data visualization library
- **SVG**: Scalable vector graphics for charts

### UI Framework
- **Material-UI 6.4.12**: Modern React component library
- **Emotion**: CSS-in-JS styling solution
- **Material Icons**: Comprehensive icon set

### Build Tools
- **React Scripts 5.0.1**: Create React App build configuration
- **Webpack**: Module bundler (via React Scripts)
- **Babel**: JavaScript compiler (via React Scripts)

## 📊 Data Schema

The visualization uses a CSV dataset with the following structure:

| Field | Description | Type |
|-------|-------------|------|
| `country` | Country name | String |
| `gdp_per_capita` | GDP per capita in USD | Number |
| `population` | Total population | Number |
| `economic_freedom` | Economic Freedom Index (0-100) | Number |
| `political_system` | Type of governance | String |

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (Interactive elements)
- **Success Green**: #16a34a (Positive metrics)
- **Warning Orange**: #f59e0b (Neutral metrics)
- **Political Systems**: Colorblind-friendly palette with 15 distinct colors

### Typography
- **Font Family**: Inter (Primary), with system fallbacks
- **Headings**: Weight 600-700, various sizes
- **Body Text**: Weight 400-500, optimized for readability

### Spacing & Layout
- **Grid System**: 12-column responsive grid
- **Breakpoints**: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)
- **Padding/Margins**: 8px base unit with multipliers

## 📱 Responsive Breakpoints

| Device | Breakpoint | Layout Changes |
|--------|------------|----------------|
| Mobile | < 600px | Stacked layout, collapsible filters, mobile legends |
| Tablet | 600px - 900px | 2-column layout, compact filters |
| Desktop | > 900px | Full layout with side legends, expanded filters |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_DATA_SOURCE=public/data/final_country_data.csv
REACT_APP_TITLE=Country Data Visualization
```

### Customization Options
- **Default Opacity**: Set in `CountryVisualization.js` (currently 85%)
- **Color Scheme**: Modify color arrays in visualization component
- **Chart Dimensions**: Adjust responsive sizing logic
- **Filter Options**: Add new filter types in `FilterPanel.js`

## 🧪 Development

### Available Scripts

```bash
# Development server
npm start

# Production build
npm run build

# Test the application
npm test

# Eject from Create React App (⚠️ irreversible)
npm run eject
```

### Development Guidelines
1. **Component Structure**: Keep components focused and reusable
2. **State Management**: Use React hooks for local state
3. **Performance**: Implement proper memoization for expensive operations
4. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
5. **Error Handling**: Wrap components with error boundaries

## 🐛 Troubleshooting

### Common Issues

**Application won't start**
- Ensure Node.js v14+ is installed
- Delete `node_modules` and run `npm install`
- Check for port conflicts (default: 3000)

**Data not loading**
- Verify CSV file exists in `public/data/`
- Check browser network tab for failed requests
- Ensure file path matches in code

**Chart not rendering**
- Check console for D3.js errors
- Verify data format matches expected schema
- Ensure container has proper dimensions

## 📈 Performance Optimization

### Implemented Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoizes event handlers
- **D3 Transitions**: Smooth animations without blocking UI
- **Responsive Loading**: Progressive enhancement for mobile

### Monitoring
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Performance Metrics**: Monitor via browser DevTools
- **Memory Usage**: Check for memory leaks in long-running sessions

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to your fork: `git push origin feature-name`
6. Create a Pull Request

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React best practices and hooks patterns
- Write descriptive component and variable names
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Data Sources**: World Bank, Heritage Foundation, Freedom House
- **D3.js Community**: For comprehensive visualization examples
- **Material-UI Team**: For excellent React component library
- **React Team**: For the amazing framework

## 📞 Support

For questions, issues, or feature requests:
1. Check existing [Issues](../../issues)
2. Create a new issue with detailed description
3. Include browser version and reproduction steps

---

**Built with ❤️ using React, D3.js, and Material-UI**
