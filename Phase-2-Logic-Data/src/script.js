// =========================
// CONFIGURATION
// =========================
const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcXJkZ2Rjbm90eHJ3cHZoeHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjkxMzgsImV4cCI6MjA5MzA0NTEzOH0.hbVnC_GVOPZlFbnqCwOk_iPHa5UkcOYH5ZLfY0D_kvw";

let supabase;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.supabase) {
    console.error("Supabase CDN failed to load.");
    return;
  }

  supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  init(); // ✅ FIXED (was initApp)
});

// =========================
// STATE
// =========================
let page = 0;
const limit = 20;
let loading = false;

// =========================
// DOM
// =========================
let grid, searchInput, stateFilter, typeFilter, resultCount, emptyState;

function initDom() {
  grid = document.querySelector("#resultsGrid");
  searchInput = document.querySelector("#searchInput");
  stateFilter = document.querySelector("#stateFilter");
  typeFilter = document.querySelector("#typeFilter");
  resultCount = document.querySelector("#resultCount");
  emptyState = document.querySelector("#emptyState");
}

// =========================
// HELPERS
// =========================
const safe = (v, f = "") =>
  v?.toString().trim() ? v.toString().trim() : f;

function normalizeOwnership(v) {
  if (!v) return "Unknown";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.type || v.name || "Unknown";
  return "Unknown";
}

function getLevel(levels = {}) {
  if (levels.primary) return "Primary";
  if (levels.secondary) return "Secondary";
  if (levels.tertiary) return "Tertiary";
  return "Unknown";
}

function formatLocation(s) {
  if (s.lga && s.state) return `${s.lga}, ${s.state}`;
  if (s.state) return s.state;
  if (s.lga) return s.lga;
  return "Location not available";
}

// =========================
// SINGLE NORMALIZE (FIXED - NO DUPLICATES)
// =========================
function normalize(s) {
  return {
    school_name: safe(s.school_name, "No name"),
    state: safe(s.state),
    lga: safe(s.lga),
    address: safe(s.address),
    delivery_mode: safe(s.delivery_mode, "Unknown"),
    ownership: normalizeOwnership(s.ownership),
    education_levels: s.education_levels || {}
  };
}

// =========================
// FETCH
// =========================
async function fetchSchools(reset = false) {
  if (loading) return;
  loading = true;

  if (reset) {
    page = 0;
    grid.innerHTML = "";
    emptyState?.classList.add("hidden");
  }

  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1);

  const search = searchInput?.value?.trim();

  if (search) {
    query = query.ilike("school_name", `%${search}%`);
  }

  if (stateFilter?.value) {
    query = query.eq("state", stateFilter.value);
  }

  // ✅ SAFE FILTER (more reliable than contains)
  if (typeFilter?.value) {
    const type = typeFilter.value;

    query = query.or(
      `education_levels->primary.eq.${type === "primary"},` +
      `education_levels->secondary.eq.${type === "secondary"},` +
      `education_levels->tertiary.eq.${type === "tertiary"}`
    );
  }

  const { data, error } = await query;

  loading = false;

  if (error) {
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    if (page === 0) showEmpty();
    return;
  }

  render(data.map(normalize));
  page++;
}

// =========================
// RENDER
// =========================
function render(schools) {
  emptyState?.classList.add("hidden");

  resultCount.textContent =
    `${grid.children.length + schools.length} schools`;

  schools.forEach(s => {
    const card = document.createElement("div");
    card.className = "school-card";

    card.innerHTML = `
      <div class="card-header">
        <h2>${s.school_name}</h2>
        <span class="tag">${getLevel(s.education_levels)}</span>
      </div>

      <div class="card-body">
        <p><strong>Location:</strong> 📍 ${formatLocation(s)}</p>
        ${s.address ? `<p>${s.address}</p>` : ""}

        <div class="meta-info">
          <span>${s.delivery_mode}</span>
          <span>${s.ownership}</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// =========================
// EMPTY STATE
// =========================
function showEmpty() {
  emptyState.classList.remove("hidden");
  emptyState.innerHTML = `<p>No schools found</p>`;
}

// =========================
// EVENTS
// =========================
function initEvents() {
  searchInput?.addEventListener("input", () => fetchSchools(true));
  stateFilter?.addEventListener("change", () => fetchSchools(true));
  typeFilter?.addEventListener("change", () => fetchSchools(true));
}

// =========================
// INIT APP
// =========================
function init() {
  initDom();
  initEvents();
  fetchSchools();
}
