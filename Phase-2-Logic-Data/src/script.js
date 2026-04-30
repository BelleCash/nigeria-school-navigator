let supabase;

// =========================
// INIT AFTER DOM READY
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  initSupabase()
  initDOM()
  initEvents()
  await fetchSchools(true)
})

// =========================
// SUPABASE INIT (SAFE)
// =========================
function initSupabase() {
  const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
  const supabaseKey = "sb_publishable_gA0zVRQ7iYAWekG3BDrDiQ_uBcDYRe7"

  if (!window.supabase) {
    throw new Error("Supabase CDN not loaded")
  }

  supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
}

// =========================
// DOM
// =========================
let grid, searchInput, stateFilter, typeFilter, resultCount, emptyState

function initDOM() {
  grid = document.querySelector("#resultsGrid")
  searchInput = document.querySelector("#searchInput")
  stateFilter = document.querySelector("#stateFilter")
  typeFilter = document.querySelector("#typeFilter")
  resultCount = document.querySelector("#resultCount")
  emptyState = document.querySelector("#emptyState")
}

// =========================
// STATE
// =========================
let page = 0
const limit = 20
let loading = false

// =========================
// HELPERS
// =========================
const safe = (v, f = "Unknown") =>
  v?.toString().trim() || f

function formatLocation(s) {
  if (s.lga && s.state) return `${s.lga}, ${s.state}`
  if (s.state) return s.state
  return "Location not available"
}

function getLevel(levels = {}) {
  if (levels.primary) return "Primary"
  if (levels.secondary) return "Secondary"
  if (levels.tertiary) return "Tertiary"
  return "Unknown"
}

function normalize(s) {
  return {
    school_name: safe(s.school_name, "No name"),
    state: safe(s.state, ""),
    lga: safe(s.lga, ""),
    address: safe(s.address, ""),
    delivery_mode: safe(s.delivery_mode),
    ownership: safe(s.ownership),
    education_levels: s.education_levels || {}
  }
}

// =========================
// FETCH
// =========================
async function fetchSchools(reset = false) {
  if (loading) return
  loading = true

  if (reset) {
    page = 0
    grid.innerHTML = ""
    emptyState.classList.add("hidden")
  }

  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1)

  const search = searchInput.value.trim()
  const state = stateFilter.value
  const level = typeFilter.value

  // ✅ FIX 1: search
  if (search) {
    query = query.ilike("school_name", `%${search}%`)
  }

  // ✅ FIX 2: state filter
  if (state) {
    query = query.eq("state", state)
  }

  // ✅ FIX 3: education level filter (IMPORTANT FIX)
  if (level) {
    query = query.eq(`education_levels->>${level}`, "true")
  }

  const { data, error } = await query

  loading = false

  if (error) {
    console.error(error)
    return
  }

  if (!data || data.length === 0) {
    showEmpty()
    return
  }

  render(data.map(normalize))
  page++
}

// =========================
// RENDER
// =========================
function render(schools) {
  emptyState.classList.add("hidden")

  resultCount.textContent = `${grid.children.length + schools.length} schools`

  schools.forEach(s => {
    const card = document.createElement("div")
    card.className = "school-card"

    card.innerHTML = `
      <div class="card-header">
        <h2>${s.school_name}</h2>
        <span class="tag">${getLevel(s.education_levels)}</span>
      </div>

      <div class="card-body">
        <p>📍 ${formatLocation(s)}</p>

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
  emptyState.textContent = "No schools found"
}

// =========================
// EVENTS
// =========================
function initEvents() {
  searchInput.addEventListener("input", () => fetchSchools(true))
  stateFilter.addEventListener("change", () => fetchSchools(true))
  typeFilter.addEventListener("change", () => fetchSchools(true))
}
