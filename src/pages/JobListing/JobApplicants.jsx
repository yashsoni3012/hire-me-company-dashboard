// import React, { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   TbArrowLeft,
//   TbUser,
//   TbMail,
//   TbPhone,
//   TbCalendar,
//   TbSearch,
//   TbRefresh,
//   TbX,
//   TbBriefcase,
//   TbSchool,
//   TbCertificate,
//   TbAward,
//   TbLink,
//   TbFolder,
//   TbChevronLeft,
//   TbChevronRight,
//   TbChevronsLeft,
//   TbChevronsRight,
//   TbUsers,
//   TbCircleCheck,
//   TbBuildingSkyscraper,
//   TbMapPin,
//   TbCurrencyRupee,
//   TbFileText,
//   TbBrandLinkedin,
//   TbMessage,
//   TbFolderSymlink,
//   TbHeart,
//   TbHeartFilled,
//   TbBrandWhatsapp,
//   TbMessageCircle,
//   TbClock,
//   TbEye,
//   TbSparkles,
// } from "react-icons/tb";
// import { useToast } from "../../context/ToastContext";
// import { useAuth } from "../../context/AuthContext"; // <-- import AuthContext

// // ---------------------------------------------------------------------------
// // API Service
// // ---------------------------------------------------------------------------
// const API_BASE_URL = "https://hire-me-jobs.onrender.com";

// const applicantsApiService = {
//   getApplicantsByJobId: async (jobId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-profile-job-application?job_id=${jobId}`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   },
//   getCandidateFullProfile: async (candidateId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-full-profile/${candidateId}`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   },
//   // New: Log resume download
//   logResumeDownload: async (data) => {
//     const response = await fetch(`${API_BASE_URL}/resume-download-logs`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   },
// };

// // ---------------------------------------------------------------------------
// // Helpers (same as before)
// // ---------------------------------------------------------------------------
// const asName = (val, fallback = "N/A") => {
//   if (!val) return fallback;
//   if (typeof val === "string" || typeof val === "number") return String(val);
//   if (typeof val === "object" && val.name) return val.name;
//   return fallback;
// };

// const asList = (val) => {
//   if (!val) return [];
//   return Array.isArray(val) ? val : [val];
// };

// const formatDate = (dateString, withTime = false) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "N/A";
//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
//   });
// };

// const initials = (first, last) => {
//   const a = (first || "").trim().charAt(0);
//   const b = (last || "").trim().charAt(0);
//   const combined = `${a}${b}`.toUpperCase();
//   return combined || "?";
// };

// const formatMonthYear = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "";
//   return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
// };

// const durationFromDates = (start, end) => {
//   if (!start) return "";
//   const startDate = new Date(start);
//   const endDate = end ? new Date(end) : new Date();
//   if (isNaN(startDate.getTime())) return "";
//   let months =
//     (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//     (endDate.getMonth() - startDate.getMonth());
//   if (months < 0) months = 0;
//   const years = Math.floor(months / 12);
//   const remMonths = months % 12;
//   if (years === 0) return `${remMonths}m`;
//   if (remMonths === 0) return `${years}y`;
//   return `${years}y ${remMonths}m`;
// };

// const formatSalaryLac = (amount) => {
//   const num = Number(amount);
//   if (!num || isNaN(num)) return null;
//   const lac = num / 100000;
//   const formatted = lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1);
//   return `₹ ${formatted} Lac`;
// };

// const isRecentlyApplied = (dateString, days = 3) => {
//   if (!dateString) return false;
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return false;
//   const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
//   return diffDays <= days;
// };

// // ---------------------------------------------------------------------------
// // Reusable bits (same)
// // ---------------------------------------------------------------------------
// const StatusBadge = ({ status }) => {
//   const normalized = (status || "").toLowerCase();
//   const colors = {
//     active: "bg-green-50 text-green-700 border-green-200",
//     inactive: "bg-red-50 text-red-700 border-red-200",
//     pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
//     shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
//     rejected: "bg-red-50 text-red-700 border-red-200",
//   };
//   const cls = colors[normalized] || "bg-gray-50 text-gray-700 border-gray-200";
//   return (
//     <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
//       {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
//     </span>
//   );
// };

// const SectionCard = ({ icon: Icon, title, count, children }) => (
//   <div className="bg-white rounded-xl border border-gray-200 p-5">
//     <div className="flex items-center gap-2 mb-4">
//       <div className="p-1.5 bg-purple-50 rounded-lg">
//         <Icon className="text-purple-600" size={18} />
//       </div>
//       <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
//       {typeof count === "number" && (
//         <span className="text-xs text-gray-400">({count})</span>
//       )}
//     </div>
//     {children}
//   </div>
// );

// const EmptyRow = ({ label }) => (
//   <p className="text-sm text-gray-400 italic">No {label} added yet</p>
// );

// const HighlightedText = ({ text, terms = [] }) => {
//   if (!text) return null;
//   if (!terms.length) return <>{text}</>;
//   const pattern = new RegExp(`(${terms.filter(Boolean).join("|")})`, "gi");
//   const parts = text.split(pattern);
//   return (
//     <>
//       {parts.map((part, i) =>
//         terms.some((t) => t && t.toLowerCase() === part.toLowerCase()) ? (
//           <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
//             {part}
//           </mark>
//         ) : (
//           <React.Fragment key={i}>{part}</React.Fragment>
//         )
//       )}
//     </>
//   );
// };

// const SkillChip = ({ label, highlighted }) => (
//   <span
//     className={`text-sm ${
//       highlighted
//         ? "bg-yellow-200 text-gray-900 font-medium px-1 rounded"
//         : "text-gray-700"
//     }`}
//   >
//     {label}
//   </span>
// );

