// =========================
// SUPABASE CONFIG
// =========================
const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
const supabaseKey = "YOUR_ANON_KEY_HERE" // <-- replace with your eyJ... key

let supabase

// =========================
// STATE
// =========================
let page = 0
const limit = 20
let loading = false

// =========================
// DOM ELEMENTS
// =========================
let grid, searchInput, stateFilter, typeFilter, resultCount, emptyState

// =========================
// INIT APP
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.supabase) {
    console.error("Supabase CDN not loaded")
    return
  }

  supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

  initDom()
  initEvents()
  fetchSchools()
})

// =========================
// DOM SETUP
// =========================
function initDom() {
  grid = document.querySelector("#resultsGrid")
  searchInput = document.querySelector("#searchInput")
  stateFilter = document.querySelector("#stateFilter")
  typeFilter = document.querySelector("#typeFilter")
  resultCount = document.querySelector("#resultCount")
  emptyState = document.querySelector("#emptyState")
}

// =========================
// HELPERS
// =========================
const safe = (v, f = "Unknown") =>
  v?.toString().trim() ? v.toString().trim() : f

function normalizeOwnership(v) {
  if (!v) return "Unknown"
  if (typeof v === "string") return v
  if (typeof v === "object") return v.type || v.name || "Unknown"
  return "Unknown"
}

function getLevel(levels = {}) {
  if (levels.tertiary) return "Tertiary"
  if (levels.secondary) return "Secondary"
  if (levels.primary) return "Primary"
  return "Unknown"
}

function formatLocation(s) {
  if (s.lga && s.state) return `${s.lga}, ${s.state}`
  if (s.state) return s.state
  if (s.lga) return s.lga
  return "Location not available"
}

// =========================
// NORMALIZE (ONLY ONCE)
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
  }
}

// =========================
// FETCH DATA
// =========================
async function fetchSchools(reset = false) {
  if (loading || !supabase) return
  loading = true

  if (reset) {
    page = 0
    grid.innerHTML = ""
    emptyState?.classList.add("hidden")
  }

  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1)

  const search = searchInput?.value?.trim()

  if (search) {
    query = query.ilike("school_name", `%${search}%`)
  }

  if (stateFilter?.value) {
    query = query.eq("state", stateFilter.value)
  }

  // FIXED: safe education filter
  if (typeFilter?.value) {
    query = query.contains("education_levels", {
      [typeFilter.value]: true
    })
  }

  const { data, error } = await query

  loading = false

  if (error) {
    console.error("Supabase error:", error)
    return
  }

  if (!data || data.length === 0) {
    if (page === 0) showEmpty()
    return
  }

  render(data.map(normalize))
  page++
}

// =========================
// RENDER
// =========================
function render(schools) {
  emptyState?.classList.add("hidden")

  const current = grid.querySelectorAll(".school-card").length
  resultCount.textContent = `${current + schools.length} schools`

  schools.forEach(s => {
    const card = document.createElement("div")
    card.className = "school-card"

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
    `

    grid.appendChild(card)
  })
}

// =========================
// EMPTY STATE
// =========================
function showEmpty() {
  emptyState.classList.remove("hidden")
  emptyState.innerHTML = `
    <p>No schools found</p>
  `
}

// =========================
// EVENTS
// =========================
function initEvents() {
  searchInput?.addEventListener("input", () => fetchSchools(true))
  stateFilter?.addEventListener("change", () => fetchSchools(true))
  typeFilter?.addEventListener("change", () => fetchSchools(true))

  document.querySelector("#searchForm")?.addEventListener("submit", e => {
    e.preventDefault()
    fetchSchools(true)
  })
}
