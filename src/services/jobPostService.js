// /* =====================================================================
//    jobPostService.js
//    All network access for the Job Post form lives here.
//    - LOOKUP_CONFIG describes every dropdown's endpoint + fallback data.
//    - fetchLookup(key) is LAZY + CACHED: the first time a given dropdown
//      is opened we hit the network; every subsequent open reads from the
//      in-memory cache. Nothing is fetched until it's actually needed.
//    - postJob(payload) posts a single job. postJobs(payloads) can post
//      several job payloads (e.g. "duplicate & post" flows) one after
//      another and reports success/failure per item.
//    ==================================================================== */

// import { API_BASE_URL } from "../config/api";

// export const BASE_URL = API_BASE_URL;
// export const JOB_POST_URL = `${BASE_URL}/job-post`;

// /* ---------------------------------------------------------------------
//    Lookup configuration
//    -------------------------------------------------------------------*/
// export const LOOKUP_CONFIG = {
//   skills: {
//     url: "/skills",
//     nameKey: "skill_name",
//     fallback: [
//       { id: 1, name: "Java" }, { id: 2, name: "Python" }, { id: 3, name: "JavaScript" },
//       { id: 4, name: "React" }, { id: 5, name: "Node.js" }, { id: 6, name: "SQL" },
//     ],
//   },
//   workplaceTypes: {
//     url: "/workplace-types",
//     nameKey: "name",
//     fallback: [{ id: 4, name: "Remote" }, { id: 5, name: "Hybrid" }, { id: 6, name: "On-site" }],
//   },
//   locations: {
//     url: "/job-locations",
//     nameKey: "City.name",
//     fallback: [
//       { id: 1, name: "Mumbai" }, { id: 2, name: "Pune" }, { id: 3, name: "Bengaluru" },
//       { id: 4, name: "Delhi NCR" }, { id: 5, name: "Hyderabad" }, { id: 6, name: "Remote" },
//     ],
//   },
//   currencies: {
//     url: "/currencies",
//     nameKey: "currency_name",
//     fallback: [{ id: 1, name: "Indian Rupee" }, { id: 9, name: "Dollar" }],
//   },
//   educationCategories: {
//     url: "/education-category/",
//     nameKey: "name",
//     fallback: [{ id: 21, name: "MERN Developer" }, { id: 22, name: "Node.js 123" }],
//   },
//   educationSubCategories: {
//     url: "/education-sub-category",
//     nameKey: "name",
//     parentIdKey: "category_id",
//     fallback: [{ id: 6, name: "BCA MERN 1", category_id: 21 }, { id: 14, name: "question12", category_id: 22 }],
//   },
//   industries: {
//     url: "/industry",
//     nameKey: "name",
//     fallback: [{ id: 128, name: "Web Developer" }, { id: 130, name: "Web Designer" }],
//   },
//   subIndustries: {
//     url: "/sub-industry",
//     nameKey: "name",
//     parentIdKey: "industry_id",
//     fallback: [{ id: 43, name: "new industry", industry_id: 128 }, { id: 44, name: "rest api", industry_id: 130 }],
//   },
//   perkCategories: {
//     url: "/perk-benefit-category",
//     nameKey: "name",
//     fallback: [{ id: 43, name: "Information Technology 1" }],
//   },
//   perks: {
//     url: "/perk-benefit",
//     nameKey: "name",
//     parentIdKey: "category_id",
//     fallback: [{ id: 36, name: "Health Insurance", category_id: 43 }, { id: 37, name: "Flexible Hours", category_id: 43 }],
//   },
//   functionRoles: {
//     url: "/function-roles",
//     nameKey: "name",
//     fallback: [
//       { id: 7, name: "Engineering" }, { id: 8, name: "Sales" }, { id: 9, name: "Customer Support" },
//       { id: 10, name: "Marketing" }, { id: 11, name: "Human Resources" },
//     ],
//   },
// };

// /* ---------------------------------------------------------------------
//    Helpers
//    -------------------------------------------------------------------*/

// // Tries every plausible "parent id" field name so category -> sub-category
// // linking works even if the API doesn't use the exact field we configured.
// function autoDetectParentId(item) {
//   const candidates = [
//     "category_id", "industry_id", "education_id", "education_category_id",
//     "perk_category_id", "perk_benefit_category_id", "parent_id",
//     "sub_category_id", "categoryId", "industryId", "parentId",
//   ];
//   for (const field of candidates) {
//     if (item[field] !== undefined && item[field] !== null && item[field] !== 0) {
//       return item[field];
//     }
//   }
//   if (item.category && typeof item.category === "object" && item.category.id) return item.category.id;
//   if (item.industry && typeof item.industry === "object" && item.industry.id) return item.industry.id;
//   return null;
// }