// // ---------------------------------------------------------------------------
// // Candidate Card (with Resume button in top-right corner)
// // ---------------------------------------------------------------------------
// const CandidateCard = ({
//   applicant,
//   onCardClick,
//   onToggleFavourite,
//   jobSkillTerms,
//   onOpenResume,
// }) => {
//   const [favourite, setFavourite] = useState(!!applicant.is_favourite);
//   const [resumeLoading, setResumeLoading] = useState(false);

//   const handleFavourite = (e) => {
//     e.stopPropagation();
//     setFavourite((f) => !f);
//     onToggleFavourite && onToggleFavourite(applicant);
//   };

//   const handleResumeClick = async (e) => {
//     e.stopPropagation();
//     if (!applicant.candidate_id) {
//       // showError is not available here, handled in parent
//       return;
//     }
//     setResumeLoading(true);
//     await onOpenResume(applicant.candidate_id);
//     setResumeLoading(false);
//   };

//   const stopPropagation = (e) => e.stopPropagation();

//   const skillNames = applicant.skills || [];
//   const visibleSkills = skillNames.slice(0, 6);
//   const extraSkillsCount = skillNames.length - visibleSkills.length;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all w-full overflow-hidden">
//       {/* Top meta bar – now includes Resume button on the right */}
//       <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
//         <div className="flex items-center gap-4">
//           <span className="flex items-center gap-1">
//             <TbCalendar size={13} />
//             Applied on: {formatDate(applicant.applied_at)}
//           </span>
//           <span>
//             Stage: <StatusBadge status={applicant.status} />
//           </span>
//         </div>
//         <div className="flex items-center gap-3">
//           {applicant.updated_at && (
//             <span>Updated: {formatDate(applicant.updated_at)}</span>
//           )}
//           {/* --- Resume Button --- */}
//           <button
//             onClick={handleResumeClick}
//             disabled={resumeLoading}
//             className="flex items-center gap-1 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg px-2.5 py-1 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {resumeLoading ? (
//               <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <TbFileText size={14} />
//             )}
//             {resumeLoading ? "Loading..." : "Resume"}
//           </button>
//         </div>
//       </div>

//       {/* Main body – clickable to navigate to details */}
//       <div
//         className="flex flex-col lg:flex-row gap-5 p-5 cursor-pointer"
//         onClick={() => onCardClick(applicant)}
//       >
//         {/* Left: candidate details */}
//         <div className="flex-1 min-w-0 flex gap-4">
//           <div
//             className="shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-700 font-semibold text-lg flex items-center justify-center overflow-hidden"
//             onClick={(e) => {
//               e.stopPropagation();
//               onCardClick(applicant);
//             }}
//           >
//             {applicant.profile_photo ? (
//               <img
//                 src={applicant.profile_photo}
//                 alt={applicant.full_name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               initials(applicant.first_name, applicant.last_name)
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             {/* Name + badges */}
//             <div className="flex items-center gap-2 flex-wrap">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onCardClick(applicant);
//                 }}
//                 className="text-base font-semibold text-gray-900 hover:text-purple-700 hover:underline"
//               >
//                 {applicant.full_name}
//               </button>
//               {applicant.is_newly_added && (
//                 <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
//                   <TbSparkles size={12} />
//                   Newly added
//                 </span>
//               )}
//             </div>

//             {/* Experience / salary / notice / location row */}
//             <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
//               {applicant.total_experience && (
//                 <span className="flex items-center gap-1">
//                   <TbBriefcase size={13} />
//                   {applicant.total_experience}
//                 </span>
//               )}
//               {applicant.expected_salary_label && (
//                 <span className="flex items-center gap-1">
//                   <TbCurrencyRupee size={13} />
//                   {applicant.expected_salary_label}
//                 </span>
//               )}
//               {applicant.notice_period && (
//                 <span className="flex items-center gap-1">
//                   <TbClock size={13} />
//                   {applicant.notice_period}
//                 </span>
//               )}
//               {applicant.current_location && (
//                 <span className="flex items-center gap-1">
//                   <TbMapPin size={13} />
//                   {applicant.current_location}
//                 </span>
//               )}
//             </div>

//             {/* Current role */}
//             {applicant.current_role && (
//               <div className="mt-2.5 text-sm">
//                 <span className="text-gray-400">Current: </span>
//                 <span className="text-gray-800 font-medium">
//                   {applicant.current_role.designation}
//                 </span>
//                 {applicant.current_role.company && (
//                   <span className="text-gray-600">
//                     {" "}
//                     {applicant.current_role.company}
//                   </span>
//                 )}
//                 {applicant.current_role.duration_label && (
//                   <span className="text-gray-400">
//                     {" "}
//                     · {applicant.current_role.duration_label}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Skills */}
//             {skillNames.length > 0 && (
//               <div className="mt-2 text-sm text-gray-700 leading-relaxed">
//                 <span className="text-gray-400">Skills: </span>
//                 {visibleSkills.map((skill, i) => (
//                   <React.Fragment key={i}>
//                     <SkillChip
//                       label={skill}
//                       highlighted={jobSkillTerms?.some(
//                         (t) => t.toLowerCase() === skill.toLowerCase()
//                       )}
//                     />
//                     {i < visibleSkills.length - 1 && ", "}
//                   </React.Fragment>
//                 ))}
//                 {extraSkillsCount > 0 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onCardClick(applicant);
//                     }}
//                     className="ml-1 text-purple-600 font-medium hover:underline"
//                   >
//                     +{extraSkillsCount} More
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Preferred locations */}
//             {applicant.preferred_locations?.length > 0 && (
//               <div className="mt-2 text-sm">
//                 <span className="text-gray-400">Pref. location: </span>
//                 <span className="text-gray-700">
//                   {applicant.preferred_locations.join(", ")}
//                 </span>
//               </div>
//             )}

