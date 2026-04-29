// src/logic/filter.js

/**
 * Filters the school dataset based on user-selected criteria.
 * Using a "truthy" check for each filter ensures that empty 
 * inputs (like "All States") don't block the results.
 */
export function filterSchools(data, { state, level, ownership, query }) {
  return data.filter((school) => {
    // 1. Normalize and compare State (e.g., "lagos" vs "Lagos")
    const matchState = state 
      ? school.state.toLowerCase() === state.toLowerCase() 
      : true;

    // 2. Normalize and compare Education Level
    const matchLevel = level 
      ? school.education_level.toLowerCase() === level.toLowerCase() 
      : true;

    // 3. Compare Ownership (Public/Private)
    const matchOwnership = ownership 
      ? school.ownership_type.toLowerCase() === ownership.toLowerCase() 
      : true;

    // 4. Fuzzy Search for School Name
    const matchQuery = query
      ? school.school_name.toLowerCase().includes(query.toLowerCase())
      : true;

    // All conditions must be true for the school to stay in the array
    return matchState && matchLevel && matchOwnership && matchQuery;
  });
}
