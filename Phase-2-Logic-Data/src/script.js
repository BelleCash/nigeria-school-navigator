const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
const supabaseKey = "sb_publishable_gA0zVRQ7iYAWekG3BDrDiQ_uBcDYRe7"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// DOM
const grid = document.querySelector("#resultsGrid")
const searchInput = document.querySelector("#searchInput")
const stateFilter = document.querySelector("#stateFilter")
const typeFilter = document.querySelector("#typeFilter")

let page = 0
const limit = 20
let loading = false

// FORMAT LOCATION
function formatLocation(school) {
  const lga = school.lga
  const state = school.state

  if (lga && state) return `${lga}, ${state}`
  if (state) return state
  if (lga) return lga
  return "Location not available"
}

// NORMALIZE
function normalize(s) {
  return {
    school_name: s.school_name || "No name",
    state: s.state || null,
    lga: s.lga || null,
    address: s.address || "",
    delivery_mode: s.delivery_mode || "Unknown",
    ownership: s.ownership?.type || s.ownership || "Unknown",
    education_levels: s.education_levels || {}
  }
}

// FETCH
async function fetchSchools(reset = false) {
  if (loading) return
  loading = true

  if (reset) {
    page = 0
    grid.innerHTML = ""
  }

  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1)

  if (searchInput.value) {
    query = query.ilike("school_name", `%${searchInput.value}%`)
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
    console.error(error)
    return
  }

  render(data.map(normalize))
  page++
}

// RENDER
function render(schools) {
  schools.forEach(s => {
    const card = document.createElement("div")
    card.className = "school-card"

    const level =
      s.education_levels?.primary
        ? "Primary"
        : s.education_levels?.secondary
        ? "Secondary"
        : s.education_levels?.tertiary
        ? "Tertiary"
        : "Unknown"

    card.innerHTML = `
      <div class="card-header">
        <h2>${s.school_name}</h2>
        <span class="tag">${level}</span>
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

// EVENTS
searchInput.addEventListener("input", () => fetchSchools(true))
stateFilter.addEventListener("change", () => fetchSchools(true))
typeFilter.addEventListener("change", () => fetchSchools(true))

// INIT
fetchSchools()
