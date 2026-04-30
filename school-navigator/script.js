// =========================
// SUPABASE INIT
// =========================
const SUPABASE_URL = "https://ulqsavnzjzvxqcihsmmv.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =========================
// DOM ELEMENTS
// =========================
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");

const stateFilter = document.getElementById("stateFilter");
const lgaFilter = document.getElementById("lgaFilter");
const typeFilter = document.getElementById("typeFilter");
const settlementFilter = document.getElementById("settlementFilter");

const resultsGrid = document.getElementById("resultsGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

// =========================
// UTIL: DEBOUNCE (IMPORTANT FOR SCALE)
// =========================
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// =========================
// LOAD STATES (CLEANED + UNIQUE)
// =========================
async function loadStates() {
  const { data, error } = await client
    .from("schools")
    .select("state");

  if (error || !data) {
    console.error(error);
    return;
  }

  const uniqueStates = [...new Set(data.map(s => s.state).filter(Boolean))];

  stateFilter.innerHTML = `<option value="">All States</option>`;

  uniqueStates.forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateFilter.appendChild(opt);
  });
}

// =========================
// LOAD LGAs BASED ON STATE
// =========================
async function loadLGAs(state) {
  lgaFilter.innerHTML = `<option value="">All LGAs</option>`;

  if (!state) return;

  const { data, error } = await client
    .from("schools")
    .select("lga")
    .eq("state", state);

  if (error || !data) return;

  const uniqueLGAs = [...new Set(data.map(l => l.lga).filter(Boolean))];

  uniqueLGAs.forEach(lga => {
    const opt = document.createElement("option");
    opt.value = lga;
    opt.textContent = lga;
    lgaFilter.appendChild(opt);
  });
}

// =========================
// MAIN SEARCH FUNCTION
// =========================
async function searchSchools() {

  let query = client
    .from("schools")
    .select("*")
    .limit(50);

  // safer search (works even if empty)
  const keyword = input.value?.trim();

  if (keyword) {
    query = query.ilike("name", `%${keyword}%`);
  }

  if (stateFilter.value) {
    query = query.eq("state", stateFilter.value);
  }

  if (lgaFilter.value) {
    query = query.eq("lga", lgaFilter.value);
  }

  if (typeFilter.value) {
    query = query.eq("level", typeFilter.value);
  }

  if (settlementFilter.value) {
    query = query.eq("settlement_type", settlementFilter.value);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Search error:", error);
    return;
  }

  renderResults(data || []);
}

// =========================
// RENDER RESULTS
// =========================
function renderResults(data) {

  resultsGrid.innerHTML = "";
  resultCount.textContent = data.length;

  if (!data.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  data.forEach(school => {

    const card = document.createElement("div");
    card.className = "school-card";

    card.innerHTML = `
      <h3>${school.name || "Unnamed School"}</h3>
      <p>${school.state || ""} • ${school.lga || ""}</p>
      <p><b>Level:</b> ${school.level || "N/A"}</p>
      <p><b>Type:</b> ${school.settlement_type || "N/A"}</p>
      <small>${(school.ai_tags || []).join(", ")}</small>
    `;

    resultsGrid.appendChild(card);
  });
}

// =========================
// EVENTS (OPTIMIZED)
// =========================
const debouncedSearch = debounce(searchSchools, 300);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchSchools();
});

input.addEventListener("input", debouncedSearch);

stateFilter.addEventListener("change", () => {
  loadLGAs(stateFilter.value);
  searchSchools();
});

[lgaFilter, typeFilter, settlementFilter].forEach(el => {
  el.addEventListener("change", searchSchools);
});

// =========================
// INIT
// =========================
loadStates();
searchSchools();
