/* =====================================================================
   jobPostService.js
   All network access for the Job Post form lives here.
   ==================================================================== */

import { API_BASE_URL } from "../../../config/api";

export const BASE_URL = API_BASE_URL;
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
      { id: 14, name: "question12", education_id: 21 }
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
      { id: 44, name: "rest api", industry_id: 132 }
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
  // Check for nested Industry object (for sub-industries)
  if (item.Industry && typeof item.Industry === "object" && item.Industry.id) {
    return item.Industry.id;
  }

  // Check for nested perks_benefits_category object (for perks)
  if (item.perks_benefits_category && typeof item.perks_benefits_category === "object" && item.perks_benefits_category.id) {
    return item.perks_benefits_category.id;
  }

  // Check all possible parent ID field names
  const candidates = [
    "category_id",
    "industry_id",
    "education_id",
    "education_category_id",
    "perk_category_id",
    "perk_benefit_category_id",
    "parent_id",
    "sub_category_id",
    "categoryId",
    "industryId",
    "parentId",
    "category",
    "industry"
  ];

  for (const field of candidates) {
    if (item[field] !== undefined && item[field] !== null && item[field] !== 0) {
      return item[field];
    }
  }

  return null;
}

function resolveParentId(item, config) {
  // First try the explicitly configured field
  if (config.parentIdKey) {
    const configured = item[config.parentIdKey];
    if (configured !== undefined && configured !== null && configured !== 0) {
      return configured;
    }
  }

  // Fall back to auto-detection
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
      if (Array.isArray(json.data[key])) {
        raw = json.data[key];
        break;
      }
    }
  }

  const normalized = raw.map((item) => normalizeOption(item, config)).filter(Boolean);
  return normalized.length > 0 ? normalized : (config.fallback || []);
}

/* ---------------------------------------------------------------------
   Lazy, cached lookup fetcher
   -------------------------------------------------------------------*/
const cache = {};
const inFlight = {};
let usedFallback = {};

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
   Job posting - FIXED for multiple posts
   -------------------------------------------------------------------*/

// Generate a unique title for each post to avoid duplicates
function generateUniqueTitle(baseTitle) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomId = Math.floor(Math.random() * 10000);
  return `${baseTitle} - ${timestamp}-${randomId}`;
}

export async function postJob(payload) {
  const finalPayload = { ...payload };

  // Make sure we have a job title - make it unique if not provided
  let jobTitle = finalPayload.job_title || finalPayload.title || finalPayload.jobTitle;

  if (!jobTitle || jobTitle.trim() === '') {
    jobTitle = `Job Post - ${new Date().toISOString()}`;
  }

  // Add timestamp to make title unique for each post
  const uniqueTitle = generateUniqueTitle(jobTitle);

  if (!finalPayload.job_type_id || isNaN(finalPayload.job_type_id)) {
    finalPayload.job_type_id = 11;
  }

  const cleanPayload = {
    title: uniqueTitle, // Use unique title
    job_title: uniqueTitle, // Also set job_title for compatibility
    job_type_id: finalPayload.job_type_id,
    posting_type: finalPayload.posting_type || "Permanent",
    schedule_date: finalPayload.schedule_date || new Date().toISOString(),
    expiry_date: finalPayload.expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reference_code: finalPayload.reference_code || null,
    experience_type: finalPayload.experience_type || "Experience",
    min_experience: finalPayload.min_experience || 0,
    max_experience: finalPayload.max_experience || 0,
    job_description: finalPayload.job_description || "Job description",
    auto_renew: finalPayload.auto_renew || "off",
    daily_application_summary: finalPayload.daily_application_summary !== undefined ? finalPayload.daily_application_summary : true,
    notify_matching_type: finalPayload.notify_matching_type || "All matching applicants",
    workplace_type_id: finalPayload.workplace_type_id || null,
    min_salary: finalPayload.min_salary || 0,
    max_salary: finalPayload.max_salary || 0,
    salary_confidential: finalPayload.salary_confidential || false,
    folder_name: finalPayload.folder_name || "General",
    prioritize_women: finalPayload.prioritize_women || false,
    is_status: finalPayload.is_status !== undefined ? finalPayload.is_status : true,
    is_trending: finalPayload.is_trending || false,
    company_id: finalPayload.company_id || 1,
    created_by: finalPayload.created_by || 1,
    skills: finalPayload.skills || [],
    location_id: finalPayload.location_id || [],
    perks_benefit: finalPayload.perks_benefit || [],
    industry_id: finalPayload.industry_id || [],
    sub_industry_id: finalPayload.sub_industry_id || [],
    function_role_id: finalPayload.function_role_id || [],
    education_category_id: finalPayload.education_category_id || [],
    education_sub_category_id: finalPayload.education_sub_category_id || [],
    questions: finalPayload.questions || [],
  };

  // Add contract fields if present
  if (finalPayload.currency_id) cleanPayload.currency_id = finalPayload.currency_id;
  if (finalPayload.billing_type) cleanPayload.billing_type = finalPayload.billing_type;
  if (finalPayload.contract_tenure) cleanPayload.contract_tenure = finalPayload.contract_tenure;

  console.log("📤 Posting job with unique title:", uniqueTitle);
  console.log("📤 Full payload:", JSON.stringify(cleanPayload, null, 2));

  try {
    const res = await fetch(JOB_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(cleanPayload),
    });

    const responseText = await res.text();
    let data = null;
    try { data = responseText ? JSON.parse(responseText) : null; } catch { /* not JSON */ }

    if (!res.ok) {
      let errorMessage = '';
      if (data && data.message) {
        errorMessage = data.message;
      } else if (data && data.error) {
        errorMessage = data.error;
      } else if (responseText) {
        errorMessage = responseText;
      } else {
        errorMessage = `Request failed with status ${res.status}`;
      }
      throw new Error(errorMessage);
    }

    console.log("✅ Job posted successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error posting job:", error);
    if (error.message) {
      throw error;
    }
    throw new Error("Network error - please check your connection");
  }
}

// Post multiple jobs with unique titles
export async function postJobs(payloads) {
  const succeeded = [];
  const failed = [];

  for (let i = 0; i < payloads.length; i++) {
    try {
      const payload = payloads[i];
      // Ensure each job has a unique title
      const data = await postJob(payload);
      succeeded.push({ payload, data });

      // Add a small delay between posts to avoid rate limiting
      if (i < payloads.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (err) {
      failed.push({ payload: payloads[i], error: err.message });
    }
  }

  return { succeeded, failed };
}