//             {/* Education */}
//             {applicant.education_label && (
//               <div className="mt-1 text-sm">
//                 <span className="text-gray-400">Education: </span>
//                 <span className="text-gray-700">
//                   <HighlightedText
//                     text={applicant.education_label}
//                     terms={jobSkillTerms}
//                   />
//                 </span>
//               </div>
//             )}

//             {/* Bottom actions – stop propagation */}
//             <div
//               className="mt-3 flex items-center gap-4 text-xs text-gray-500"
//               onClick={stopPropagation}
//             >
//               <button className="flex items-center gap-1 hover:text-gray-700">
//                 <TbMessage size={14} /> Comment
//               </button>
//               <button className="flex items-center gap-1 hover:text-gray-700">
//                 <TbFolderSymlink size={14} /> Move to
//               </button>
//               <button
//                 onClick={handleFavourite}
//                 className={`flex items-center gap-1 hover:text-gray-700 ${
//                   favourite ? "text-red-500" : ""
//                 }`}
//               >
//                 {favourite ? <TbHeartFilled size={14} /> : <TbHeart size={14} />}
//                 Favourite
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right panel – same as before */}
//         <div className="w-full lg:w-72 shrink-0 lg:border-l lg:border-gray-100 lg:pl-5 flex flex-col gap-3">
//           <div className="flex items-center gap-2" onClick={stopPropagation}>
//             {applicant.linkedin_url && (
//               <a
//                 href={applicant.linkedin_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center gap-1 text-xs font-medium text-blue-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
//               >
//                 <TbBrandLinkedin size={14} /> LinkedIn
//               </a>
//             )}
//           </div>

//           {applicant.summary && (
//             <div>
//               <p className="text-xs font-semibold text-gray-500 mb-1">Summary:</p>
//               <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
//                 <HighlightedText text={applicant.summary} terms={jobSkillTerms} />
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onCardClick(applicant);
//                 }}
//                 className="text-xs text-purple-600 font-medium hover:underline mt-1"
//               >
//                 ...more
//               </button>
//             </div>
//           )}

//           <div className="mt-auto pt-2 border-t border-gray-100 space-y-2" onClick={stopPropagation}>
//             {applicant.mobile && (
//               <div className="flex items-center justify-between">
//                 <span className="flex items-center gap-1.5 text-sm text-gray-700">
//                   <TbPhone size={14} className="text-green-600" />
//                   {applicant.mobile}
//                 </span>
//                 <button className="flex items-center gap-1 text-xs text-purple-600 font-medium hover:underline">
//                   <TbEye size={13} /> View Number
//                 </button>
//               </div>
//             )}
//             {applicant.mobile_verified && (
//               <p className="text-[11px] text-gray-400">Verified phone</p>
//             )}

//             <div className="flex items-center gap-2 pt-1">
//               <a
//                 href={applicant.email ? `mailto:${applicant.email}` : undefined}
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 hover:bg-gray-50"
//               >
//                 <TbMail size={14} /> Email
//               </a>
//               <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-400 border border-gray-100 rounded-lg px-2 py-1.5 cursor-not-allowed">
//                 <TbBrandWhatsapp size={14} /> WhatsApp
//               </button>
//               <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 hover:bg-gray-50">
//                 <TbMessageCircle size={14} /> SMS
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------------------------------------------------------------------
// // Main Component (JobApplicants)
// // ---------------------------------------------------------------------------
// export default function JobApplicants() {
//   const { id: jobId } = useParams();
//   const navigate = useNavigate();
//   const { showError, showSuccess } = useToast();
//   const { user } = useAuth(); // logged‑in user

//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   // Company ID of the logged‑in user's company
//   const [companyId, setCompanyId] = useState(null);
//   const [fetchingCompany, setFetchingCompany] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6);

//   // ─── Fetch the company ID for the logged‑in user ────────────────
//   useEffect(() => {
//     const fetchCompanyId = async () => {
//       if (!user?.id) return;
//       setFetchingCompany(true);
//       try {
//         // 1. Fetch all companies and find the one where CompanyUser.company_user_id === user.id
//         const res = await fetch(`${API_BASE_URL}/companies`);
//         if (!res.ok) throw new Error("Failed to fetch companies");
//         const data = await res.json();
//         const companies = data.data || data.results || data || [];
//         const found = companies.find(
//           (c) => c.CompanyUser?.company_user_id === user.id
//         );
//         if (found) {
//           setCompanyId(found.id);
//           console.log("✅ Found company ID:", found.id);
//         } else {
//           console.warn("⚠️ No company found for user", user.id);
//         }
//       } catch (error) {
//         console.error("Error fetching company ID:", error);
//       } finally {
//         setFetchingCompany(false);
//       }
//     };
//     fetchCompanyId();
//   }, [user]);

//   // ─── Fetch applicants (existing) ─────────────────────────────────
//   useEffect(() => {
//     if (jobId) fetchApplicants();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [jobId]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterStatus]);

//   const fetchApplicants = async () => {
//     setLoading(true);
//     setLoadError(null);
//     try {
//       const result = await applicantsApiService.getApplicantsByJobId(jobId);

