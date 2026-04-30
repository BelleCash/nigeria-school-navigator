export function normalizeSchool(raw) {
  return {
    school_name: safeString(raw.school_name, "No name"),

    state: safeString(raw.state),
    lga: safeString(raw.lga),
    address: safeString(raw.address),

    delivery_mode: safeString(raw.delivery_mode, "Unknown"),

    // FIXED: handles object OR string OR null safely
    ownership: normalizeOwnership(raw.ownership),

    education_levels: raw.education_levels ?? {}
  }
}

// -------------------------
// Helpers (clean architecture)
// -------------------------

function safeString(value, fallback = "") {
  if (!value) return fallback
  return String(value).trim() || fallback
}

function normalizeOwnership(value) {
  if (!value) return "Unknown"

  if (typeof value === "string") {
    return value.trim() || "Unknown"
  }

  if (typeof value === "object") {
    return (
      value.type?.trim() ||
      value.category?.trim() ||
      value.name?.trim() ||
      "Unknown"
    )
  }

  return "Unknown"
}
