const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
const supabaseKey = "sb_publishable_gA0zVRQ7iYAWekG3BDrDiQ_uBcDYRe7"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// DOM
const form = document.querySelector("#searchForm")
const searchInput = document.querySelector("#searchInput")
const stateFilter = document.querySelector("#stateFilter")
const typeFilter = document.querySelector("#typeFilter")
const grid = document.querySelector("#resultsGrid")
const emptyState = document.querySelector("#emptyState")
const resultCount = document.querySelector("#resultCount")

// =========================
// FETCH FROM SUPABASE
// =========================
async function fetchSchools() {
  let query = supabase.from("nigeria_data").select("*").limit(50)

  // SEARCH FILTER
  if (searchInput.value) {
    query = query.ilike("school_name", `%${searchInput.value}%`)
  }

  // STATE FILTER
  if (stateFilter.value) {
    query = query.eq("state", stateFilter.value)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching:", error)
    return
  }

  renderSchools(data)
}

// =========================
// RENDER
// =========================
function renderSchools(schools) {
  grid.innerHTML = ""

  resultCount.textContent = `${schools.length} schools found`

  if (!schools || schools.length === 0) {
    emptyState.classList.remove("hidden")
    return
  }

  emptyState.classList.add("hidden")

  schools.forEach((school) => {
    const card = document.createElement("div")
    card.className = "school-card"

    card.innerHTML = `
      <div class="card-header">
        <h2 class="school-name">${school.school_name || "No name"}</h2>
        <span class="tag">
          ${school.education_levels?.primary ? "Primary" :
            school.education_levels?.secondary ? "Secondary" :
            "Tertiary"}
        </span>
      </div>

      <div class="card-body">
        <p><strong>Location:</strong> ${school.lga || "N/A"}, ${school.state || "N/A"}</p>
        <p>${school.address || ""}</p>

        <div class="meta-info">
          <span class="type-badge">${school.delivery_mode || "Unknown"}</span>
          <span class="ownership-badge">${school.ownership?.type || "Unknown"}</span>
        </div>
      </div>
    `

    grid.appendChild(card)
  })
}

// =========================
// EVENTS
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault()
  fetchSchools()
})

searchInput.addEventListener("input", fetchSchools)
stateFilter.addEventListener("change", fetchSchools)
typeFilter.addEventListener("change", fetchSchools)

// =========================
// INITIAL LOAD
// =========================
fetchSchools()
