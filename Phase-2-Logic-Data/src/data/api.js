const supabaseUrl = "https://rjqrdgdcnotxrwpvhxzp.supabase.co"
const supabaseKey = "sb_publishable_gA0zVRQ7iYAWekG3BDrDiQ_uBcDYRe7"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

export async function fetchSchools({ page, limit, filters }) {
  let query = supabase
    .from("nigeria_data")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1)

  if (filters.search) {
    query = query.ilike("school_name", `%${filters.search}%`)
  }

  if (filters.state) {
    query = query.eq("state", filters.state)
  }

  if (filters.lga) {
    query = query.eq("lga", filters.lga)
  }

  return await query
}
