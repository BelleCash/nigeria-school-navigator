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
let isSearching = false;
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
// RESET UI
// =========================
function resetSearchUI() {
  currentPage = 0;
  resultsGrid.innerHTML = "";
  emptyState.classList.add("hidden");
}

// =========================
// REMOVE DUPLICATES
// =========================
function uniqueById(data) {
  const seen = new Set();
  return (data || []).filter(item => {
    if (!item?.id) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// =========================
// LOAD LGAs (RPC FIXED)
// =========================
async function loadLGAs(state) {
  lgaFilter.innerHTML = `<option value="">All LGAs</option>`;
  if (!state) return;

  const { data, error } = await client.rpc("get_unique_lgas", {
    selected_state: state,
  });

  if (error) {
    console.error("LGA load error:", error);
    return;
  }

  (data || []).forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.lga;
    opt.textContent = item.lga;
    lgaFilter.appendChild(opt);
  });
}

// =========================
// BUILD QUERY
// =========================
function buildQuery() {
  let query = client.from("schools").select("*");

  const keyword = input.value?.trim();

  if (keyword) {
    query = query.textSearch("search_vector", keyword, {
      type: "websearch",
    });
  }

  if (stateFilter.value) query = query.eq("state", stateFilter.value);
  if (lgaFilter.value) query = query.eq("lga", lgaFilter.value);
  if (typeFilter.value) query = query.eq("level", typeFilter.value);
  if (settlementFilter.value)
    query = query.eq("settlement_type", settlementFilter.value);

  return query;
}

// =========================
// SEARCH (FULLY FIXED)
// =========================
async function searchSchools(reset = true) {
  if (isSearching) return;
  isSearching = true;

  if (reset) resetSearchUI();

  const from = currentPage * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await buildQuery()
    .order("state", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Search error:", error);
    isSearching = false;
    return;
  }

  const results = uniqueById(data || []);

  if (reset) {
    resultCount.textContent = results.length;
  }

  if (results.length === 0 && reset) {
    emptyState.classList.remove("hidden");
    isSearching = false;
    return;
  }

  renderResults(results);

  currentPage++;
  isSearching = false;
}

// =========================
// RENDER RESULTS (AI TAGS RESTORED)
// =========================
function renderResults(data) {
  const fragment = document.createDocumentFragment();

  const existingIds = new Set(
    Array.from(resultsGrid.querySelectorAll(".school-card"))
      .map(el => el.getAttribute("data-id"))
  );

  data.forEach((school) => {
    if (school.id && existingIds.has(String(school.id))) return;

    const card = document.createElement("div");
    card.className = "school-card";
    card.setAttribute("data-id", school.id || "");

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

[lgaFilter, typeFilter, settlementFilter].forEach((el) => {
  el.addEventListener("change", () => searchSchools(true));
});

// =========================
// INIT
// =========================
searchSchools(true);