//       let rawList = [];
//       if (Array.isArray(result)) {
//         rawList = result;
//       } else if (Array.isArray(result?.data)) {
//         rawList = result.data;
//       } else if (Array.isArray(result?.data?.applications)) {
//         rawList = result.data.applications;
//       } else if (Array.isArray(result?.applications)) {
//         rawList = result.applications;
//       } else if (Array.isArray(result?.data?.candidates)) {
//         rawList = result.data.candidates;
//       }

//       const transformed = rawList.map((item) => {
//         const c =
//           item.candidate ||
//           item.Candidate ||
//           item.candidate_details ||
//           item.applicant ||
//           item;

//         const candidateId =
//           item.candidate_id ??
//           item.candidateId ??
//           item.candidate_uuid ??
//           c.candidate_id ??
//           c.candidateId ??
//           (c !== item ? c.id : undefined);

//         const rawSkills = asList(c.candidate_skills || item.candidate_skills);
//         const skillNames = rawSkills
//           .map((s) =>
//             typeof s === "string" ? s : asName(s.skill, s.skill_name || s.name)
//           )
//           .filter((s) => s && s !== "N/A");

//         const experienceList = asList(c.candidate_experience || item.candidate_experience);
//         const currentExp =
//           experienceList.find((e) => e.is_current_company) || experienceList[0];
//         const currentRole = currentExp
//           ? {
//               designation: currentExp.designation || currentExp.job_title || "N/A",
//               company: currentExp.company_name || "",
//               duration_label: currentExp.start_date
//                 ? `${formatMonthYear(currentExp.start_date)} to ${
//                     currentExp.is_current_company
//                       ? "Present"
//                       : formatMonthYear(currentExp.end_date)
//                   } - ${durationFromDates(currentExp.start_date, currentExp.end_date)}`
//                 : "",
//             }
//           : null;

//         const totalExperience =
//           c.total_experience_label ||
//           c.experience_label ||
//           (currentExp?.start_date
//             ? durationFromDates(currentExp.start_date, currentExp.end_date)
//             : "");

//         const preferences = c.candidate_preferences || item.candidate_preferences;
//         const expectedSalaryLabel = formatSalaryLac(
//           preferences?.preferred_salary ?? c.expected_salary ?? currentExp?.salary
//         );
//         const noticePeriod =
//           c.notice_period ||
//           preferences?.notice_period ||
//           (c.notice_period_days ? `${c.notice_period_days} days notice period` : "");
//         const currentLocation =
//           asName(c.current_city_id, "") ||
//           asName(c.city, "") ||
//           asName(preferences?.preferred_city_id?.[0], "");
//         const preferredLocations = asList(preferences?.preferred_city_id)
//           .map((cty) => asName(cty))
//           .filter((v) => v && v !== "N/A");

//         const educationList = asList(c.candidate_education || item.candidate_education);
//         const latestEdu = educationList[0];
//         const educationLabel = latestEdu
//           ? `${asName(latestEdu.education_sub_category_id, latestEdu.education_type || "")}${
//               latestEdu.college_name ? ` - ${latestEdu.college_name}` : ""
//             }${latestEdu.passing_year ? `, ${latestEdu.passing_year}` : ""}`
//           : "";

//         return {
//           application_id: item.id || item.application_id,
//           candidate_id: candidateId,
//           first_name: c.first_name || "",
//           last_name: c.last_name || "",
//           full_name:
//             `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Unnamed candidate",
//           email: c.email || "N/A",
//           mobile: c.mobile || "",
//           mobile_verified: !!(c.mobile_verified || c.is_mobile_verified),
//           profile_photo: c.profile_photo || null,
//           status: item.status || c.status || "pending",
//           applied_at: item.applied_at || item.created_at || item.createdAt,
//           updated_at: item.updated_at || item.updatedAt,
//           is_newly_added: isRecentlyApplied(
//             item.applied_at || item.created_at || item.createdAt
//           ),
//           is_favourite: !!item.is_favourite,
//           skills: skillNames,
//           current_role: currentRole,
//           total_experience: totalExperience,
//           expected_salary_label: expectedSalaryLabel,
//           notice_period: noticePeriod,
//           current_location: currentLocation,
//           preferred_locations: preferredLocations,
//           education_label: educationLabel,
//           summary: c.summary || c.about || c.bio || "",
//           resume_url: c.resume_url || c.resume || "",
//           linkedin_url:
//             c.linkedin_url ||
//             asList(c.candidate_social_links).find(
//               (l) => (l.social_type || "").toLowerCase() === "linkedin"
//             )?.social_url ||
//             "",
//         };
//       });

//       setApplicants(transformed);
//     } catch (error) {
//       console.error("Error fetching applicants:", error);
//       setLoadError(error.message);
//       showError("Failed to load applicants");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Navigate to applicant details ──────────────────────────────
//   const handleCardClick = (applicant) => {
//     if (applicant.candidate_id) {
//       navigate(`/jobs/${jobId}/applicants/${applicant.candidate_id}`);
//     } else {
//       showError("Candidate ID missing");
//     }
//   };

//   const handleToggleFavourite = (applicant) => {
//     // Placeholder for favourite toggle
//   };

//   // ─── Resume opener with download log ─────────────────────────────
//   const handleOpenResume = async (candidateId) => {
//     try {
//       // 1. Fetch full profile to get resume ID and file
//       const result = await applicantsApiService.getCandidateFullProfile(candidateId);
//       const data = result?.data || result;
//       const resume = data?.candidate_resumes;
//       if (!resume || !resume.resume_file) {
//         showError("No resume available for this candidate");
//         return;
//       }

//       // 2. Get the resume ID
//       const resumeId = resume.id;
//       if (!resumeId) {
//         showError("Resume ID not found");
//         return;
//       }