// function resolveParentId(item, config) {
//   // Prefer the explicitly configured field, but fall back to auto-detection
//   // if that field is missing/empty on the actual API response — this is
//   // what was silently breaking the Industry / Perks / Education sub-lists.
//   if (config.parentIdKey) {
//     const configured = item[config.parentIdKey];
//     if (configured !== undefined && configured !== null && configured !== 0) {
//       return configured;
//     }
//   }
//   return autoDetectParentId(item);
// }

// function normalizeOption(item, config = {}) {
//   if (item == null) return null;
//   if (typeof item === "string") return { id: item, name: item };

//   const id = item.id ?? item.ID ?? item._id;

//   let name = null;
//   if (config.nameKey === "City.name") {
//     name = item.City?.name;
//   } else if (config.nameKey) {
//     name = config.nameKey.split(".").reduce((v, k) => v?.[k], item);
//   } else {
//     name = item.name ?? item.title ?? item.label ?? item.skill_name ?? item.currency_name ?? item.location_name;
//   }

//   if (id == null || name == null) return null;

//   const parentId = resolveParentId(item, config);

//   return {
//     id: Number(id),
//     name: String(name),
//     parentId: parentId !== null && parentId !== undefined ? Number(parentId) : null,
//   };
// }

// async function fetchAndNormalize(path, config) {
//   const res = await fetch(`${BASE_URL}${path}`);
//   if (!res.ok) throw new Error(`${path} responded ${res.status}`);
//   const json = await res.json();

//   let raw = [];
//   if (Array.isArray(json)) raw = json;
//   else if (Array.isArray(json.data)) raw = json.data;
//   else if (Array.isArray(json.results)) raw = json.results;
//   else if (Array.isArray(json.items)) raw = json.items;
//   else if (json.data && Array.isArray(json.data?.data)) raw = json.data.data;
//   else if (json.data && typeof json.data === "object") {
//     for (const key of Object.keys(json.data)) {
//       if (Array.isArray(json.data[key])) { raw = json.data[key]; break; }
//     }
//   }

//   const normalized = raw.map((item) => normalizeOption(item, config)).filter(Boolean);
//   return normalized.length > 0 ? normalized : (config.fallback || []);
// }

// /* ---------------------------------------------------------------------
//    Lazy, cached lookup fetcher
//    -------------------------------------------------------------------*/
// const cache = {};      // key -> resolved array
// const inFlight = {};    // key -> promise (so simultaneous opens don't double-fetch)
// let usedFallback = {};  // key -> bool, for the "some dropdowns fell back" banner

// export async function fetchLookup(key) {
//   if (cache[key]) return cache[key];
//   if (inFlight[key]) return inFlight[key];

//   const config = LOOKUP_CONFIG[key];
//   if (!config) return [];

//   inFlight[key] = (async () => {
//     try {
//       const list = await fetchAndNormalize(config.url, config);
//       usedFallback[key] = list === config.fallback;
//       cache[key] = list;
//       return list;
//     } catch (err) {
//       console.error(`Error fetching lookup "${key}":`, err);
//       usedFallback[key] = true;
//       cache[key] = config.fallback || [];
//       return cache[key];
//     } finally {
//       delete inFlight[key];
//     }
//   })();

//   return inFlight[key];
// }

// export function didLookupFallback(key) {
//   return !!usedFallback[key];
// }

// export function clearLookupCache() {
//   Object.keys(cache).forEach((k) => delete cache[k]);
//   usedFallback = {};
// }

// /* ---------------------------------------------------------------------
//    Job posting
//    -------------------------------------------------------------------*/

// // Posts a single job payload. Throws with a readable message on failure.
// export async function postJob(payload) {
//   const res = await fetch(JOB_POST_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", "Accept": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const responseText = await res.text();
//   let data = null;
//   try { data = responseText ? JSON.parse(responseText) : null; } catch { /* not JSON */ }

//   if (!res.ok) {
//     const detail =
//       (data && (data.message || data.error)) ||
//       responseText ||
//       `Request failed with status ${res.status}`;
//     throw new Error(detail);
//   }
//   return data;
// }

