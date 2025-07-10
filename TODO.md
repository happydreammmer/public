### Project Integration and Deployment Plan

This plan is currently **BLOCKED** by a critical deployment issue.

#### 6. Resolve Monorepo Deployment Failure

- **Problem:** The GitHub Actions workflow is consistently failing during the `npm ci` or `npm install` step, specifically when trying to build the `country-data` Create React App. The error is `sh: 1: react-scripts: Permission denied`, which indicates a problem with how dependencies are being installed and accessed in the CI environment.

- **[COMPLETED] Solution: Migrate `country-data` to Vite**
  - **Plan:**
    - [x] **1. Create a new Vite project for `country-data`:** Set up a new Vite project with React and TypeScript.
    - [x] **2. Migrate existing code:** Move the existing components, data, and styles to the new Vite project structure.
    - [x] **3. Update dependencies:** Add necessary dependencies like D3.js and Material-UI to the new `package.json`.
    - [x] **4. Configure Vite:** Set up the `vite.config.ts` file with the correct base path for GitHub Pages deployment.
    - [x] **5. Test locally:** Ensure the application runs correctly in the local development environment.
    - [x] **6. Update the root `package.json`:** Add a script to build the new Vite-based `country-data` project.
    - [x] **7. Update the CI/CD workflow:** Modify the GitHub Actions workflow to build the new Vite project instead of the old Create React App.

- **[COMPLETED] Solution: Fix `deploy.yml` mkdir issue**
  - **Plan:**
    - [x] **1. Create a new Vite project for `country-data`:** Set up a new Vite project with React and TypeScript.

- **Possible Solutions to Investigate (Archived - No Longer Relevant):**
  - **2. Regenerate `package-lock.json`:** The lockfile is clearly corrupted or incomplete. The next step must be to regenerate it from a clean state locally and commit the updated version.
  - **3. Node.js Version:** The build log shows a warning (`EBADENGINE`) that `@google/genai` requires Node.js `v20.0.0` or higher, but the workflow is using `v18`. This mismatch could be a contributing factor.
  - **4. Caching Issues:** The npm cache in the GitHub Actions runner might be corrupted. Clearing the cache before installation could resolve the issue.
  - **5. Monorepo Dependency Hoisting:** The use of `shamefully-hoist=true` in `.npmrc`, while sometimes necessary, can create complex and fragile dependency trees. A more structured approach to managing workspace dependencies might be required.
  - **6. Handle optional dependencies for Rollup:** The error points to a missing optional native module for Rollup on Linux. Try running npm install --force in the workflow or specifically for deeptube to ensure optional deps are installed.
  - **7. Switch from npm ci to npm install in CI:** npm ci may skip optional deps due to lockfile strictness; using npm install could resolve it.
  - **8. Platform-specific fixes:** Since this occurs on Ubuntu runner, test with a different runner OS or add steps to install missing system dependencies for native modules.

#### 1. API Key Integration & UI/UX Enhancements (Completed)
- [x] **Project: `deeptube`**
- [x] **Project: `dictator`**
- [x] **Project: `meeting-agent`**
- [x] **Project: `osee`**

#### 2. Refactor `meeting-agent` Project (Completed)
- [x] Reorganized file structure.
- [x] Converted `app.ts` to a functional React component.
- [x] Broke down the UI into smaller components.
- [x] Managed state using React hooks.
- [x] Fixed `package.json` dependencies.

#### 3. GitHub Pages Deployment Preparation (Blocked)
- **Project: `deeptube`**
- **Project: `dictator`**
- **Project: `meeting-agent`**
- **Project: `osee`**

#### 4. Update Main Portfolio Page (Blocked)
- [ ] Add project cards for new projects.
- [ ] Ensure links point to deployed URLs.

#### 5. Final Review (Blocked)
- [ ] Test all deployed applications.
- [ ] Verify all links on the main portfolio page.
- [ ] Commit all changes.
