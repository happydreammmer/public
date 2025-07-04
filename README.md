# GitHub Pages Portfolio

A modern, responsive portfolio website built for GitHub Pages showcasing various data visualization and analysis projects.

## 🚀 Live Site

Visit the live site at: `https://happydreammmer.github.io/public/`

## 📁 Repository Structure

```
repository-root/
├── index.html                 # Main portfolio landing page
├── 404.html                  # Custom 404 error page with redirects
├── README.md                 # This file
├── .nojekyll                 # Disable Jekyll processing
├── .github/
│   └── workflows/
│       └── pages.yml         # GitHub Actions deployment workflow
├── country-data/             # React-based country data visualization
│   ├── src/                  # React source files
│   ├── public/               # Built React application
│   ├── data/                 # CSV data files
│   └── package.json          # Node.js dependencies
├── israel-iran-war/          # Geopolitical analysis dashboard
├── event-hunter/             # Event tracking system
├── companies-data/           # Business intelligence dashboard
├── business-data/            # Business analytics and AI scaling analysis
├── projects/                 # Individual project demonstrations
└── index/                    # Alternative index (if needed)
```

## ✨ Features

### Main Portfolio Page (`index.html`)
- **Modern Design**: Gradient backgrounds with glassmorphism effects
- **Responsive Layout**: Works perfectly on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Featured Projects**: Showcases 6 main projects with descriptions
- **Statistics Section**: Dynamic counters and metrics
- **Clean Navigation**: Streamlined navigation without redundant links

### Project Highlights

#### 1. Israel-Iran War Analysis
- Strategic crisis prediction dashboard
- Interactive charts and real-time data visualization
- Geopolitical trend analysis with predictive modeling

#### 2. Country Data Visualization
- React-based interactive dashboard
- Explores relationships between GDP, population, economic freedom, and political systems
- Covers 194 countries worldwide with advanced data visualization

#### 3. Event Hunter 2025
- Comprehensive event tracking and management system
- Multi-language support and real-time filtering
- Advanced search capabilities for global events

#### 4. Companies Data 2025
- Strategic companies database for UAE & Oman
- Advanced filtering and sector analysis
- Multi-language support for business intelligence

#### 5. AI Scaling Analysis
- Comprehensive analysis of AI evolution and scaling laws (2020-2028)
- Interactive charts and IQ progression metrics
- Future technology performance predictions

#### 6. Business Listings Impact
- Analysis of business listing effectiveness across platforms
- ROI metrics and optimization strategies
- Focus on Google, Apple Maps, and other platforms

### Custom 404 Page (`404.html`)
- **Smart Redirects**: Automatically handles common URL patterns
- **Beautiful Design**: Modern gradient design matching the site theme
- **Search Functionality**: Help users find what they're looking for
- **Debug Information**: Helpful for troubleshooting
- **Suggested Pages**: Quick links to popular sections

## 🛠️ Setup Instructions

### 1. Repository Setup
1. Fork or clone this repository
2. Update the repository name if needed
3. Ensure all files are properly committed

### 2. GitHub Pages Configuration
1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **Branch**: `main` (or `master`)
4. Select **Folder**: `/ (root)`
5. Click **Save**

### 3. Country Data Project Setup
The country-data project requires building the React application:

```bash
cd country-data
npm install
npm run build
cp -r build/* public/
```

This ensures the React-based data visualization works properly.

### 4. Customize Your Content
1. **Update `index.html`**: 
   - Change the portfolio title and description
   - Update project information and links
   - Modify contact information

2. **Update Project Data**:
   - Modify CSV files in `country-data/data/`
   - Update analysis parameters in various projects
   - Customize styling and branding

3. **Add New Projects**:
   - Create new directories for additional projects
   - Follow the established structure and naming conventions
   - Update the main index.html to include new projects

## 🔧 Customization Guide

### Colors and Styling
The site uses CSS custom properties for easy theming. Main colors:
- Primary gradient: `#667eea` to `#764ba2`
- Text colors: Various shades of gray for hierarchy
- Background effects: Semi-transparent overlays with backdrop blur

### Adding New Projects
1. Create a new directory: `your-project-name/`
2. Add an `index.html` file with proper navigation
3. Update the main `index.html` to include your project card
4. Ensure all links are properly formatted

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Visualization**: D3.js, Chart.js
- **UI Framework**: React (for country-data project)
- **Build Tools**: npm, react-scripts
- **Hosting**: GitHub Pages

## 🐛 Troubleshooting

### Common Issues
1. **Country Data not loading**: 
   - Ensure the React app is built (`npm run build`)
   - Check that files are copied to the `public/` directory
   - Verify data files are in the correct location

2. **404 Errors**: 
   - Check file paths and ensure proper case sensitivity
   - Verify GitHub Pages settings
   - Ensure all directories have proper index files

3. **Build Issues**:
   - Check the **Actions** tab for deployment logs
   - Verify all dependencies are installed
   - Ensure package.json files are properly configured

### Performance Optimization
1. **React App**: Already optimized with production builds
2. **Images**: Optimize images and use appropriate formats
3. **CSS**: Minimize unused styles
4. **JavaScript**: Use efficient algorithms for data processing

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Features

- **Glassmorphism**: Modern transparent elements with blur effects
- **Smooth Animations**: CSS transitions and transforms
- **Responsive Grid**: CSS Grid and Flexbox for layouts
- **Modern Typography**: System font stack for performance
- **Accessibility**: Keyboard navigation and screen reader support
- **Single-button Actions**: Streamlined UX with one primary action per card

## 📊 Project Statistics

- **Total Projects**: 12+ completed projects
- **Technologies**: 25+ different technologies used
- **Data Sources**: Multiple CSV files and APIs
- **Languages**: Multi-language support in several projects

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this repository and customize it for your own portfolio! If you make improvements, consider submitting a pull request.

## 📞 Support

If you encounter issues:
1. Check GitHub Pages documentation
2. Review browser console for JavaScript errors
3. Verify all file paths and links
4. For React-related issues, check the build process

## 🔗 Links

- **Live Site**: https://happydreammmer.github.io/public/
- **Repository**: https://github.com/happydreammmer/public
- **GitHub Pages**: Built and deployed automatically

---

**Updated January 2025** 🎉