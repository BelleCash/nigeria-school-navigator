const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
const supabaseKey = "sb_publishable_gA0zVRQ7iYAWekG3BDrDiQ_uBcDYRe7"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// =========================
// DOM ELEMENTS
// =========================
const form = document.querySelector("#searchForm")
const searchInput = document.querySelector("#searchInput")
const stateFilter = document.querySelector("#stateFilter")
const typeFilter = document.querySelector("#typeFilter")
const grid = document.querySelector("#resultsGrid")
const emptyState = document.querySelector("#emptyState")
const resultCount = document.querySelector("#resultCount")

// =========================
// STATE
// =========================
let page = 0
const limit = 20
let loading = false
let hasMore = true
let debounceTimer = null

// =========================
// 🔥 NORMALIZE DATA (CORE FIX)
// =========================
function normalizeSchool(raw) {
  return {
    school_name: raw.school_name || "No name",
    state: raw.state ? raw.state.trim() : null,
    lga: raw.lga ? raw.lga.trim() : null,
    address: raw.address || "",
    delivery_mode: raw.delivery_mode || "Unknown delivery",
    ownership:
      raw.ownership?.type ||
      raw.ownership ||
      "Unknown ownership",
    education_levels: raw.education_levels || {}
  }
}

// =========================
// LOCATION FORMATTER
// =========================
function formatLocation(school) {
  const lga = school.lga
  const state = school.state

  if (lga && state) return `${lga}, ${state}`
  if (state) return state
  if (lga) return lga

  return "Location not available"
}

// =========================
// LOADING
// =========================
function showLoading() {
  loading = true
  resultCount.textContent = "Loading..."
}

function hideLoading() {
  loading = false
}

// =========================
// DEBOUNCE
// =========================
function debounce(fn, delay = 500) {
  return (...args) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fn(...args), delay)
  }
}

// =========================
// FETCH DATA
// =========================
async function fetchSchools(reset = false) {
  if (loading) return

  showLoading()

  if (reset) {
    page = 0
    hasMore = true
    grid.innerHTML = ""
  }

  if (!hasMore) {
    hideLoading()
    return
  }

  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1)

  if (searchInput.value.trim()) {
    query = query.ilike("school_name", `%${searchInput.value.trim()}%`)
  }

  if (stateFilter.value) {
    query = query.eq("state", stateFilter.value)
  }

  if (typeFilter.value) {
    query = query.eq("lga", typeFilter.value)
  }

  const { data, error } = await query

  hideLoading()

  if (error) {
    console.error("Supabase error:", error)
    return
  }

  if (!data || data.length === 0) {
    hasMore = false
    if (page === 0) showEmptyState()
    return
  }

  renderSchools(data.map(normalizeSchool))

  page++
}

// =========================
// RENDER
// =========================
function renderSchools(schools) {
  emptyState.classList.add("hidden")

  resultCount.textContent = `${grid.children.length + schools.length} schools`

  schools.forEach(school => {
    const card = document.createElement("div")
    card.className = "school-card"

    const level =
      school.education_levels?.primary
        ? "Primary"
        : school.education_levels?.secondary
        ? "Secondary"
        : school.education_levels?.tertiary
        ? "Tertiary"
        : "Unknown"

    card.innerHTML = `
      <div class="card-header">
        <h2>${school.school_name}</h2>
        <span class="tag">${level}</span>
      </div>

      <div class="card-body">
        <p><strong>Location:</strong> 📍 ${formatLocation(school)}</p>

        ${school.address ? `<p>${school.address}</p>` : ""}

        <div class="meta-info">
          <span>${school.delivery_mode}</span>
          <span>${school.ownership}</span>
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
      <small>Try searching: "Lagos", "Secondary", or "University"</small>
    </div>
  `
}

// =========================
// EVENTS
// =========================
const debouncedSearch = debounce(() => fetchSchools(true), 600)

searchInput.addEventListener("input", debouncedSearch)
stateFilter.addEventListener("change", () => fetchSchools(true))
typeFilter.addEventListener("change", () => fetchSchools(true))

form.addEventListener("submit", e => {
  e.preventDefault()
  fetchSchools(true)
})

// =========================
// INFINITE SCROLL
// =========================
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
  ) {
    fetchSchools()
  }
})

// =========================
// INIT
// =========================
fetchSchools()
