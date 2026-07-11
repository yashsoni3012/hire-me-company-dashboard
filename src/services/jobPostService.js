/* =====================================================================
   jobPostService.js
   All network access for the Job Post form lives here.
   - LOOKUP_CONFIG describes every dropdown's endpoint + fallback data.
   - fetchLookup(key) is LAZY + CACHED: the first time a given dropdown
     is opened we hit the network; every subsequent open reads from the
     in-memory cache. Nothing is fetched until it's actually needed.
   - postJob(payload) posts a single job. postJobs(payloads) can post
     several job payloads (e.g. "duplicate & post" flows) one after
     another and reports success/failure per item.
   ==================================================================== */

export const BASE_URL = "https://hire-me-jobs.onrender.com";
export const JOB_POST_URL = `${BASE_URL}/job-post`;

/* ---------------------------------------------------------------------
   Lookup configuration
   -------------------------------------------------------------------*/
export const LOOKUP_CONFIG = {
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
    url: "/job-locations",
    nameKey: "City.name",
    fallback: [
      { id: 1, name: "Mumbai" }, { id: 2, name: "Pune" }, { id: 3, name: "Bengaluru" },
      { id: 4, name: "Delhi NCR" }, { id: 5, name: "Hyderabad" }, { id: 6, name: "Remote" },
    ],
  },
  currencies: {
    url: "/currencies",
    nameKey: "currency_name",
    fallback: [{ id: 1, name: "Indian Rupee" }, { id: 9, name: "Dollar" }],
  },
  educationCategories: {
    url: "/education-category/",
    nameKey: "name",
    fallback: [{ id: 21, name: "MERN Developer" }, { id: 22, name: "Node.js 123" }],
  },
  educationSubCategories: {
    url: "/education-sub-category",
    nameKey: "name",
    parentIdKey: "category_id",
    fallback: [{ id: 6, name: "BCA MERN 1", category_id: 21 }, { id: 14, name: "question12", category_id: 22 }],
  },
  industries: {
    url: "/industry",
    nameKey: "name",
    fallback: [{ id: 128, name: "Web Developer" }, { id: 130, name: "Web Designer" }],
  },
  subIndustries: {
    url: "/sub-industry",
    nameKey: "name",
    parentIdKey: "industry_id",
    fallback: [{ id: 43, name: "new industry", industry_id: 128 }, { id: 44, name: "rest api", industry_id: 130 }],
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
    fallback: [{ id: 36, name: "Health Insurance", category_id: 43 }, { id: 37, name: "Flexible Hours", category_id: 43 }],
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
   Helpers
   -------------------------------------------------------------------*/

// Tries every plausible "parent id" field name so category -> sub-category
// linking works even if the API doesn't use the exact field we configured.
function autoDetectParentId(item) {
  const candidates = [
    "category_id", "industry_id", "education_id", "education_category_id",
    "perk_category_id", "perk_benefit_category_id", "parent_id",
    "sub_category_id", "categoryId", "industryId", "parentId",
  ];
  for (const field of candidates) {
    if (item[field] !== undefined && item[field] !== null && item[field] !== 0) {
      return item[field];
    }
  }
  if (item.category && typeof item.category === "object" && item.category.id) return item.category.id;
  if (item.industry && typeof item.industry === "object" && item.industry.id) return item.industry.id;
  return null;
}

function resolveParentId(item, config) {
  // Prefer the explicitly configured field, but fall back to auto-detection
  // if that field is missing/empty on the actual API response — this is
  // what was silently breaking the Industry / Perks / Education sub-lists.
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
    name = item.City?.name;
  } else if (config.nameKey) {
    name = config.nameKey.split(".").reduce((v, k) => v?.[k], item);
  } else {
    name = item.name ?? item.title ?? item.label ?? item.skill_name ?? item.currency_name ?? item.location_name;
  }

  if (id == null || name == null) return null;

  const parentId = resolveParentId(item, config);

  return {
    id: Number(id),
    name: String(name),
    parentId: parentId !== null && parentId !== undefined ? Number(parentId) : null,
  };
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
      if (Array.isArray(json.data[key])) { raw = json.data[key]; break; }
    }
  }

  const normalized = raw.map((item) => normalizeOption(item, config)).filter(Boolean);
  return normalized.length > 0 ? normalized : (config.fallback || []);
}

/* ---------------------------------------------------------------------
   Lazy, cached lookup fetcher
   -------------------------------------------------------------------*/
const cache = {};      // key -> resolved array
const inFlight = {};    // key -> promise (so simultaneous opens don't double-fetch)
let usedFallback = {};  // key -> bool, for the "some dropdowns fell back" banner

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
      return list;
    } catch (err) {
      console.error(`Error fetching lookup "${key}":`, err);
      usedFallback[key] = true;
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

export function clearLookupCache() {
  Object.keys(cache).forEach((k) => delete cache[k]);
  usedFallback = {};
}

/* ---------------------------------------------------------------------
   Job posting
   -------------------------------------------------------------------*/

// Posts a single job payload. Throws with a readable message on failure.
export async function postJob(payload) {
  const res = await fetch(JOB_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  let data = null;
  try { data = responseText ? JSON.parse(responseText) : null; } catch { /* not JSON */ }

  if (!res.ok) {
    const detail =
      (data && (data.message || data.error)) ||
      responseText ||
      `Request failed with status ${res.status}`;
    throw new Error(detail);
  }
  return data;
}

// Posts multiple job payloads sequentially (useful for "post to several
// folders/variations at once"). Returns { succeeded: [], failed: [] }.
export async function postJobs(payloads) {
  const succeeded = [];
  const failed = [];
  for (const payload of payloads) {
    try {
      const data = await postJob(payload);
      succeeded.push({ payload, data });
    } catch (err) {
      failed.push({ payload, error: err.message });
    }
  }
  return { succeeded, failed };
}