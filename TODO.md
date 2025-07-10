### Project Integration and Deployment Plan

This plan is currently **BLOCKED** by a critical deployment issue.

#### 6. Resolve Monorepo Deployment Failure

- **Problem:** The GitHub Actions workflow is consistently failing during the `npm ci` or `npm install` step, specifically when trying to build the `country-data` Create React App. The error is `sh: 1: react-scripts: Permission denied`, which indicates a problem with how dependencies are being installed and accessed in the CI environment.

- **Failed Fixes & Attempts:**
  - **Attempt 1: `npx react-scripts build`**
    - **Action:** Modified `country-data/package.json` to use `npx` to ensure `react-scripts` was found in the path.
    - **Result:** Failed with the same `Permission denied` error.

  - **Attempt 2: Standardize Build Outputs & Correct Paths**
    - **Action:** Updated all Vite configurations to use a standard `build` output directory and corrected base paths. The deployment script was updated to match.
    - **Result:** Failed with the same `Permission denied` error. The `dictator` project also showed a warning about the output path.

  - **Attempt 3: Delete Nested `package-lock.json`**
    - **Action:** Removed `country-data/package-lock.json` to prevent conflicts with the root lockfile.
    - **Result:** Failed with the same `Permission denied` error.

  - **Attempt 4: Switch to `npm ci`**
    - **Action:** Updated the workflow to use `npm ci` for a cleaner, more reliable installation.
    - **Result:** Failed. `npm ci` reported that `package.json` and `package-lock.json` were out of sync, with numerous dependencies for `country-data` missing from the lockfile.

  - **Attempt 5: Regenerate lockfile, update Node to 20, add cache clean and permissions fix**
    - **Action:** Regenerated package-lock.json locally with npm install, updated workflow to Node 20, added npm cache clean --force before npm ci, and chmod +x on react-scripts after installation.
    - **Result:** Workflow ran but failed during deeptube build with 'Cannot find module @rollup/rollup-linux-x64-gnu'. Error suggests an npm bug with optional dependencies; recommends removing package-lock.json and node_modules and rerunning npm i.

- **Possible Solutions to Investigate:**
  - **1. Migrate `country-data` to Vite:** The current Create React App setup is the source of the deployment issues. Migrating to Vite will standardize the build process with other projects in the monorepo and resolve the `react-scripts` permission errors.
    - **Plan:**
      - **1. Create a new Vite project for `country-data`:** Set up a new Vite project with React and TypeScript.
      - **2. Migrate existing code:** Move the existing components, data, and styles to the new Vite project structure.
      - **3. Update dependencies:** Add necessary dependencies like D3.js and Material-UI to the new `package.json`.
      - **4. Configure Vite:** Set up the `vite.config.ts` file with the correct base path for GitHub Pages deployment.
      - **5. Test locally:** Ensure the application runs correctly in the local development environment.
      - **6. Update the root `package.json`:** Add a script to build the new Vite-based `country-data` project.
      - **7. Update the CI/CD workflow:** Modify the GitHub Actions workflow to build the new Vite project instead of the old Create React App.
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
