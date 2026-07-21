// jobEditService.js - UPDATED TO MATCH API RESPONSE
export const BASE_URL = "https://hire-me-jobs.onrender.com";
export const JOBS_URL = `${BASE_URL}/jobs`;
export const JOB_POST_URL = `${BASE_URL}/job-post`;

// Lookup configuration (unchanged)
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
  billingRates: {
    url: "/billing-rates",
    nameKey: "display_text",
    fallback: [
      { id: 1, name: "₹5,000" }, { id: 2, name: "₹8,000" }, { id: 3, name: "₹12,000" },
    ],
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

// Cache for lookups (unchanged)
const cache = {};
const inFlight = {};
let usedFallback = {};
let failedKeys = {};

// Helper functions (unchanged)
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
      item.currency_name ?? item.location_name ?? item.display_text;
  }

  if (id == null || name == null) return null;

  const parentId = resolveParentId(item, config);

  return {
    id: Number(id),
    name: String(name),
    parentId: parentId !== null && parentId !== undefined ? Number(parentId) : null,
  };
}

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
  try {
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
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return config.fallback || [];
  }
}

// Lazy, cached lookup fetcher (unchanged)
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
      failedKeys[key] = true;
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

// Fetch job by ID - UPDATED to match API response
export async function fetchJobById(id) {
  try {
    const response = await fetch(`${JOBS_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // Extract job data from response - API returns { success, count, data: [...] }
    let jobData = result;
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      jobData = result.data[0];
    } else if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
      jobData = result.data;
    }

    // Transform API response to form format
    return transformJobToForm(jobData);
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

// Transform API job data to form format - UPDATED to match actual API fields
function transformJobToForm(job) {
  // Helper to extract IDs from nested objects
  const extractIdFromObject = (obj) => {
    if (!obj) return null;
    if (typeof obj === 'object' && obj !== null) {
      return obj.id || obj.ID || obj._id || null;
    }
    return obj;
  };

  // Helper to extract name from nested object
  const extractNameFromObject = (obj) => {
    if (!obj) return null;
    if (typeof obj === 'object' && obj !== null) {
      return obj.name || obj.display_text || null;
    }
    return obj;
  };

  // Determine experience mode from API fields
  const experienceMode = 
    job.experience_type === "fresher" || 
    (job.experience_min === 0 && job.experience_max === 0)
      ? "fresher" 
      : "experienced";

  // Determine status from is_status boolean
  let status = "draft";
  if (job.is_status === true || job.is_status === 1) {
    status = "active";
  } else if (job.is_status === false || job.is_status === 0) {
    status = "closed";
  }

  // Extract questions (if any)
  let questions = [];
  if (job.questions && Array.isArray(job.questions)) {
    questions = job.questions.map((q) => ({
      question: q.question || "",
      question_type: q.question_type || "text",
      text_placeholder: q.text_placeholder || "",
      mcq_options: q.mcq_options || [],
      is_required: q.is_required || false,
    }));
  }

  return {
    jobTitle: job.title || "",
    showReferenceCode: !!job.reference_code,
    referenceCode: job.reference_code || "",
    postingType: job.posting_type || "Permanent",
    jobType: extractIdFromObject(job.JobType),
    experienceMode: experienceMode,
    minExperience: job.experience_min || 0,
    maxExperience: job.experience_max || 0,
    jobDescription: job.job_description || "",
    prioritizeWomen: job.prioritize_women || false,
    skills: job.skills ? (Array.isArray(job.skills) ? job.skills : []) : [],
    workplaceType: extractIdFromObject(job.WorkplaceType),
    locations: job.City ? [extractIdFromObject(job.City)] : [],
    minSalary: parseFloat(job.salary_min) || 0,
    maxSalary: parseFloat(job.salary_max) || 0,
    salaryConfidential: job.salary_confidential || false,
    perkCategoryIds: job.perk_categories || [],
    perkIds: job.perks || [],
    industryIds: job.Industry ? [extractIdFromObject(job.Industry)] : [],
    subIndustryIds: job.sub_industries || [],
    functionRoles: job.FunctionRole ? [extractIdFromObject(job.FunctionRole)] : [],
    educationCategoryIds: job.education_categories || [],
    educationSubCategoryIds: job.education_sub_categories || [],
    folderName: job.folder_path || "General",
    addQuestionnaire: questions.length > 0,
    questions: questions,
    status: status,
    isTrending: job.is_trending || false,
    autoRenew: job.auto_renew || "off",
    dailyApplicationSummary: job.daily_application_summary !== undefined ? job.daily_application_summary : true,
    individualApplications: job.notify_matching_type !== "None",
    notifyMatchingType: job.notify_matching_type || "All matching applicants",
    expiryDate: job.expiry_date || "",
    // Contract fields
    currency: extractIdFromObject(job.Currency),
    billingType: job.billing_type || "monthly",
    minBillingRate: extractIdFromObject(job.MinBillingRate),
    maxBillingRate: extractIdFromObject(job.MaxBillingRate),
    billingRateConfidential: job.keep_billing_rate_confidential || false,
    contractTenure: job.contract_tenure || "",
    // Additional fields for display
    companyName: job.Company?.company_name || "N/A",
    locationName: job.City?.name || "N/A",
    industryName: job.Industry?.name || "N/A",
    jobTypeName: job.JobType?.name || "N/A",
    workplaceTypeName: job.WorkplaceType?.name || "N/A",
    functionRoleName: job.FunctionRole?.name || "N/A",
    applicationCount: job.application_count || 0,
    viewCount: job.view_count || 0,
  };
}

// Update job - UPDATED to match API expectations
export async function updateJob(payload) {
  const jobId = payload.id;
  if (!jobId) {
    throw new Error("Job ID is required for update");
  }

  // Remove id from payload for the request body
  const { id, ...updateData } = payload;

  // Map form fields to API expected fields
  const apiPayload = {
    title: updateData.title,
    experience_min: updateData.min_experience || 0,
    experience_max: updateData.max_experience || 0,
    salary_min: updateData.min_salary || 0,
    salary_max: updateData.max_salary || 0,
    job_description: updateData.job_description || "",
    expiry_date: updateData.expiry_date || "",
    reference_code: updateData.reference_code || null,
    posting_type: updateData.posting_type || "permanent",
    experience_type: updateData.experience_type || "experience",
    is_status: updateData.is_status !== undefined ? updateData.is_status : true,
    is_trending: updateData.is_trending || false,
    salary_confidential: updateData.salary_confidential || false,
    prioritize_women: updateData.prioritize_women || false,
    auto_renew: updateData.auto_renew || "off",
    daily_application_summary: updateData.daily_application_summary !== undefined ? updateData.daily_application_summary : true,
    notify_matching_type: updateData.notify_matching_type || "All matching applicants",
    folder_path: updateData.folder_name || null,
    // Nested objects for relations
    job_type_id: updateData.job_type_id || null,
    workplace_type_id: updateData.workplace_type_id || null,
    city_id: updateData.location_id && updateData.location_id.length > 0 ? updateData.location_id[0] : null,
    industry_id: updateData.industry_id && updateData.industry_id.length > 0 ? updateData.industry_id[0] : null,
    function_role_id: updateData.function_role_id && updateData.function_role_id.length > 0 ? updateData.function_role_id[0] : null,
    currency_id: updateData.currency_id || null,
    billing_type: updateData.billing_type || null,
    contract_tenure: updateData.contract_tenure || null,
    // Arrays
    skills: updateData.skills || [],
    location_id: updateData.location_id || [],
    perks_benefit: updateData.perks_benefit || [],
    industry_id: updateData.industry_id || [],
    sub_industry_id: updateData.sub_industry_id || [],
    function_role_id: updateData.function_role_id || [],
    education_category_id: updateData.education_category_id || [],
    education_sub_category_id: updateData.education_sub_category_id || [],
    questions: updateData.questions || [],
  };

  // Log what we're sending for debugging
  console.log("Updating job with API payload:", apiPayload);

  try {
    // Primary endpoint: PUT /jobs/:id
    const response = await fetch(`${JOBS_URL}/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(apiPayload),
    });

    if (response.ok) {
      const responseText = await response.text();
      try {
        return responseText ? JSON.parse(responseText) : { success: true };
      } catch {
        return { success: true };
      }
    }

    // If primary fails, try to get error message
    let errorMessage = `Failed to update job: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    // Fallback: Try PATCH instead of PUT
    console.log("PUT failed, trying PATCH...");
    const patchResponse = await fetch(`${JOBS_URL}/${jobId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(apiPayload),
    });

    if (patchResponse.ok) {
      const responseText = await patchResponse.text();
      try {
        return responseText ? JSON.parse(responseText) : { success: true };
      } catch {
        return { success: true };
      }
    }

    // If PATCH also fails, try job-post endpoint
    console.log("PATCH failed, trying job-post endpoint...");
    const altResponse = await fetch(`${JOB_POST_URL}/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(apiPayload),
    });

    if (!altResponse.ok) {
      let detail = "";
      try {
        const errJson = await altResponse.json();
        detail = errJson.message || errJson.error || JSON.stringify(errJson);
      } catch {
        detail = `Failed to update job: ${altResponse.status}`;
      }
      throw new Error(detail);
    }

    const altText = await altResponse.text();
    try {
      return altText ? JSON.parse(altText) : { success: true };
    } catch {
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

// Get applicant count for a job
export async function getApplicantCount(jobId) {
  try {
    const response = await fetch(
      `${BASE_URL}/candidate-profile-job-application?job_id=${jobId}`
    );
    if (!response.ok) {
      return 0;
    }
    const result = await response.json();
    return result?.count || 0;
  } catch (error) {
    console.error(`Error fetching applicants for job ${jobId}:`, error);
    return 0;
  }
}

// Get all jobs (for list view)
export async function getAllJobs() {
  try {
    const response = await fetch(JOBS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    throw error;
  }
}