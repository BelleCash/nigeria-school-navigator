export function normalizeSchool(raw) {
  return {
    school_name: raw.school_name || "No name",
    state: raw.state?.trim() || null,
    lga: raw.lga?.trim() || null,
    address: raw.address || "",
    delivery_mode: raw.delivery_mode || "Unknown",
    ownership: raw.ownership?.type || raw.ownership || "Unknown",
    education_levels: raw.education_levels || {}
  }
}
