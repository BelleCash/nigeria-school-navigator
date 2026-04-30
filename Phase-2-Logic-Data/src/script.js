import { fetchSchools } from "./data/api.js"
import { normalizeSchool } from "./logic/normalize.js"
import { filterSchools } from "./logic/filter.js"
import { renderSchools } from "./ui/render.js"

// DOM
const grid = document.querySelector("#resultsGrid")
const searchInput = document.querySelector("#searchInput")
const stateFilter = document.querySelector("#stateFilter")
const typeFilter = document.querySelector("#typeFilter")

let page = 0
const limit = 20

function formatLocation(school) {
  const lga = school.lga
  const state = school.state

  if (lga && state) return `${lga}, ${state}`
  if (state) return state
  if (lga) return lga
  return "Location not available"
}

async function load(reset = false) {
  if (reset) {
    page = 0
    grid.innerHTML = ""
  }

  const { data, error } = await fetchSchools({
    page,
    limit,
    filters: {
      search: searchInput.value,
      state: stateFilter.value,
      lga: typeFilter.value
    }
  })

  if (error) return console.error(error)

  const cleaned = data.map(normalizeSchool)

  const filtered = filterSchools(cleaned, {
    state: stateFilter.value,
    level: "",
    ownership: "",
    query: searchInput.value
  })

  renderSchools({
    grid,
    schools: filtered,
    formatLocation
  })

  page++
}

// EVENTS
searchInput.addEventListener("input", () => load(true))
stateFilter.addEventListener("change", () => load(true))
typeFilter.addEventListener("change", () => load(true))

load(true)
