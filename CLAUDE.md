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
- Workspace projects: osee, meeting-agent, dictator, country-data, deeptube

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
- Configured for GitHub Pages deployment
- Base path configuration in vite.config.ts for React projects
- 404.html for client-side routing support