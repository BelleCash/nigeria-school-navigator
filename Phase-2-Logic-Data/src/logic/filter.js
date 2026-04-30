export function filterSchools(data, { state, level, ownership, query }) {
  return data.filter((school) => {
    const schoolState = school.state?.toLowerCase() || ""
    const schoolName = school.school_name?.toLowerCase() || ""

    // Handle education_levels safely
    const schoolLevel =
      school.education_levels?.primary
        ? "primary"
        : school.education_levels?.secondary
        ? "secondary"
        : school.education_levels?.tertiary
        ? "tertiary"
        : ""

    // Handle ownership safely (string OR object)
    const schoolOwnership =
      (school.ownership?.type || school.ownership || "")
        .toLowerCase()

    // STATE FILTER
    const matchState = state
      ? schoolState === state.toLowerCase()
      : true

    // LEVEL FILTER
    const matchLevel = level
      ? schoolLevel === level.toLowerCase()
      : true

    // OWNERSHIP FILTER
    const matchOwnership = ownership
      ? schoolOwnership === ownership.toLowerCase()
      : true

    // SEARCH FILTER
    const matchQuery = query
      ? schoolName.includes(query.toLowerCase())
      : true

    return matchState && matchLevel && matchOwnership && matchQuery
  })
}
