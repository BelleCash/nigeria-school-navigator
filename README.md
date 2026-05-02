# 🇳🇬 Nigeria School Navigator
### 30-Day Expertise Sprint: From Intent to Architecture

A high-performance, mobile-first search engine designed to navigate the educational landscape across all 774 Local Government Areas (LGAs) in Nigeria. This project is the result of a disciplined 30-day "Expertise Sprint," focusing on efficient data handling for low-bandwidth environments and AI-assisted "Vibe Coding" workflows.

---

## 🎯 The Mission
To build a lightweight, scalable solution for locating schools nationwide. This project prioritizes:
* **Mobile-First Performance:** Optimized for 3G/4G stability and fast load times.
* **Data Strategy:** Efficiently filtering the Humanitarian Data Exchange (HDX) Nigeria school dataset.
* **Vibe Coding:** Leveraging AI tools like Cursor and v0.dev for rapid, intent-based development.

---

## 🗓️ The 30-Day Roadmap

| Phase | Focus Area | Milestone |
| :--- | :--- | :--- |
| **Week 1** | Web Foundations | Semantic HTML5 and CSS Grid layout for school listing cards. |
| **Week 2** | JS & REST | Async logic to filter nationwide data by State and LGA. |
| **Week 3** | React Frameworks | Building the search interface and results grid using React. |
| **Week 4** | AI & Leadership | "Smart Recommendation" chat and final Vercel deployment. |

---

## 🏗️ Project Architecture

### Data Strategy
Handling data for a country as large as Nigeria requires a performance-first approach. We use a "fetch-and-filter" logic to ensure the UI remains snappy, even when parsing thousands of data points from the HDX dataset.

### Tech Stack
* **Frontend:** React (Vite)
* **Styling:** CSS Grid and Flexbox (Custom optimized for mobile)
* **Data Source:** Humanitarian Data Exchange (HDX)
* **AI Tools:** Cursor (Pair Programming), v0.dev (UI Generation)
* **Deployment:** Vercel

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/BelleCash/nigeria-school-navigator.git](https://github.com/BelleCash/nigeria-school-navigator.git)
Explore the Phases
Each week's progress is organized into its own folder. Start with /Phase-1-Web-Foundations to see the initial mobile layouts.

**WORK PROGRESS**
https://bellecash.github.io/nigeria-school-navigator/Phase-1-Web-Foundations/index.html

## 🏗️ Technical Architecture: Day 3 Update

### Typography & Readability
* **Font Integration:** Integrated 'Inter' via Google Fonts to improve legibility and provide a modern, high-end aesthetic.
* **Readability Optimization:** Implemented specific `line-height` (1.6) and `letter-spacing` (-0.02em) to ensure the UI remains accessible and easy to scan for mobile users in high-glare environments.

### Flexbox Implementation
* **Micro-Layouts:** Used `display: flex` with `justify-content: space-between` within school cards to create a clean horizontal alignment between School Names and Category Tags.
* **Alignment Logic:** Utilized `align-items: center` to ensure text elements of different sizes remain perfectly centered relative to each other, maintaining a professional visual balance.

### Latest Web Standards
* **CSS Variables:** Leveraged `:root` variables for theme consistency across the platform.
* **Hover States:** Added subtle CSS transitions to provide immediate interactive feedback to users.

## 🏗️ Day 4: Interactive Foundations
Today, I transitioned the project from a static list to an interactive tool by:
- **HTML Forms**: Added a search bar and state-filter dropdown to capture user input.
- **UI Feedback**: Implemented CSS pseudo-classes (:hover, :focus) to improve mobile UX.
- **Strategic Prep**: These forms are currently "static," serving as the hooks for the JavaScript filtering logic coming in Week 2.

### Day 5: Advanced Selectors & Accessible Design

**Objective:** To transition from basic HTML structures to a professional, clean-coded architecture using external styling and accessibility standards.

**Technical Progress:**
* **External Modular Styling:** Decoupled CSS from HTML by creating a dedicated `style.css` file, improving maintainability.
* **Advanced Attribute Selectors:** Used selectors like `input[type="radio"]` and `input[type="checkbox"]` to style specific elements without adding unnecessary classes to the HTML.
* **A11y (Accessibility) Integration:** Implemented the `<label for="">` pattern across all form inputs to ensure screen-reader compatibility and increase clickable touch targets for mobile users.
* **Form Logic:** Built complex input groups using `<fieldset>` and `<legend>` for better semantic grouping of school data.

## 📅 Day 8 — Frontend Stabilization & Search Engine Integration

Today marked a major transition from basic UI development to a fully functional, database-powered search system.

---

## 🚀 Key Achievements

### 🏗 Project Structure Finalized
Reorganized the project into a clean, production-ready layout:

- `index.html` (entry point)
- `style.css`
- `script.js`
- `/assets` (images)
- `/data` (CSV + reports)
- `/docs` (legal pages)

This ensures:
- GitHub Pages compatibility
- clean separation of concerns
- scalability for future upgrades

---

### 🧠 Supabase Integration Completed
Connected the frontend to Supabase and implemented:

- keyword search (`ilike`)
- state filtering
- LGA filtering
- school level filtering
- settlement type filtering

The app now behaves like a real-time database query engine.

---

### 🇳🇬 Nigeria State System Fixed
Resolved missing/unstable state filters by:

- replacing dynamic loading with a **hardcoded list of 36 states + FCT**
- ensuring consistency with database values

This improved:
- reliability
- performance
- UX responsiveness

---

### ⚡ Cascading Filters (State → LGA)
Implemented dependent filtering:

- selecting a state dynamically loads its LGAs
- filters combine seamlessly

This introduced structured geographic querying into the system.

---

### 🧼 JavaScript Refactor & Stability Improvements

Refactored `script.js` to improve:

- error handling (Supabase responses)
- null safety (`??` and array checks)
- rendering performance (DocumentFragment)
- debounce logic for search input

Result:
- smoother UX
- reduced API load
- no crashes on bad data

---

### ⚙️ Performance Optimization

- added debounced search (300ms)
- limited results to 50 per query
- optimized DOM updates

The app can now handle **100,000+ records efficiently**.

---

### 📄 Legal & Documentation Setup

- created Terms & Conditions page
- structured `/docs` folder

Prepares the project for public deployment and future scaling.

---

## 🎯 Current System Capabilities

- 🔍 Search schools by name
- 🌍 Filter by state and LGA
- 🏫 Filter by level (primary, secondary, tertiary)
- 🏙 Filter by settlement type (urban/rural)
- ⚡ Real-time Supabase queries
- 📊 Dynamic results rendering

---

## 🧠 Key Insight

This project has evolved from a simple frontend UI into a:

> **Database-driven search engine prototype for Nigerian schools**

---

## 🚀 Next Steps (Day 9 Preview)

- Instant search (no submit button)
- Infinite scroll / pagination
- AI-powered recommendations
- Map-based school explorer
- Admin dashboard for data management

---

📜 License
This project is licensed under the MIT License, encouraging open-source collaboration and community growth within the Nigerian tech ecosystem.

Strategy Note
The 10/50 Rule: This repository is built using a strict 1-hour daily sprint. 10 minutes are spent on theory and documentation, while 50 minutes are dedicated to active coding. This ensures maximum output and deep practical understanding of the technical architecture.
