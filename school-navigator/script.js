// =========================
// SUPABASE INIT
// =========================
const SUPABASE_URL = "https://ulqsavnzjzvxqcihsmmv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscXNhdm56anp2eHFjaWhzbW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTAwNTgsImV4cCI6MjA5MzEyNjA1OH0.hou0zP6NyY9F9ZlrZIh82_CanIrmzveFaea4aka4gtA";

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
// STATE
// =========================
let currentPage = 0;
const PAGE_SIZE = 50;

// =========================
// DEBOUNCE
// =========================
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// =========================
// LOAD LGAs
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

  const uniqueLGAs = [...new Set((data || []).map(l => l.lga).filter(Boolean))].sort();

  uniqueLGAs.forEach(lga => {
    const opt = document.createElement("option");
    opt.value = lga;
    opt.textContent = lga;
    lgaFilter.appendChild(opt);
  });
}

// =========================
// BUILD QUERY
// =========================
function buildQuery() {
  let query = client.from("schools").select("*");

  const keyword = input.value?.trim();

  // Full text search (safe fallback)
  if (keyword) {
    query = query.textSearch("search_vector", keyword, {
      type: "websearch"
    });
  }

  if (stateFilter.value) query = query.eq("state", stateFilter.value);
  if (lgaFilter.value) query = query.eq("lga", lgaFilter.value);
  if (typeFilter.value) query = query.eq("level", typeFilter.value);
  if (settlementFilter.value) query = query.eq("settlement_type", settlementFilter.value);

  return query;
}

// =========================
// SEARCH (PAGINATED + STABLE SORT)
// =========================
async function searchSchools(reset = true) {
  if (reset) {
    currentPage = 0;
    resultsGrid.innerHTML = "";
    emptyState.classList.add("hidden");
  }

  const from = currentPage * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await buildQuery()
    .order("state", { ascending: true })   // stable sorting
    .order("name", { ascending: true })    // secondary sorting
    .range(from, to);

  if (error) {
    console.error("Search error:", error);
    return;
  }

  const results = data || [];

  if (reset) {
    resultCount.textContent = results.length;
  }

  if (results.length === 0 && reset) {
    emptyState.classList.remove("hidden");
    return;
  }

  renderResults(results);

  currentPage++;
}

// =========================
// RENDER RESULTS
// =========================
function renderResults(data) {
  const fragment = document.createDocumentFragment();

  data.forEach(school => {
    const card = document.createElement("div");
    card.className = "school-card";

    card.innerHTML = `
      <div class="school-name">${school.name ?? "Unnamed School"}</div>
      <div class="location">${school.state ?? ""} • ${school.lga ?? ""}</div>
      <div><b>Level:</b> ${school.level ?? "N/A"}</div>
      <div><b>Type:</b> ${school.settlement_type ?? "N/A"}</div>
      <div class="tags">
        ${
          Array.isArray(school.ai_tags)
            ? school.ai_tags.map(tag => `<span class="tag">${tag}</span>`).join("")
            : ""
        }
      </div>
    `;

    fragment.appendChild(card);
  });

  resultsGrid.appendChild(fragment);
}

// =========================
// LOAD MORE BUTTON
// =========================
const loadMoreBtn = document.createElement("button");
loadMoreBtn.textContent = "Load More";
loadMoreBtn.className = "load-more";

loadMoreBtn.addEventListener("click", () => {
  searchSchools(false);
});

document.querySelector(".results-section").appendChild(loadMoreBtn);

// =========================
// EVENTS
// =========================
const debouncedSearch = debounce(() => searchSchools(true), 300);

input.addEventListener("input", debouncedSearch);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchSchools(true);
});

stateFilter.addEventListener("change", () => {
  loadLGAs(stateFilter.value);
  searchSchools(true);
});

[lgaFilter, typeFilter, settlementFilter].forEach(el => {
  el.addEventListener("change", () => searchSchools(true));
});

// =========================
// INIT
// =========================
searchSchools();
