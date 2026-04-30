export function renderSchools({ grid, schools, formatLocation }) {
  grid.innerHTML = ""

  if (!schools || schools.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        No schools found.
      </div>
    `
    return
  }

  schools.forEach((school) => {
    const card = document.createElement("div")
    card.className = "school-card"

    const level = getEducationLevel(school.education_levels)

    const name = safe(school.school_name, "No name")
    const location = safe(formatLocation(school), "Location not available")
    const delivery = safe(school.delivery_mode, "Unknown")
    const ownership = safe(school.ownership, "Unknown")

    card.innerHTML = `
      <div class="card-header">
        <h2>${name}</h2>
        <span class="tag">${level}</span>
      </div>

      <div class="card-body">
        <p><strong>Location:</strong> 📍 ${location}</p>

        ${school.address ? `<p>${school.address}</p>` : ""}

        <div class="meta-info">
          <span>${delivery}</span>
          <span>${ownership}</span>
        </div>
      </div>
    `

    grid.appendChild(card)
  })
}
