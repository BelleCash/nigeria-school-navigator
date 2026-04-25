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


Development (Coming in Week 3)
Once the React framework is initialized:
npm install
npm run dev

📜 License
This project is licensed under the MIT License, encouraging open-source collaboration and community growth within the Nigerian tech ecosystem.

Strategy Note
The 10/50 Rule: This repository is built using a strict 1-hour daily sprint. 10 minutes are spent on theory and documentation, while 50 minutes are dedicated to active coding. This ensures maximum output and deep practical understanding of the technical architecture.
