# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview
This is a portfolio website showcasing multiple web applications demonstrating data visualization, business intelligence, AI integration, and strategic analysis capabilities. It uses a monorepo structure with npm workspaces.

## Build and Development Commands

### Root Level Commands
```bash
# Install all dependencies for all projects
npm install

# Build all workspace projects
npm run build

# Build specific projects
npm run build:dictator
npm run build:meeting-agent
npm run build:osee
npm run build:country-data
npm run build:deeptube

# Deploy to GitHub Pages
npm run deploy
```

### Individual Project Development
For React/TypeScript projects (osee, meeting-agent, dictator, deeptube, country-data):
```bash
cd [project-name]
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

For HTML/JS projects (companies-data, event-hunter, israel-iran-war):
- Open index.html directly or use a local server
- No build process required

## Architecture Overview

### Monorepo Structure
- Uses npm workspaces defined in root `package.json`
- Each React project has its own dependencies but shares common tooling
- Workspace projects: osee, meeting-agent, dictator, country-data, deeptube, gemini-js-sdk-doc

### Technology Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (for all React projects)
- **UI Libraries**: Material-UI (@mui), custom glass morphism components
- **Data Visualization**: D3.js, Chart.js, Recharts
- **AI Integration**: Google Gemini API (requires API keys)
- **Styling**: CSS Modules, inline styles, responsive design
- **State Management**: React hooks, local state
- **Routing**: React Router (where applicable)

### Design System
- **Theme**: Dark mode with glass morphism effects
- **Colors**: Primary (#64FFDA), dark backgrounds (#000814, #001D3D)
- **Typography**: Inter (English), Cairo (Arabic), Vazirmatn (Persian)
- **Layout**: Responsive grid system, mobile-first approach

### API Integration Patterns
Projects using external APIs follow this pattern:
1. API keys stored in environment variables or prompted from user
2. Async/await for API calls
3. Error handling with user-friendly messages
4. Loading states during data fetching

### Common Development Patterns
- Component-based architecture
- TypeScript for type safety in React projects
- Responsive design with CSS Grid/Flexbox
- Multi-language support (i18n) in some projects
- Progressive enhancement for JavaScript-disabled scenarios

## Project-Specific Notes

### AI-Powered Projects (osee, meeting-agent, dictator, deeptube)
- Require Google Gemini API key
- Handle file uploads, audio recording, or video analysis
- Include real-time processing capabilities

### Data Visualization Projects (country-data, israel-iran-war)
- Heavy use of D3.js and charting libraries
- Responsive charts that adapt to screen size
- Interactive filtering and data exploration

### Static Projects (companies-data, event-hunter)
- Pure HTML/CSS/JavaScript
- No build process required
- Can be served from any static host

## Deployment

### GitHub Pages Setup
- **Configuration**: Automated deployment via npm scripts
- **Base Path**: Configured in vite.config.ts for React projects
- **404 Handling**: 404.html for client-side routing support
- **Build Process**: All React projects build to `dist/` directories
- **Static Assets**: Use relative paths (e.g., `./image.jpg`) for proper GitHub Pages deployment

### Common Deployment Issues
- **Image Loading**: Profile images and assets should use relative paths (`./hatef.jpg`) to work correctly on GitHub Pages
- **JavaScript Errors**: Check for missing DOM elements before referencing them in scripts
- **Path Resolution**: GitHub Pages serves from `/public/` subdirectory, ensure all links are relative

### Environment Variables
```bash
# Individual React projects (.env files)
VITE_GEMINI_API_KEY=your_api_key_here

# Optional customization
VITE_APP_TITLE=Custom_Title
VITE_DATA_SOURCE=custom_data_source
```

### Local Development
```bash
# Serve entire portfolio locally
python -m http.server 8000
# or
npx serve .

# Access at: http://localhost:8000
```

### Production Build
```bash
# Build all React projects
npm run build

# Individual project builds
npm run build:deeptube
npm run build:osee
# ... etc

# Deploy to GitHub Pages
npm run deploy
```

### File Structure After Build
```
public-directory/
├── index.html                 # Main portfolio
├── deeptube/dist/            # Built React app
├── osee/dist/                # Built React app
├── country-data/dist/        # Built React app
├── event-hunter/index.html   # Static app
├── companies-data/index.html # Static app
└── ... other projects
```

## Development Workflow

### Adding New Projects
1. **React/TypeScript Project**:
   ```bash
   # Create new Vite React project
   npm create vite@latest project-name -- --template react-ts
   cd project-name
   
   # Add to workspace in root package.json
   "workspaces": [..., "project-name"]
   
   # Add build script to root package.json
   "build:project-name": "npm run build -w project-name"
   ```

2. **Static HTML Project**:
   - Create directory with index.html
   - Follow existing patterns for styling and structure
   - Add multi-language support if needed

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, semantic HTML
- **Performance**: Optimized builds, lazy loading

### Testing
- **React Projects**: Jest + React Testing Library (where configured)
- **Static Projects**: Manual testing across browsers
- **Mobile Testing**: Responsive design verification
- **Accessibility**: Screen reader and keyboard navigation testing

### Debugging
- **Console Logging**: Check browser console for JavaScript errors
- **Image Loading**: Verify image paths are correct and files exist
- **GitHub Pages**: Test locally first, then check deployed version
- **Path Issues**: Use relative paths (`./`) for assets in the main portfolio page

## Important Instructions
- ALWAYS prefer editing existing files over creating new ones
- Follow established patterns and conventions
- Maintain consistency across all projects
- Test changes across different screen sizes and browsers
- Update CLAUDE.md when adding new projects or changing structure