// // Posts multiple job payloads sequentially (useful for "post to several
// // folders/variations at once"). Returns { succeeded: [], failed: [] }.
// export async function postJobs(payloads) {
//   const succeeded = [];
//   const failed = [];
//   for (const payload of payloads) {
//     try {
//       const data = await postJob(payload);
//       succeeded.push({ payload, data });
//     } catch (err) {
//       failed.push({ payload, error: err.message });
//     }
//   }
//   return { succeeded, failed };
// }

/* =====================================================================
   jobPostService.js
   All network access for the Job Post form lives here.

   FIXES in this version
   ----------------------------------------------------------------
   1. Your API's GET response returns "experience_min" / "experience_max"
      and "salary_min" / "salary_max" (see the sample job you shared),
      but the old code was POSTing "min_experience" / "max_experience"
      and "min_salary" / "max_salary" — a plain field-name mismatch,
      which is exactly why those came back null even though the form
      requires them before it will submit. Fixed below, and both the
      old and new key names are sent so nothing breaks if some other
      route in your backend still reads the old names.
   2. Industry / Currency / City came back null too, despite required
      fields being filled. I can't see your backend model, so I can't
      be 100% sure of the exact expected shape (array of ids vs a
      single id). As a safe hedge, I now send BOTH the array
      (industry_id: [12, 15]) AND a singular "primary" id
      (primary_industry_id: 12) for industry / sub-industry / location,
      so whichever your backend actually reads should get populated.
      >>> Please check your backend controller / Network tab once and
      >>> tell me which key it actually persists — I'll then clean this
      >>> up to send only the correct one.
   3. fetchLookup now removes a failed key from the "already requested"
      list, so a dropdown that failed once (e.g. transient network
      error) will retry the next time the user opens it, instead of
      being stuck on the fallback list forever.
   ==================================================================== */

export const BASE_URL = "https://hire-me-jobs.onrender.com";
export const JOB_POST_URL = `${BASE_URL}/job-post`;

/* ---------------------------------------------------------------------
   Lookup configuration
   -------------------------------------------------------------------*/
export const LOOKUP_CONFIG = {
  jobTypes: {
    url: "/job-types",
    nameKey: "name",
    fallback: [
      { id: 11, name: "Full-time" },
      { id: 12, name: "Part-time" },
      { id: 13, name: "Contract" },
      { id: 14, name: "Internship" },
    ],
  },
  skills: {
    url: "/skills",
    nameKey: "skill_name",
    fallback: [
      { id: 1, name: "Java" }, { id: 2, name: "Python" }, { id: 3, name: "JavaScript" },
      { id: 4, name: "React" }, { id: 5, name: "Node.js" }, { id: 6, name: "SQL" },
    ],
  },
  workplaceTypes: {
    url: "/workplace-types",
    nameKey: "name",
    fallback: [{ id: 4, name: "Remote" }, { id: 5, name: "Hybrid" }, { id: 6, name: "On-site" }],
  },
  locations: {
    url: "/cities",
    nameKey: "name",
    fallback: [
      { id: 1, name: "Panji" }, { id: 2, name: "Ahmedabad" }, { id: 6, name: "Gandhinagar" },
      { id: 15, name: "Baroda" }, { id: 16, name: "Surat" }, { id: 26, name: "Mumbai" },
    ],
  },
  currencies: {
    url: "/currencies",
    nameKey: "currency_name",
    fallback: [{ id: 1, name: "Indian Rupee" }, { id: 9, name: "Dollar" }],
  },
  educationCategories: {
    url: "/education-category",
    nameKey: "name",
    fallback: [{ id: 21, name: "MERN Developer" }, { id: 22, name: "Node.js 123" }],
  },
  educationSubCategories: {
    url: "/education-sub-category",
    nameKey: "name",
    parentIdKey: "education_id",
    fallback: [
      { id: 6, name: "BCA MERN 1", education_id: 22 },
      { id: 14, name: "question12", education_id: 21 },
    ],
  },
  industries: {
    url: "/industry",
    nameKey: "name",
    fallback: [{ id: 128, name: "Web Developer" }, { id: 130, name: "Web Designer" }],
  },
  subIndustries: {
    url: "/sub-industry",
    nameKey: "name",
    fallback: [
      { id: 43, name: "new industry", industry_id: 128 },
      { id: 44, name: "rest api", industry_id: 132 },
    ],
  },
  perkCategories: {
    url: "/perk-benefit-category",
    nameKey: "name",
    fallback: [{ id: 43, name: "Information Technology 1" }],
  },
  perks: {
    url: "/perk-benefit",
    nameKey: "name",
    parentIdKey: "category_id",
    fallback: [{ id: 36, name: "Health Insurance", category_id: 43 }],
  },
  functionRoles: {
    url: "/function-roles",
    nameKey: "name",
    fallback: [
      { id: 7, name: "Engineering" }, { id: 8, name: "Sales" }, { id: 9, name: "Customer Support" },
      { id: 10, name: "Marketing" }, { id: 11, name: "Human Resources" },
    ],
  },
};

