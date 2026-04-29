// src/script.js

import { nigeriaData } from "./data/nigeriaData.js";
import { filterSchools } from "./logic/filter.js";

// =========================
// DOM ELEMENTS
// =========================
const form = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const stateFilter = document.querySelector("#stateFilter");
const typeFilter = document.querySelector("#typeFilter");
const grid = document.querySelector("#resultsGrid");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");

// =========================
// RENDER FUNCTION
// =========================
/**
 * Paints the school cards into the grid based on the provided array.
 */
function renderSchools(schools) {
    // Clear current grid
    grid.innerHTML = "";

    // Update Result Count
    resultCount.textContent = `${schools.length} schools found`;

    // Handle Empty State
    if (schools.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    // Paint Cards
    schools.forEach((school) => {
        const card = document.createElement("div");
        card.className = "school-card";

        // Using Template Literals for clean, readable HTML injection
        card.innerHTML = `
            <div class="card-header">
                <h2 class="school-name">${school.school_name}</h2>
                <span class="tag">${school.education_level}</span>
            </div>
            <div class="card-body">
                <p class="location"><strong>Location:</strong> ${school.lga}, ${school.state}</p>
                <p class="address">${school.address}</p>
                <div class="meta-info">
                    <span class="type-badge">${school.school_type}</span>
                    <span class="ownership-badge">${school.ownership_type}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// =========================
// FILTER LOGIC ENGINE
// =========================
/**
 * Gathers current filter values and runs the filter logic.
 */
const updateUI = () => {
    const filters = {
        query: searchInput.value.trim(),
        state: stateFilter.value,
        level: typeFilter.value,
        ownership: null // Placeholder for future features
    };

    const filteredData = filterSchools(nigeriaData, filters);
    renderSchools(filteredData);
};

// =========================
// EVENT LISTENERS
// =========================

// 1. Real-time filtering (Snappy UX)
searchInput.addEventListener("input", updateUI);
stateFilter.addEventListener("change", updateUI);
typeFilter.addEventListener("change", updateUI);

// 2. Form Submit (Prevents page reload if user hits Enter)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateUI();
});

// =========================
// INITIAL LOAD
// =========================
// Load all schools immediately when the page opens
renderSchools(nigeriaData);
