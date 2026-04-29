export type NigeriaDataRow = {
  id: string
  created_at: string

  school_name: string | null
  address: string | null
  state: string | null
  lga: string | null

  education_levels: {
    primary: boolean
    secondary: {
      junior_secondary: boolean
      senior_secondary: boolean
    }
    tertiary: {
      university: string | null
      polytechnic: boolean
      college_of_education: boolean
      college_of_agriculture: boolean
      monotechnic: boolean
      technical_institute: boolean
      vocational_school: boolean
      tech_academy: boolean
    }
  } | null

  delivery_mode: string | null

  digital_learning: {
    has_e_learning_platform: boolean | null
    lms_type: string | null
    supports_odl: boolean | null
    virtual_classrooms: string | null
    digital_exams_supported: boolean | null
  } | null

  accreditation: {
    government_approved: boolean | null
    accreditation_body: string | null
    accreditation_status: string | null
    license_number: string | null
  } | null

  ownership: {
    type: string | null
    parent_institution: string | null
    partner_universities: string[]
    international_affiliations: string[]
    religious_body_affiliation: string | null
    professional_bodies: string[]
  } | null

  infrastructure: {
    internet_available: string | boolean | null
    computer_lab_available: boolean | null
    library_available: boolean | null
    electricity_reliability: string | null
    boarding_facility: boolean | null
    transport_accessibility: string | null
  } | null

  geo: {
    latitude: number | null
    longitude: number | null
    urban_rural_classification: string | null
    accessibility_score: number | null
  } | null

  cost: {
    tuition_level: string | null
    scholarship_available: boolean | null
    government_subsidized: boolean | null
  } | null

  special_programs: {
    stem_focus: boolean | null
    tech_skills_training: boolean | null
    entrepreneurship_programs: boolean | null
    arts_and_creative_programs: boolean | null
    religious_studies: boolean | null
    sports_academy: boolean | null
    special_needs_support: boolean | null
  } | null

  data_quality: {
    data_source: string | null
    last_verified_date: string | null
    verification_status: string | null
    confidence_score: number | null
  } | null
}