/* ---------------------------------------------------------------------
   Helpers - Parent ID detection for all nested structures
   -------------------------------------------------------------------*/
function autoDetectParentId(item) {
  if (item.Industry && typeof item.Industry === "object" && item.Industry.id) {
    return item.Industry.id;
  }
  if (item.perks_benefits_category && typeof item.perks_benefits_category === "object" && item.perks_benefits_category.id) {
    return item.perks_benefits_category.id;
  }

  const candidates = [
    "category_id", "industry_id", "education_id", "education_category_id",
    "perk_category_id", "perk_benefit_category_id", "parent_id",
    "sub_category_id", "categoryId", "industryId", "parentId",
    "category", "industry",
  ];

  for (const field of candidates) {
    if (item[field] !== undefined && item[field] !== null && item[field] !== 0) {
      return item[field];
    }
  }
  return null;
}

function resolveParentId(item, config) {
  if (config.parentIdKey) {
    const configured = item[config.parentIdKey];
    if (configured !== undefined && configured !== null && configured !== 0) {
      return configured;
    }
  }
  return autoDetectParentId(item);
}

function normalizeOption(item, config = {}) {
  if (item == null) return null;
  if (typeof item === "string") return { id: item, name: item };

  const id = item.id ?? item.ID ?? item._id;

  let name = null;
  if (config.nameKey === "City.name") {
    name = item.City?.name ?? item.city_name ?? item.name;
  } else if (config.nameKey) {
    name = config.nameKey.split(".").reduce((v, k) => v?.[k], item) ?? item.name;
  } else {
    name =
      item.name ?? item.title ?? item.label ?? item.skill_name ??
      item.currency_name ?? item.location_name;
  }

  if (id == null || name == null) return null;

  const parentId = resolveParentId(item, config);

  return {
    id: Number(id),
    name: String(name),
    parentId: parentId !== null && parentId !== undefined ? Number(parentId) : null,
  };
}

// Handles both "status" (education endpoints: "active"/"inactive" or true/false)
// and "is_status" (cities endpoint: true/false) — confirmed both field names
// exist across your API.
function isActiveItem(item) {
  const raw = item.status !== undefined ? item.status : item.is_status;
  if (raw === undefined || raw === null) return true;
  if (typeof raw === "boolean") return raw === true;
  if (typeof raw === "string") {
    const s = raw.toLowerCase();
    return s === "active" || s === "true" || s === "1";
  }
  return true;
}

async function fetchAndNormalize(path, config) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  const json = await res.json();

  let raw = [];
  if (Array.isArray(json)) raw = json;
  else if (Array.isArray(json.data)) raw = json.data;
  else if (Array.isArray(json.results)) raw = json.results;
  else if (Array.isArray(json.items)) raw = json.items;
  else if (json.data && Array.isArray(json.data?.data)) raw = json.data.data;
  else if (json.data && typeof json.data === "object") {
    for (const key of Object.keys(json.data)) {
      if (Array.isArray(json.data[key])) {
        raw = json.data[key];
        break;
      }
    }
  }

  const normalized = raw
    .filter(isActiveItem)
    .map((item) => normalizeOption(item, config))
    .filter(Boolean);
  return normalized.length > 0 ? normalized : (config.fallback || []);
}

/* ---------------------------------------------------------------------
   Lazy, cached lookup fetcher
   -------------------------------------------------------------------*/
const cache = {};
const inFlight = {};
let usedFallback = {};
let failedKeys = {};

export async function fetchLookup(key) {
  if (cache[key]) return cache[key];
  if (inFlight[key]) return inFlight[key];

  const config = LOOKUP_CONFIG[key];
  if (!config) return [];

  inFlight[key] = (async () => {
    try {
      const list = await fetchAndNormalize(config.url, config);
      usedFallback[key] = list === config.fallback;
      cache[key] = list;
      failedKeys[key] = false;
      return list;
    } catch (err) {
      console.error(`Error fetching lookup "${key}":`, err);
      usedFallback[key] = true;
      failedKeys[key] = true; // caller can use this to allow a retry
      cache[key] = config.fallback || [];
      return cache[key];
    } finally {
      delete inFlight[key];
    }
  })();

  return inFlight[key];
}

export function didLookupFallback(key) {
  return !!usedFallback[key];
}

