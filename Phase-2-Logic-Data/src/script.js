// src/script.js

import { nigeriaData } from "./data/nigeriaData.js";
import { filterSchools } from "./logic/filter.js";

// DOM elements
const searchInput = document.querySelector("#school-search");
const stateFilter = document.querySelector("#state-filter");
const form = document.querySelector(".search-container");
const grid = document.querySelector(".school-grid");

// Render function
function renderSchools(schools) {
  grid.innerHTML = "";

  schools.forEach((school) => {
    const card = document.createElement("div");
    card.classList.add("school-card");

    card.innerHTML = `
      <div class="card-header">
        <h2 class="school-name">${school.school_name}</h2>
        <span class="tag">${school.education_level}</span>
      </div>
      <p class="location">${school.state}, ${school.lga}</p>
      <p class="address">${school.address}</p>
    `;

    grid.appendChild(card);
  });
}

// Initial render
renderSchools(nigeriaData);

// Handle search + filter
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = searchInput.value;
  const state = stateFilter.value;

  const filtered = filterSchools(nigeriaData, {
    query,
    state,
    level: null,
    ownership: null,
  });

  renderSchools(filtered);
});
