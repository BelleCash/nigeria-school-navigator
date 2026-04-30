
// =========================
// SUPABASE INIT
// =========================
const SUPABASE_URL = "https://ulqsavnzjzvxqcihsmmv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscXNhdm56anp2eHFjaWhzbW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTAwNTgsImV4cCI6MjA5MzEyNjA1OH0.hou0zP6NyY9F9ZlrZIh82_CanIrmzveFaea4aka4gtA";

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
// UTIL: DEBOUNCE
// =========================
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// =========================
// LOAD STATES (FIXED: DISTINCT QUERY)
// =========================
async function loadStates() {
  const { data, error } = await client
    .from("schools")
    .select("state");

  if (error) {
    console.error("State load error:", error);
    return;
  }

  if (!data) return;

  const uniqueStates = [
    ...new Set(data.map(s => s.state).filter(Boolean))
  ].sort();

  stateFilter.innerHTML = `<option value="">All States</option>`;

  uniqueStates.forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateFilter.appendChild(opt);
  });
}

// =========================
// LOAD LGAs (SAFE VERSION)
// =========================
async function loadLGAs(state) {
  lgaFilter.innerHTML = `<option value="">All LGAs</option>`;

  if (!state) return;

  const { data, error } = await client
    .from("schools")
    .select("lga")
    .eq("state", state);

  if (error) {
    console.error("LGA load error:", error);
    return;
  }

  if (!data) return;

  const uniqueLGAs = [
    ...new Set(data.map(l => l.lga).filter(Boolean))
  ].sort();

  uniqueLGAs.forEach(lga => {
    const opt = document.createElement("option");
    opt.value = lga;
    opt.textContent = lga;
    lgaFilter.appendChild(opt);
  });
}

// =========================
// SEARCH FUNCTION (OPTIMIZED)
// =========================
async function searchSchools() {

  let query = client
    .from("schools")
    .select("*")
    .limit(50);

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
// RENDER RESULTS (SAFE + FAST)
// =========================
function renderResults(data) {

  resultsGrid.innerHTML = "";
  resultCount.textContent = data.length;

  if (!data.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const fragment = document.createDocumentFragment();

  data.forEach(school => {
    const card = document.createElement("div");
    card.className = "school-card";

    card.innerHTML = `
      <h3>${school.name ?? "Unnamed School"}</h3>
      <p>${school.state ?? ""} • ${school.lga ?? ""}</p>
      <p><b>Level:</b> ${school.level ?? "N/A"}</p>
      <p><b>Type:</b> ${school.settlement_type ?? "N/A"}</p>
      <small>${Array.isArray(school.ai_tags) ? school.ai_tags.join(", ") : ""}</small>
    `;

    fragment.appendChild(card);
  });

  resultsGrid.appendChild(fragment);
}

// =========================
// EVENTS
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