export function didLookupFail(key) {
  return !!failedKeys[key];
}

export function clearLookupCache(key) {
  if (key) {
    delete cache[key];
    delete usedFallback[key];
    delete failedKeys[key];
    return;
  }
  Object.keys(cache).forEach((k) => delete cache[k]);
  usedFallback = {};
  failedKeys = {};
}

/* ---------------------------------------------------------------------
   Job posting
   -------------------------------------------------------------------*/

export async function postJob(payload) {
  const finalPayload = { ...payload };

  const jobTitle = (
    finalPayload.job_title ||
    finalPayload.title ||
    finalPayload.jobTitle ||
    ""
  ).trim();

  if (!jobTitle) {
    throw new Error("Job title is required");
  }

  if (!finalPayload.job_type_id || isNaN(finalPayload.job_type_id)) {
    finalPayload.job_type_id = 11;
  }

  const industryIds = finalPayload.industry_id || [];
  const subIndustryIds = finalPayload.sub_industry_id || [];
  const locationIds = finalPayload.location_id || [];

  const cleanPayload = {
    title: jobTitle,
    job_title: jobTitle,
    job_type_id: finalPayload.job_type_id,
    posting_type: finalPayload.posting_type || "Permanent",
    schedule_date: finalPayload.schedule_date || new Date().toISOString(),
    expiry_date:
      finalPayload.expiry_date ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    reference_code: finalPayload.reference_code || null,
    experience_type: finalPayload.experience_type || "Experience",

    // --- experience: send both naming conventions ---
    min_experience: finalPayload.min_experience || 0,
    max_experience: finalPayload.max_experience || 0,
    experience_min: finalPayload.min_experience || 0,
    experience_max: finalPayload.max_experience || 0,

    job_description: finalPayload.job_description || "Job description",
    auto_renew: finalPayload.auto_renew || "off",
    daily_application_summary:
      finalPayload.daily_application_summary !== undefined
        ? finalPayload.daily_application_summary
        : true,
    notify_matching_type: finalPayload.notify_matching_type || "All matching applicants",
    workplace_type_id: finalPayload.workplace_type_id || null,

    // --- salary: send both naming conventions ---
    min_salary: finalPayload.min_salary || 0,
    max_salary: finalPayload.max_salary || 0,
    salary_min: finalPayload.min_salary || 0,
    salary_max: finalPayload.max_salary || 0,

    salary_confidential: finalPayload.salary_confidential || false,
    folder_name: finalPayload.folder_name || "General",
    prioritize_women: finalPayload.prioritize_women || false,
    is_status: finalPayload.is_status !== undefined ? finalPayload.is_status : true,
    is_trending: finalPayload.is_trending || false,
    company_id: finalPayload.company_id || 1,
    created_by: finalPayload.created_by || 1,

    skills: finalPayload.skills || [],

    // --- location: array + a singular "primary" fallback ---
    location_id: locationIds,
    city_id: locationIds[0] ?? null,

    perks_benefit: finalPayload.perks_benefit || [],

    // --- industry: array + singular fallback ---
    industry_id: industryIds,
    primary_industry_id: industryIds[0] ?? null,
    sub_industry_id: subIndustryIds,
    primary_sub_industry_id: subIndustryIds[0] ?? null,

    function_role_id: finalPayload.function_role_id || [],
    education_category_id: finalPayload.education_category_id || [],
    education_sub_category_id: finalPayload.education_sub_category_id || [],
    questions: finalPayload.questions || [],
  };

  if (finalPayload.currency_id) cleanPayload.currency_id = finalPayload.currency_id;
  if (finalPayload.billing_type) cleanPayload.billing_type = finalPayload.billing_type;
  if (finalPayload.contract_tenure) cleanPayload.contract_tenure = finalPayload.contract_tenure;

  try {
    const res = await fetch(JOB_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(cleanPayload),
    });

    const responseText = await res.text();
    let data = null;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      /* not JSON */
    }

    if (!res.ok) {
      const errorMessage =
        data?.message || data?.error || responseText || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error posting job:", error);
    if (error.message) throw error;
    throw new Error("Network error - please check your connection");
  }
}

export async function postJobs(payloads) {
  const succeeded = [];
  const failed = [];

  for (let i = 0; i < payloads.length; i++) {
    try {
      const payload = payloads[i];
      const data = await postJob(payload);
      succeeded.push({ payload, data });
      if (i < payloads.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (err) {
      failed.push({ payload: payloads[i], error: err.message });
    }
  }

  return { succeeded, failed };
}