### CV Page Enhancement Plan

This plan outlines the tasks to improve the CV page based on user feedback.

#### 1. Content and Information Updates
- **Status:** `COMPLETED`
- **Tasks:**
  - [x] **Contact Info:** Update email, phone, and location in `cv/index.html`.
  - [x] **Skills:** Add "Prompt Engineering" and "AI Agents" to the skills section in `cv/index.html`.
  - [x] **AI Projects:**
      - [x] Add project cards for `Deeptube`, `Meeting Agent`, `Dictator`, and `Osee`.
      - [x] Link projects to their respective GitHub repositories and live demos.

#### 2. UI/UX and Layout Improvements
- **Status:** `COMPLETED`
- **Tasks:**
  - [x] **Reduce Animations:**
      - [x] Tone down or remove distracting text and element animations in `cv/styles.css` and `cv/script.js` to improve readability.
      - [x] Specifically address `glitch-text`, excessive card/icon movements.
  - [x] **Adjust Hero Layout:** Lower the "Scroll to explore" indicator to give more space below the stats section.
  - [x] **Rebalance Main Layout:**
      - [x] Move the "Additional Background" section to the left column under "Education" in `cv/index.html`.
      - [x] Ensure the two columns have a more similar height for a balanced look.

#### 3. PDF Generation Overhaul
- **Status:** `COMPLETED`
- **Tasks:**
  - [x] **Integrate PDF Library:** Add `html2pdf.js` (or a similar library) to `cv/index.html`.
  - [x] **Refactor Download Function:** Rewrite the `downloadPDF` function in `cv/script.js` to use the new library.
  - [x] **Create Print-Friendly Styles:**
      - [x] Design a clean, professional CSS style for the PDF output.
      - [x] This style should prioritize content and readability over complex animations and backgrounds.
      - [x] Ensure the PDF layout is well-structured and visually appealing.
  - [x] **Test PDF Export:** Thoroughly test the PDF export functionality to ensure a high-quality output.

#### 4. Final Review
- **Status:** `COMPLETED`
- **Tasks:**
  - [x] Review all implemented changes on the webpage.
  - [x] Verify that all content is correct and links are working.
  - [x] Commit the final, polished version.