//       // 3. Get company ID (if not already fetched, try to fetch now)
//       let cid = companyId;
//       if (!cid && user?.id) {
//         // Fallback: fetch company on the fly
//         const res = await fetch(`${API_BASE_URL}/companies`);
//         if (res.ok) {
//           const data2 = await res.json();
//           const companies = data2.data || data2.results || data2 || [];
//           const found = companies.find(
//             (c) => c.CompanyUser?.company_user_id === user.id
//           );
//           if (found) {
//             cid = found.id;
//             setCompanyId(cid);
//           }
//         }
//       }

//       if (!cid) {
//         showError("Company ID not found. Please ensure you are associated with a company.");
//         return;
//       }

//       // 4. Log the download
//       const logPayload = {
//         candidate_resume_id: resumeId,
//         company_id: cid,
//         downloaded_by: user?.id || null,
//         // downloaded_at can be server-generated; we can omit or send ISO string
//       };

//       console.log("📤 Logging resume download:", logPayload);

//       try {
//         await applicantsApiService.logResumeDownload(logPayload);
//         showSuccess("Resume download logged");
//       } catch (logErr) {
//         console.error("Failed to log resume download:", logErr);
//         // Continue anyway – don't block the user from viewing the resume
//       }

//       // 5. Open the resume in a new tab
//       const resumeUrl = resume.resume_file.startsWith("http")
//         ? resume.resume_file
//         : `${API_BASE_URL}${resume.resume_file}`;
//       window.open(resumeUrl, "_blank");
//     } catch (error) {
//       console.error("Error opening resume:", error);
//       showError("Failed to load resume");
//     }
//   };

//   const filteredApplicants = useMemo(() => {
//     return applicants.filter((a) => {
//       const matchesSearch =
//         a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         a.email.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesFilter = filterStatus === "all" || a.status === filterStatus;
//       return matchesSearch && matchesFilter;
//     });
//   }, [applicants, searchTerm, filterStatus]);

//   const totalItems = filteredApplicants.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

