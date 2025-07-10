### Project Integration and Deployment Plan

#### 1. API Key Integration & UI/UX Enhancements (One project at a time)
- **Project: `deeptube`**
  - [x] Identify the service file for Gemini API calls.
  - [x] Implement an API key input field for the user.
  - [x] Store the API key securely in `localStorage`.
  - [x] Update API calls to use the stored key.
- **Project: `dictator`**
  - [x] Identify the service file for Gemini API calls.
  - [x] Implement an API key input field for the user.
  - [x] Store the API key securely in `localStorage`.
  - [x] Update API calls to use the stored key.
- **Project: `meeting-agent`**
  - [x] Identify the service file for Gemini API calls.
  - [x] Implement an API key input field for the user.
  - [x] Store the API key securely in `localStorage`.
  - [x] Update API calls to use the stored key.
- **Project: `osee`**
  - [x] Identify the service file for Gemini API calls.
  - [x] Implement an API key input field for the user.
  - [x] Store the API key securely in `localStorage`.
  - [x] Update API calls to use the stored key.

#### 2. Refactor `meeting-agent` Project
- [x] Reorganize file structure into `src`, `components`, `services`, `hooks`, `utils` directories.
- [x] Convert `app.ts` from a large class into a functional React component with hooks (`App.tsx`).
- [x] Break down the UI into smaller, reusable components (e.g., `Header`, `Controls`, `Editor`, `Sidebar`).
- [x] Manage state using React hooks (`useState`, `useEffect`, `useCallback`, `useReducer`).
- [x] Fix issues in `package.json` dependencies.

#### 3. GitHub Pages Deployment Preparation (One project at a time)
- **Project: `deeptube`**
  - [x] Update `vite.config.ts` with the correct `base` for GitHub Pages.
  - [x] Add `homepage` to `package.json`.
  - [x] Create a deployment script.
  - [x] Build the project.
- **Project: `dictator`**
  - [x] Update `vite.config.ts` with the correct `base` for GitHub Pages.
  - [x] Add `homepage` to `package.json`.
  - [x] Create a deployment script.
  - [x] Build the project.
- **Project: `meeting-agent`**
  - [x] Update `vite.config.ts` with the correct `base` for GitHub Pages.
  - [x] Add `homepage` to `package.json`.
  - [x] Create a deployment script.
  - [x] Build the project.
- **Project: `osee`**
  - [x] Update `vite.config.ts` with the correct `base` for GitHub Pages.
  - [x] Add `homepage` to `package.json`.
  - [x] Create a deployment script.
  - [x] Build the project.

#### 4. Update Main Portfolio Page
- [x] Add project cards for `deeptube`, `dictator`, `meeting-agent`, and `osee` to the main `index.html`.
- [x] Ensure links point to the deployed GitHub Pages URLs.

#### 5. Final Review
- [ ] Test all deployed applications to ensure they are working correctly.
- [ ] Verify that all links on the main portfolio page are correct.
- [ ] Commit all changes to the repository.
