export function filterSchools(data, { state, level, ownership, query }) {
  return data.filter((school) => {
    const s = school.school_name?.toLowerCase() || ""

    const schoolLevel =
      school.education_levels?.primary
        ? "primary"
        : school.education_levels?.secondary
        ? "secondary"
        : school.education_levels?.tertiary
        ? "tertiary"
        : ""

    const matchState = state
      ? school.state?.toLowerCase() === state.toLowerCase()
      : true

    const matchLevel = level
      ? schoolLevel === level.toLowerCase()
      : true

    const matchOwnership = ownership
      ? (school.ownership || "").toLowerCase() === ownership.toLowerCase()
      : true

    const matchQuery = query
      ? s.includes(query.toLowerCase())
      : true

    return matchState && matchLevel && matchOwnership && matchQuery
  })
}