//   const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
//               aria-label="Go back"
//             >
//               <TbArrowLeft size={18} />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Job #{jobId} · {totalItems}{" "}
//                 {totalItems === 1 ? "applicant" : "applicants"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="flex-1 relative">
//               <TbSearch
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 placeholder="Search applicants by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="shortlisted">Shortlisted</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//               <button
//                 onClick={fetchApplicants}
//                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
//               >
//                 <TbRefresh
//                   size={18}
//                   className={`text-gray-500 ${loading ? "animate-spin" : ""}`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
//             <p className="mt-2 text-gray-500 text-sm">Loading applicants...</p>
//           </div>
//         ) : loadError ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <p className="text-red-500 font-medium">Failed to load applicants</p>
//             <p className="text-sm text-gray-400 mt-1">{loadError}</p>
//             <button
//               onClick={fetchApplicants}
//               className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <TbRefresh size={16} />
//               Try again
//             </button>
//           </div>
//         ) : filteredApplicants.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <TbUsers size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500">No applicants found</p>
//             <p className="text-sm text-gray-400 mt-1">
//               Try adjusting your search or filters
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="flex flex-col gap-4">
//               {currentApplicants.map((applicant) => (
//                 <CandidateCard
//                   key={applicant.application_id || applicant.candidate_id}
//                   applicant={applicant}
//                   onCardClick={handleCardClick}
//                   onToggleFavourite={handleToggleFavourite}
//                   onOpenResume={handleOpenResume}
//                 />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
//                 <div className="text-sm text-gray-500">
//                   Showing{" "}
//                   <span className="font-medium text-gray-700">
//                     {startIndex + 1}
//                   </span>{" "}
//                   to{" "}
//                   <span className="font-medium text-gray-700">
//                     {Math.min(endIndex, totalItems)}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-medium text-gray-700">
//                     {totalItems}
//                   </span>{" "}
//                   applicants
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => goToPage(1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronsLeft size={16} />
//                   </button>
//                   <button
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronLeft size={16} />
//                   </button>
//                   <span className="px-3 text-sm text-gray-600">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronRight size={16} />
//                   </button>
//                   <button
//                     onClick={() => goToPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronsRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TbArrowLeft,
  TbUser,
  TbMail,
  TbPhone,
  TbCalendar,
  TbSearch,
  TbRefresh,
  TbX,
  TbBriefcase,
  TbSchool,
  TbCertificate,
  TbAward,
  TbLink,
  TbFolder,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbUsers,
  TbCircleCheck,
  TbBuildingSkyscraper,
  TbMapPin,
  TbCurrencyRupee,
  TbFileText,
  TbBrandLinkedin,
  TbMessage,
  TbFolderSymlink,
  TbHeart,
  TbHeartFilled,
  TbBrandWhatsapp,
  TbMessageCircle,
  TbClock,
  TbEye,
  TbSparkles,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

// ---------------------------------------------------------------------------
// API Service
// ---------------------------------------------------------------------------
const API_BASE_URL = "https://hire-me-jobs.onrender.com";

const applicantsApiService = {
  getApplicantsByJobId: async (jobId) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-profile-job-application?job_id=${jobId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  getCandidateFullProfile: async (candidateId) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-full-profile/${candidateId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  logResumeDownload: async (data) => {
    const response = await fetch(`${API_BASE_URL}/resume-download-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const asName = (val, fallback = "N/A") => {
  if (!val) return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && val.name) return val.name;
  return fallback;
};

const asList = (val) => {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
};

const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

const initials = (first, last) => {
  const a = (first || "").trim().charAt(0);
  const b = (last || "").trim().charAt(0);
  const combined = `${a}${b}`.toUpperCase();
  return combined || "?";
};

const formatMonthYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const durationFromDates = (start, end) => {
  if (!start) return "";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  if (isNaN(startDate.getTime())) return "";
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths}m`;
  if (remMonths === 0) return `${years}y`;
  return `${years}y ${remMonths}m`;
};

const formatSalaryLac = (amount) => {
  const num = Number(amount);
  if (!num || isNaN(num)) return null;
  const lac = num / 100000;
  const formatted = lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1);
  return `₹ ${formatted} Lac`;
};

const isRecentlyApplied = (dateString, days = 3) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------
const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();
  const colors = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  const cls = colors[normalized] || "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

const SectionCard = ({ icon: Icon, title, count, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-purple-50 rounded-lg">
        <Icon className="text-purple-600" size={18} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {typeof count === "number" && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
    {children}
  </div>
);

const EmptyRow = ({ label }) => (
  <p className="text-sm text-gray-400 italic">No {label} added yet</p>
);

const HighlightedText = ({ text, terms = [] }) => {
  if (!text) return null;
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(`(${terms.filter(Boolean).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        terms.some((t) => t && t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

const SkillChip = ({ label, highlighted }) => (
  <span
    className={`text-sm ${
      highlighted
        ? "bg-yellow-200 text-gray-900 font-medium px-1 rounded"
        : "text-gray-700"
    }`}
  >
    {label}
  </span>
);

// ---------------------------------------------------------------------------
// Candidate Card
// ---------------------------------------------------------------------------
const CandidateCard = ({
  applicant,
  onCardClick,
  onToggleFavourite,
  jobSkillTerms,
  onOpenResume,
}) => {
  const [favourite, setFavourite] = useState(!!applicant.is_favourite);
  const [resumeLoading, setResumeLoading] = useState(false);

  const handleFavourite = (e) => {
    e.stopPropagation();
    setFavourite((f) => !f);
    onToggleFavourite && onToggleFavourite(applicant);
  };

  const handleResumeClick = async (e) => {
    e.stopPropagation();
    if (!applicant.candidate_id) return;
    setResumeLoading(true);
    await onOpenResume(applicant.candidate_id);
    setResumeLoading(false);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const skillNames = applicant.skills || [];
  const visibleSkills = skillNames.slice(0, 6);
  const extraSkillsCount = skillNames.length - visibleSkills.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all w-full overflow-hidden">
      {/* Top meta bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <TbCalendar size={13} />
            Applied on: {formatDate(applicant.applied_at)}
          </span>
          <span>
            Stage: <StatusBadge status={applicant.status} />
          </span>
        </div>
        <div className="flex items-center gap-3">
          {applicant.updated_at && (
            <span>Updated: {formatDate(applicant.updated_at)}</span>
          )}
          <button
            onClick={handleResumeClick}
            disabled={resumeLoading}
            className="flex items-center gap-1 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg px-2.5 py-1 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resumeLoading ? (
              <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <TbFileText size={14} />
            )}
            {resumeLoading ? "Loading..." : "Resume"}
          </button>
        </div>
      </div>

      {/* Main body */}
      <div
        className="flex flex-col lg:flex-row gap-5 p-5 cursor-pointer"
        onClick={() => onCardClick(applicant)}
      >
        {/* Left: candidate details */}
        <div className="flex-1 min-w-0 flex gap-4">
          <div
            className="shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-700 font-semibold text-lg flex items-center justify-center overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(applicant);
            }}
          >
            {applicant.profile_photo ? (
              <img
                src={applicant.profile_photo}
                alt={applicant.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials(applicant.first_name, applicant.last_name)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(applicant);
                }}
                className="text-base font-semibold text-gray-900 hover:text-purple-700 hover:underline"
              >
                {applicant.full_name}
              </button>
              {applicant.is_newly_added && (
                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  <TbSparkles size={12} />
                  Newly added
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              {applicant.total_experience && (
                <span className="flex items-center gap-1">
                  <TbBriefcase size={13} />
                  {applicant.total_experience}
                </span>
              )}
              {applicant.expected_salary_label && (
                <span className="flex items-center gap-1">
                  <TbCurrencyRupee size={13} />
                  {applicant.expected_salary_label}
                </span>
              )}
              {applicant.notice_period && (
                <span className="flex items-center gap-1">
                  <TbClock size={13} />
                  {applicant.notice_period}
                </span>
              )}
              {applicant.current_location && (
                <span className="flex items-center gap-1">
                  <TbMapPin size={13} />
                  {applicant.current_location}
                </span>
              )}
            </div>

            {applicant.current_role && (
              <div className="mt-2.5 text-sm">
                <span className="text-gray-400">Current: </span>
                <span className="text-gray-800 font-medium">
                  {applicant.current_role.designation}
                </span>
                {applicant.current_role.company && (
                  <span className="text-gray-600">
                    {" "}
                    {applicant.current_role.company}
                  </span>
                )}
                {applicant.current_role.duration_label && (
                  <span className="text-gray-400">
                    {" "}
                    · {applicant.current_role.duration_label}
                  </span>
                )}
              </div>
            )}

            {skillNames.length > 0 && (
              <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                <span className="text-gray-400">Skills: </span>
                {visibleSkills.map((skill, i) => (
                  <React.Fragment key={i}>
                    <SkillChip
                      label={skill}
                      highlighted={jobSkillTerms?.some(
                        (t) => t.toLowerCase() === skill.toLowerCase()
                      )}
                    />
                    {i < visibleSkills.length - 1 && ", "}
                  </React.Fragment>
                ))}
                {extraSkillsCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick(applicant);
                    }}
                    className="ml-1 text-purple-600 font-medium hover:underline"
                  >
                    +{extraSkillsCount} More
                  </button>
                )}
              </div>
            )}

            {applicant.preferred_locations?.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Pref. location: </span>
                <span className="text-gray-700">
                  {applicant.preferred_locations.join(", ")}
                </span>
              </div>
            )}

            {applicant.education_label && (
              <div className="mt-1 text-sm">
                <span className="text-gray-400">Education: </span>
                <span className="text-gray-700">
                  <HighlightedText
                    text={applicant.education_label}
                    terms={jobSkillTerms}
                  />
                </span>
              </div>
            )}

            <div
              className="mt-3 flex items-center gap-4 text-xs text-gray-500"
              onClick={stopPropagation}
            >
              <button className="flex items-center gap-1 hover:text-gray-700">
                <TbMessage size={14} /> Comment
              </button>
              <button className="flex items-center gap-1 hover:text-gray-700">
                <TbFolderSymlink size={14} /> Move to
              </button>
              <button
                onClick={handleFavourite}
                className={`flex items-center gap-1 hover:text-gray-700 ${
                  favourite ? "text-red-500" : ""
                }`}
              >
                {favourite ? <TbHeartFilled size={14} /> : <TbHeart size={14} />}
                Favourite
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-72 shrink-0 lg:border-l lg:border-gray-100 lg:pl-5 flex flex-col gap-3">
          <div className="flex items-center gap-2" onClick={stopPropagation}>
            {applicant.linkedin_url && (
              <a
                href={applicant.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
              >
                <TbBrandLinkedin size={14} /> LinkedIn
              </a>
            )}
          </div>

          {applicant.summary && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Summary:</p>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                <HighlightedText text={applicant.summary} terms={jobSkillTerms} />
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(applicant);
                }}
                className="text-xs text-purple-600 font-medium hover:underline mt-1"
              >
                ...more
              </button>
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-gray-100 space-y-2" onClick={stopPropagation}>
            {applicant.mobile && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                  <TbPhone size={14} className="text-green-600" />
                  {applicant.mobile}
                </span>
                <button className="flex items-center gap-1 text-xs text-purple-600 font-medium hover:underline">
                  <TbEye size={13} /> View Number
                </button>
              </div>
            )}
            {applicant.mobile_verified && (
              <p className="text-[11px] text-gray-400">Verified phone</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a
                href={applicant.email ? `mailto:${applicant.email}` : undefined}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >
                <TbMail size={14} /> Email
              </a>
              <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-400 border border-gray-100 rounded-lg px-2 py-1.5 cursor-not-allowed">
                <TbBrandWhatsapp size={14} /> WhatsApp
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                <TbMessageCircle size={14} /> SMS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function JobApplicants() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [companyId, setCompanyId] = useState(null);
  const [fetchingCompany, setFetchingCompany] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // ─── Fetch company ID ──────────────────────────────────────────
  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!user?.id) return;
      setFetchingCompany(true);
      try {
        const res = await fetch(`${API_BASE_URL}/companies`);
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        const companies = data.data || data.results || data || [];
        const found = companies.find(
          (c) => c.CompanyUser?.company_user_id === user.id
        );
        if (found) {
          setCompanyId(found.id);
        }
      } catch (error) {
        console.error("Error fetching company ID:", error);
      } finally {
        setFetchingCompany(false);
      }
    };
    fetchCompanyId();
  }, [user]);

  // ─── Fetch applicants ──────────────────────────────────────────
  useEffect(() => {
    if (jobId) fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchApplicants = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await applicantsApiService.getApplicantsByJobId(jobId);

      let rawList = [];
      if (Array.isArray(result)) {
        rawList = result;
      } else if (Array.isArray(result?.data)) {
        rawList = result.data;
      } else if (Array.isArray(result?.data?.applications)) {
        rawList = result.data.applications;
      } else if (Array.isArray(result?.applications)) {
        rawList = result.applications;
      } else if (Array.isArray(result?.data?.candidates)) {
        rawList = result.data.candidates;
      }

      const transformed = rawList.map((item) => {
        const c =
          item.candidate ||
          item.Candidate ||
          item.candidate_details ||
          item.applicant ||
          item;

        const candidateId =
          item.candidate_id ??
          item.candidateId ??
          item.candidate_uuid ??
          c.candidate_id ??
          c.candidateId ??
          (c !== item ? c.id : undefined);

        const rawSkills = asList(c.candidate_skills || item.candidate_skills);
        const skillNames = rawSkills
          .map((s) =>
            typeof s === "string" ? s : asName(s.skill, s.skill_name || s.name)
          )
          .filter((s) => s && s !== "N/A");

        const experienceList = asList(c.candidate_experience || item.candidate_experience);
        const currentExp =
          experienceList.find((e) => e.is_current_company) || experienceList[0];
        const currentRole = currentExp
          ? {
              designation: currentExp.designation || currentExp.job_title || "N/A",
              company: currentExp.company_name || "",
              duration_label: currentExp.start_date
                ? `${formatMonthYear(currentExp.start_date)} to ${
                    currentExp.is_current_company
                      ? "Present"
                      : formatMonthYear(currentExp.end_date)
                  } - ${durationFromDates(currentExp.start_date, currentExp.end_date)}`
                : "",
            }
          : null;

        const totalExperience =
          c.total_experience_label ||
          c.experience_label ||
          (currentExp?.start_date
            ? durationFromDates(currentExp.start_date, currentExp.end_date)
            : "");

        const preferences = c.candidate_preferences || item.candidate_preferences;
        const expectedSalaryLabel = formatSalaryLac(
          preferences?.preferred_salary ?? c.expected_salary ?? currentExp?.salary
        );
        const noticePeriod =
          c.notice_period ||
          preferences?.notice_period ||
          (c.notice_period_days ? `${c.notice_period_days} days notice period` : "");
        const currentLocation =
          asName(c.current_city_id, "") ||
          asName(c.city, "") ||
          asName(preferences?.preferred_city_id?.[0], "");
        const preferredLocations = asList(preferences?.preferred_city_id)
          .map((cty) => asName(cty))
          .filter((v) => v && v !== "N/A");

        const educationList = asList(c.candidate_education || item.candidate_education);
        const latestEdu = educationList[0];
        const educationLabel = latestEdu
          ? `${asName(latestEdu.education_sub_category_id, latestEdu.education_type || "")}${
              latestEdu.college_name ? ` - ${latestEdu.college_name}` : ""
            }${latestEdu.passing_year ? `, ${latestEdu.passing_year}` : ""}`
          : "";

        return {
          application_id: item.id || item.application_id,
          candidate_id: candidateId,
          first_name: c.first_name || "",
          last_name: c.last_name || "",
          full_name:
            `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Unnamed candidate",
          email: c.email || "N/A",
          mobile: c.mobile || "",
          mobile_verified: !!(c.mobile_verified || c.is_mobile_verified),
          profile_photo: c.profile_photo || null,
          status: item.status || c.status || "pending",
          applied_at: item.applied_at || item.created_at || item.createdAt,
          updated_at: item.updated_at || item.updatedAt,
          is_newly_added: isRecentlyApplied(
            item.applied_at || item.created_at || item.createdAt
          ),
          is_favourite: !!item.is_favourite,
          skills: skillNames,
          current_role: currentRole,
          total_experience: totalExperience,
          expected_salary_label: expectedSalaryLabel,
          notice_period: noticePeriod,
          current_location: currentLocation,
          preferred_locations: preferredLocations,
          education_label: educationLabel,
          summary: c.summary || c.about || c.bio || "",
          resume_url: c.resume_url || c.resume || "",
          linkedin_url:
            c.linkedin_url ||
            asList(c.candidate_social_links).find(
              (l) => (l.social_type || "").toLowerCase() === "linkedin"
            )?.social_url ||
            "",
        };
      });

      setApplicants(transformed);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setLoadError(error.message);
      showError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (applicant) => {
    if (applicant.candidate_id) {
      navigate(`/jobs/${jobId}/applicants/${applicant.candidate_id}`);
    } else {
      showError("Candidate ID missing");
    }
  };

  const handleToggleFavourite = (applicant) => {};

  // ─── Resume opener with download log ──────────────────────────
  const handleOpenResume = async (candidateId) => {
    try {
      const result = await applicantsApiService.getCandidateFullProfile(candidateId);
      const data = result?.data || result;
      const resume = data?.candidate_resumes;
      if (!resume || !resume.resume_file) {
        showError("No resume available for this candidate");
        return;
      }

      const resumeId = resume.id;
      if (!resumeId) {
        showError("Resume ID not found");
        return;
      }

      let cid = companyId;
      if (!cid && user?.id) {
        const res = await fetch(`${API_BASE_URL}/companies`);
        if (res.ok) {
          const data2 = await res.json();
          const companies = data2.data || data2.results || data2 || [];
          const found = companies.find(
            (c) => c.CompanyUser?.company_user_id === user.id
          );
          if (found) {
            cid = found.id;
            setCompanyId(cid);
          }
        }
      }

      if (!cid) {
        showError("Company ID not found. Please ensure you are associated with a company.");
        return;
      }

      // ─── Payload with created_by & updated_by ──────────────────
      const userId = user?.id || null;
      const logPayload = {
        candidate_resume_id: resumeId,
        company_id: cid,
        downloaded_by: userId,
        created_by: userId,   // <-- added
        updated_by: userId,   // <-- added
      };

      console.log("📤 Logging resume download:", logPayload);

      try {
        await applicantsApiService.logResumeDownload(logPayload);
        showSuccess("Resume download logged");
      } catch (logErr) {
        console.error("Failed to log resume download:", logErr);
      }

      const resumeUrl = resume.resume_file.startsWith("http")
        ? resume.resume_file
        : `${API_BASE_URL}${resume.resume_file}`;
      window.open(resumeUrl, "_blank");
    } catch (error) {
      console.error("Error opening resume:", error);
      showError("Failed to load resume");
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch =
        a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || a.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [applicants, searchTerm, filterStatus]);

  const totalItems = filteredApplicants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Go back"
            >
              <TbArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Job #{jobId} · {totalItems}{" "}
                {totalItems === 1 ? "applicant" : "applicants"}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <TbSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search applicants by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={fetchApplicants}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <TbRefresh
                  size={18}
                  className={`text-gray-500 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading applicants...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-red-500 font-medium">Failed to load applicants</p>
            <p className="text-sm text-gray-400 mt-1">{loadError}</p>
            <button
              onClick={fetchApplicants}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <TbRefresh size={16} />
              Try again
            </button>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <TbUsers size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No applicants found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {currentApplicants.map((applicant) => (
                <CandidateCard
                  key={applicant.application_id || applicant.candidate_id}
                  applicant={applicant}
                  onCardClick={handleCardClick}
                  onToggleFavourite={handleToggleFavourite}
                  onOpenResume={handleOpenResume}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(endIndex, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {totalItems}
                  </span>{" "}
                  applicants
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronLeft size={16} />
                  </button>
                  <span className="px-3 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}