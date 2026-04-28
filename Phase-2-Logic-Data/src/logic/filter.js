// src/logic/filter.js

export function filterSchools(data, { state, level, ownership, query }) {
  return data.filter((school) => {
    const matchState = state ? school.state === state : true;
    const matchLevel = level ? school.education_level === level : true;
    const matchOwnership = ownership ? school.ownership_type === ownership : true;

    const matchQuery = query
      ? school.school_name.toLowerCase().includes(query.toLowerCase())
      : true;

    return matchState && matchLevel && matchOwnership && matchQuery;
  });
}
