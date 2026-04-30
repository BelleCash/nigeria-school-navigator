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
// STATE MANAGEMENT
// =========================
let page = 0
const limit = 20
let loading = false
let hasMore = true
let debounceTimer = null

// =========================
// LOADING UI
// =========================
function showLoading() {
  loading = true
  resultCount.textContent = "Loading..."
}

function hideLoading() {
  loading = false
}

// =========================
// DEBOUNCE FUNCTION
// =========================
function debounce(fn, delay = 500) {
  return (...args) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fn(...args), delay)
  }
}

// =========================
// FETCH DATA (PAGINATION + FILTERS)
// =========================
async function fetchSchools(reset = false) {
  if (loading) return

  showLoading()

  if (reset) {
    page = 0
    hasMore = true
    grid.innerHTML = ""
  }

  if (!hasMore) return

  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1)

  // SEARCH FILTER
  if (searchInput.value) {
    query = query.ilike("school_name", `%${searchInput.value}%`)
  }

  // STATE FILTER
  if (stateFilter.value) {
    query = query.eq("state", stateFilter.value)
  }

  // LGA FILTER (NEW FEATURE)
  if (typeFilter.value) {
    query = query.eq("lga", typeFilter.value)
  }

  const { data, error } = await query

  hideLoading()

  if (error) {
    console.error(error)
    return
  }

  if (!data || data.length === 0) {
    hasMore = false

    if (page === 0) {
      showEmptyState()
    }
    return
  }

  renderSchools(data)

  page++
}

// =========================
// RENDER FUNCTION
// =========================
function renderSchools(schools) {
  emptyState.classList.add("hidden")

  resultCount.textContent = `${grid.children.length + schools.length} schools`

  schools.forEach((school) => {
    const card = document.createElement("div")
    card.className = "school-card"

    card.innerHTML = `
      <div class="card-header">
        <h2>${school.school_name || "No name"}</h2>
        <span class="tag">
          ${
            school.education_levels?.primary ? "Primary" :
            school.education_levels?.secondary ? "Secondary" :
            "Tertiary"
          }
        </span>
      </div>

      <div class="card-body">
        <p><strong>Location:</strong> ${school.lga || "N/A"}, ${school.state || "N/A"}</p>
        <p>${school.address || ""}</p>

        <div class="meta-info">
          <span>${school.delivery_mode || "Unknown"}</span>
          <span>${school.ownership?.type || "Unknown"}</span>
        </div>
      </div>
    `

    grid.appendChild(card)
  })
}

// =========================
// EMPTY STATE + SMART SUGGESTIONS
// =========================
function showEmptyState() {
  emptyState.classList.remove("hidden")

  emptyState.innerHTML = `
    <div>
      <p>No schools found 😕</p>
      <small>Try searching: "Lagos", "University", or "Secondary"</small>
    </div>
  `
}

// =========================
// DEBOUNCED SEARCH
// =========================
const debouncedSearch = debounce(() => fetchSchools(true), 600)

// =========================
// EVENTS
// =========================
searchInput.addEventListener("input", debouncedSearch)
stateFilter.addEventListener("change", () => fetchSchools(true))
typeFilter.addEventListener("change", () => fetchSchools(true))

form.addEventListener("submit", (e) => {
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
// INITIAL LOAD
// =========================
fetchSchools()
