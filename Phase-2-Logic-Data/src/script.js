// =========================
// SUPABASE INIT (FIXED)
// =========================
const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
const supabaseKey = "sb_publishable_gA0zVRQ7iYAWekG3BDrDiQ_uBcDYRe7"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// =========================
// DOM
// =========================
const grid = document.querySelector("#resultsGrid")
const searchInput = document.querySelector("#searchInput")
const stateFilter = document.querySelector("#stateFilter")
const typeFilter = document.querySelector("#typeFilter")
const resultCount = document.querySelector("#resultCount")
const emptyState = document.querySelector("#emptyState")

// =========================
// STATE
// =========================
let page = 0
const limit = 20
let loading = false

// =========================
// SAFE HELPERS
// =========================
function safe(value, fallback = "Unknown") {
  return value?.toString().trim() || fallback
}

function normalizeOwnership(value) {
  if (!value) return "Unknown"

  if (typeof value === "string") {
    return value.trim() || "Unknown"
  }

  if (typeof value === "object") {
    return (
      value.type ||
      value.category ||
      value.name ||
      "Unknown"
    )
  }

  return "Unknown"
}

function getEducationLevel(levels = {}) {
  if (levels.primary === true) return "Primary"
  if (levels.secondary === true) return "Secondary"
  if (levels.tertiary === true) return "Tertiary"
  return "Unknown"
}

function formatLocation(school) {
  const lga = school.lga?.trim()
  const state = school.state?.trim()

  if (lga && state) return `${lga}, ${state}`
  if (state) return state
  if (lga) return lga

  return "Location not available"
}

// =========================
// NORMALIZE (CRITICAL FIX)
// =========================
function normalize(s) {
  return {
    school_name: safe(s.school_name, "No name"),
    state: safe(s.state, ""),
    lga: safe(s.lga, ""),
    address: safe(s.address, ""),
    delivery_mode: safe(s.delivery_mode),
    ownership: normalizeOwnership(s.ownership),
    education_levels: s.education_levels || {}
  }
}

// =========================
// FETCH DATA
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

  if (search) {
    query = query.ilike("school_name", `%${search}%`)
  }

  if (stateFilter.value) {
    query = query.eq("state", stateFilter.value)
  }

  if (typeFilter.value) {
    query = query.eq("lga", typeFilter.value)
  }

  const { data, error } = await query

  loading = false

  if (error) {
    console.error("Supabase error:", error)
    return
  }

  if (!data?.length) {
    if (page === 0) showEmptyState()
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

  schools.forEach((s) => {
    const card = document.createElement("div")
    card.className = "school-card"

    const level = getEducationLevel(s.education_levels)

    const location = formatLocation(s)

    card.innerHTML = `
      <div class="card-header">
        <h2>${s.school_name}</h2>
        <span class="tag">${level}</span>
      </div>

      <div class="card-body">
        <p><strong>Location:</strong> 📍 ${location}</p>

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
function showEmptyState() {
  emptyState.classList.remove("hidden")
  emptyState.innerHTML = `
    <div>
      <p>No schools found</p>
      <small>Try adjusting filters or search terms</small>
    </div>
  `
}

// =========================
// EVENTS
// =========================
searchInput.addEventListener("input", () => fetchSchools(true))
stateFilter.addEventListener("change", () => fetchSchools(true))
typeFilter.addEventListener("change", () => fetchSchools(true))

// =========================
// INIT
// =========================
fetchSchools()
