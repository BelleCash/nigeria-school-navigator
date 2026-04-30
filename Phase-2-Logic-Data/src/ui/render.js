export function renderSchools({ grid, schools, formatLocation }) {
  grid.innerHTML = ""

  schools.forEach((school) => {
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
