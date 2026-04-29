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

// =========================
// RENDER FUNCTION
// =========================
function renderSchools(schools) {
  grid.innerHTML = "";

  if (schools.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  schools.forEach((school) => {
    const card = document.createElement("div");
    card.className = "school-card";

    card.innerHTML = `
      <div class="card-header">
        <h2 class="school-name">${school.school_name}</h2>
        <span class="tag">${school.education_level}</span>
      </div>

      <p class="location">${school.state}, ${school.lga}</p>
      <p class="address">${school.address}</p>
      <p class="address"><strong>Type:</strong> ${school.school_type}</p>
      <p class="address"><strong>Ownership:</strong> ${school.ownership_type}</p>
    `;

    grid.appendChild(card);
  });
}

// =========================
// INITIAL LOAD
// =========================
renderSchools(nigeriaData);

// =========================
// FORM SUBMIT HANDLER
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();
  const state = stateFilter.value;
  const level = typeFilter.value;

  const filtered = filterSchools(nigeriaData, {
    query,
    state,
    level,
    ownership: null, // for now
  });

  renderSchools(filtered);
});
