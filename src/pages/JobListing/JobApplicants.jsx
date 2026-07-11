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

// // ---------------------------------------------------------------------------
// // API Service
// // ---------------------------------------------------------------------------
// const API_BASE_URL = "https://hire-me-jobs.onrender.com";

// const applicantsApiService = {
//   getApplicantsByJobId: async (jobId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-profile-job-application?job_id=${jobId}`,
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   },

//   getCandidateFullProfile: async (candidateId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-full-profile/${candidateId}`,
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   },
// };

// // ---------------------------------------------------------------------------
// // Small helpers
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

// // Format "May 2026" style from an ISO date
// const formatMonthYear = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "";
//   return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
// };

// // Turn a start/end date pair into a duration string like "2m" or "1y 3m"
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

// // Format a lakh-style salary display, e.g. 450000 -> "4.5 Lac"
// const formatSalaryLac = (amount) => {
//   const num = Number(amount);
//   if (!num || isNaN(num)) return null;
//   const lac = num / 100000;
//   const formatted = lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1);
//   return `₹ ${formatted} Lac`;
// };

// // Was this application submitted within the last N days? Used for the
// // "Newly added" badge, similar to the reference screenshot.
// const isRecentlyApplied = (dateString, days = 3) => {
//   if (!dateString) return false;
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return false;
//   const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
//   return diffDays <= days;
// };

// // ---------------------------------------------------------------------------
// // Reusable bits
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
//     <span
//       className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
//     >
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

// // Highlights any word from `terms` inside `text` — used to mimic the
// // highlighted "Cyber Security" style keywords in the reference design.
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
//         ),
//       )}
//     </>
//   );
// };

// // A single tag/chip used for skills, highlighting the ones matched
// // against the job's own required skills (if provided).
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
// // Candidate Card (full-width, ATS-style) – now clickable to open profile
// // ---------------------------------------------------------------------------
// const CandidateCard = ({
//   applicant,
//   onOpen,
//   onToggleFavourite,
//   jobSkillTerms,
// }) => {
//   const [favourite, setFavourite] = useState(!!applicant.is_favourite);

//   const handleFavourite = (e) => {
//     e.stopPropagation();
//     setFavourite((f) => !f);
//     onToggleFavourite && onToggleFavourite(applicant);
//   };

//   // Prevent modal open when clicking interactive elements
//   const stopPropagation = (e) => e.stopPropagation();

//   const skillNames = applicant.skills || [];
//   const visibleSkills = skillNames.slice(0, 6);
//   const extraSkillsCount = skillNames.length - visibleSkills.length;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all w-full overflow-hidden">
//       {/* Top meta bar – not clickable */}
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
//         <div className="flex items-center gap-3 text-gray-400">
//           {applicant.updated_at && (
//             <span>Updated: {formatDate(applicant.updated_at)}</span>
//           )}
//         </div>
//       </div>

//       {/* Main body – clickable to open profile */}
//       <div
//         className="flex flex-col lg:flex-row gap-5 p-5 cursor-pointer"
//         onClick={() => onOpen(applicant)}
//       >
//         {/* Left: candidate details */}
//         <div className="flex-1 min-w-0 flex gap-4">
//           <div
//             className="shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-700 font-semibold text-lg flex items-center justify-center overflow-hidden"
//             onClick={(e) => {
//               e.stopPropagation(); // prevent double trigger
//               onOpen(applicant);
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
//                   onOpen(applicant);
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
//                         (t) => t.toLowerCase() === skill.toLowerCase(),
//                       )}
//                     />
//                     {i < visibleSkills.length - 1 && ", "}
//                   </React.Fragment>
//                 ))}
//                 {extraSkillsCount > 0 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onOpen(applicant);
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

//             {/* Bottom actions – these should NOT trigger modal */}
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
//                 {favourite ? (
//                   <TbHeartFilled size={14} />
//                 ) : (
//                   <TbHeart size={14} />
//                 )}
//                 Favourite
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right: summary + contact panel – clickable except for interactive elements */}
//         <div className="w-full lg:w-72 shrink-0 lg:border-l lg:border-gray-100 lg:pl-5 flex flex-col gap-3">
//           {/* Resume & LinkedIn buttons – stop propagation */}
//           <div className="flex items-center gap-2" onClick={stopPropagation}>
//             {applicant.resume_url && (
//               <a
//                 href={applicant.resume_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
//               >
//                 <TbFileText size={14} /> Resume
//               </a>
//             )}
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
//               <p className="text-xs font-semibold text-gray-500 mb-1">
//                 Summary:
//               </p>
//               <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
//                 <HighlightedText
//                   text={applicant.summary}
//                   terms={jobSkillTerms}
//                 />
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onOpen(applicant);
//                 }}
//                 className="text-xs text-purple-600 font-medium hover:underline mt-1"
//               >
//                 ...more
//               </button>
//             </div>
//           )}

//           <div
//             className="mt-auto pt-2 border-t border-gray-100 space-y-2"
//             onClick={stopPropagation}
//           >
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
// // Full Profile Modal
// // ---------------------------------------------------------------------------
// const ProfileModal = ({ profile, loading, error, onClose }) => {
//   useEffect(() => {
//     const onKeyDown = (e) => e.key === "Escape" && onClose();
//     document.addEventListener("keydown", onKeyDown);
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//       document.body.style.overflow = "";
//     };
//   }, [onClose]);

//   const candidate = profile?.candidate;
//   const completion = profile?.total_completion_percentage ?? 0;
//   const skills = asList(profile?.candidate_skills);
//   const education = asList(profile?.candidate_education);
//   const experience = asList(profile?.candidate_experience);
//   const preferences = profile?.candidate_preferences;
//   const certifications = asList(profile?.candidate_certification);
//   const awards = asList(profile?.candidate_awards);
//   const socialLinks = asList(profile?.candidate_social_links);
//   const projects = asList(profile?.candidate_projects);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
//       onClick={onClose}
//     >
//       <div
//         className="bg-gray-50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
//           <h2 className="text-lg font-bold text-gray-900">Candidate Profile</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//             aria-label="Close"
//           >
//             <TbX size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-5">
//           {loading && (
//             <div className="text-center py-16">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
//               <p className="mt-2 text-gray-500 text-sm">Loading profile...</p>
//             </div>
//           )}

//           {!loading && error && (
//             <div className="text-center py-16">
//               <p className="text-red-500 font-medium">Failed to load profile</p>
//               <p className="text-sm text-gray-400 mt-1">{error}</p>
//             </div>
//           )}

//           {!loading && !error && candidate && (
//             <>
//               {/* Basic info */}
//               <div className="bg-white rounded-xl border border-gray-200 p-5">
//                 <div className="flex items-center gap-4">
//                   <div className="shrink-0 w-16 h-16 rounded-full bg-purple-100 text-purple-700 font-bold text-xl flex items-center justify-center overflow-hidden">
//                     {candidate.profile_photo ? (
//                       <img
//                         src={candidate.profile_photo}
//                         alt={`${candidate.first_name} ${candidate.last_name}`}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       initials(candidate.first_name, candidate.last_name)
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {candidate.first_name} {candidate.last_name}
//                       </h3>
//                       <StatusBadge status={candidate.status} />
//                     </div>
//                     <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
//                       <TbMail size={14} />
//                       {candidate.email}
//                     </div>
//                     {candidate.mobile && (
//                       <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
//                         <TbPhone size={14} />
//                         {candidate.mobile}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Profile completion */}
//                 <div className="mt-4">
//                   <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
//                     <span>Profile completion</span>
//                     <span className="font-medium text-gray-700">
//                       {completion}%
//                     </span>
//                   </div>
//                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-purple-600 rounded-full transition-all"
//                       style={{
//                         width: `${Math.min(100, Math.max(0, completion))}%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-3 text-xs text-gray-400">
//                   Last login: {formatDate(candidate.last_login_at, true)}
//                 </div>
//               </div>

//               {/* Skills */}
//               <SectionCard
//                 icon={TbCircleCheck}
//                 title="Skills"
//                 count={skills.length}
//               >
//                 {skills.length === 0 ? (
//                   <EmptyRow label="skills" />
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {skills.map((skill) => {
//                       const skillId = skill.id || skill.skill_id;
//                       return (
//                         <span
//                           key={skillId || Math.random()}
//                           className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100"
//                         >
//                           {asName(skill.skill, `Skill #${skill.skill_id}`)}
//                           {skill.experience_months
//                             ? ` · ${skill.experience_months} mo`
//                             : ""}
//                         </span>
//                       );
//                     })}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Education */}
//               <SectionCard
//                 icon={TbSchool}
//                 title="Education"
//                 count={education.length}
//               >
//                 {education.length === 0 ? (
//                   <EmptyRow label="education" />
//                 ) : (
//                   <div className="space-y-3">
//                     {education.map((edu) => (
//                       <div
//                         key={edu.id}
//                         className="border border-gray-100 rounded-lg p-3"
//                       >
//                         <div className="flex items-center justify-between gap-2">
//                           <p className="font-medium text-gray-900 text-sm">
//                             {edu.college_name || "N/A"}
//                           </p>
//                           <span className="text-xs text-gray-400">
//                             {edu.passing_year}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {asName(edu.education_category_id)} ·{" "}
//                           {asName(edu.education_sub_category_id)}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {edu.education_type || "N/A"} ·{" "}
//                           {edu.percentage || "N/A"}%
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Experience */}
//               <SectionCard
//                 icon={TbBriefcase}
//                 title="Experience"
//                 count={experience.length}
//               >
//                 {experience.length === 0 ? (
//                   <EmptyRow label="experience" />
//                 ) : (
//                   <div className="space-y-3">
//                     {experience.map((exp) => (
//                       <div
//                         key={exp.id}
//                         className="border border-gray-100 rounded-lg p-3"
//                       >
//                         <div className="flex items-center justify-between gap-2 flex-wrap">
//                           <p className="font-medium text-gray-900 text-sm">
//                             {exp.job_title || "N/A"}{" "}
//                             {exp.designation ? `· ${exp.designation}` : ""}
//                           </p>
//                           {exp.is_current_company && (
//                             <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">
//                               Current
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
//                           <TbBuildingSkyscraper size={13} />
//                           {exp.company_name || "N/A"}
//                         </div>
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {formatDate(exp.start_date)} —{" "}
//                           {exp.is_current_company
//                             ? "Present"
//                             : formatDate(exp.end_date)}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {asName(exp.industry_id)} · {asName(exp.workplace_id)}{" "}
//                           · {asName(exp.job_types_id)}
//                         </p>
//                         {exp.salary && (
//                           <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
//                             <TbCurrencyRupee size={13} />
//                             {Number(exp.salary).toLocaleString("en-IN")}
//                           </p>
//                         )}
//                         {exp.job_description && (
//                           <p className="text-xs text-gray-600 mt-2 leading-relaxed">
//                             {exp.job_description}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Preferences */}
//               <SectionCard icon={TbMapPin} title="Preferences">
//                 {!preferences ? (
//                   <EmptyRow label="preferences" />
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                     <div>
//                       <p className="text-xs text-gray-400 mb-1">
//                         Preferred industry
//                       </p>
//                       <p className="text-gray-700">
//                         {asList(preferences.preferred_industry_id)
//                           .map((i) => asName(i))
//                           .join(", ") || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400 mb-1">
//                         Preferred city
//                       </p>
//                       <p className="text-gray-700">
//                         {asList(preferences.preferred_city_id)
//                           .map((i) => asName(i))
//                           .join(", ") || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400 mb-1">
//                         Workplace type
//                       </p>
//                       <p className="text-gray-700">
//                         {asList(preferences.preferred_workplace_type_id)
//                           .map((i) => asName(i))
//                           .join(", ") || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400 mb-1">
//                         Expected salary
//                       </p>
//                       <p className="text-gray-700 flex items-center gap-1">
//                         <TbCurrencyRupee size={14} />
//                         {preferences.preferred_salary
//                           ? Number(preferences.preferred_salary).toLocaleString(
//                               "en-IN",
//                             )
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Certifications */}
//               <SectionCard
//                 icon={TbCertificate}
//                 title="Certifications"
//                 count={certifications.length}
//               >
//                 {certifications.length === 0 ? (
//                   <EmptyRow label="certifications" />
//                 ) : (
//                   <div className="space-y-2">
//                     {certifications.map((cert) => (
//                       <div
//                         key={cert.id}
//                         className="flex items-center justify-between border border-gray-100 rounded-lg p-3"
//                       >
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">
//                             {cert.certificate_name}
//                           </p>
//                           <p className="text-xs text-gray-500">{cert.issuer}</p>
//                         </div>
//                         <span className="text-xs text-gray-400">
//                           {formatDate(cert.issue_date)}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Awards */}
//               <SectionCard icon={TbAward} title="Awards" count={awards.length}>
//                 {awards.length === 0 ? (
//                   <EmptyRow label="awards" />
//                 ) : (
//                   <div className="space-y-2">
//                     {awards.map((award) => (
//                       <div
//                         key={award.id}
//                         className="border border-gray-100 rounded-lg p-3"
//                       >
//                         <p className="text-sm font-medium text-gray-900">
//                           {award.title}
//                         </p>
//                         {award.description && (
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             {award.description}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Social links */}
//               <SectionCard
//                 icon={TbLink}
//                 title="Social Links"
//                 count={socialLinks.length}
//               >
//                 {socialLinks.length === 0 ? (
//                   <EmptyRow label="social links" />
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {socialLinks.map((link) => (
//                       <a
//                         key={link.id}
//                         href={link.social_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors capitalize"
//                       >
//                         {link.social_type}
//                       </a>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Projects */}
//               <SectionCard
//                 icon={TbFolder}
//                 title="Projects"
//                 count={projects.length}
//               >
//                 {projects.length === 0 ? (
//                   <EmptyRow label="projects" />
//                 ) : (
//                   <div className="space-y-3">
//                     {projects.map((project) => (
//                       <div
//                         key={project.id}
//                         className="border border-gray-100 rounded-lg p-3"
//                       >
//                         <div className="flex items-center justify-between gap-2 flex-wrap">
//                           <p className="text-sm font-medium text-gray-900">
//                             {project.project_title}
//                           </p>
//                           {project.project_url && (
//                             <a
//                               href={project.project_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-xs text-purple-600 hover:underline"
//                             >
//                               View project
//                             </a>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {project.candidate_role || "N/A"}
//                           {project.client_name
//                             ? ` · ${project.client_name}`
//                             : ""}
//                         </p>
//                         {project.technologies_used && (
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             {project.technologies_used}
//                           </p>
//                         )}
//                         {project.team_size && (
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             Team size: {project.team_size}
//                           </p>
//                         )}
//                         {project.project_description && (
//                           <p className="text-xs text-gray-600 mt-2 leading-relaxed">
//                             {project.project_description}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------------------------------------------------------------------
// // Main Component
// // ---------------------------------------------------------------------------
// export default function JobApplicants() {
//   const { id: jobId } = useParams();
//   const navigate = useNavigate();
//   const { showError } = useToast();

//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6);

//   // Profile modal
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [profileError, setProfileError] = useState(null);

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
//             typeof s === "string" ? s : asName(s.skill, s.skill_name || s.name),
//           )
//           .filter((s) => s && s !== "N/A");

//         const experienceList = asList(
//           c.candidate_experience || item.candidate_experience,
//         );
//         const currentExp =
//           experienceList.find((e) => e.is_current_company) || experienceList[0];
//         const currentRole = currentExp
//           ? {
//               designation:
//                 currentExp.designation || currentExp.job_title || "N/A",
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

//         const preferences =
//           c.candidate_preferences || item.candidate_preferences;
//         const expectedSalaryLabel = formatSalaryLac(
//           preferences?.preferred_salary ??
//             c.expected_salary ??
//             currentExp?.salary,
//         );
//         const noticePeriod =
//           c.notice_period ||
//           preferences?.notice_period ||
//           (c.notice_period_days
//             ? `${c.notice_period_days} days notice period`
//             : "");
//         const currentLocation =
//           asName(c.current_city_id, "") ||
//           asName(c.city, "") ||
//           asName(preferences?.preferred_city_id?.[0], "");
//         const preferredLocations = asList(preferences?.preferred_city_id)
//           .map((cty) => asName(cty))
//           .filter((v) => v && v !== "N/A");

//         const educationList = asList(
//           c.candidate_education || item.candidate_education,
//         );
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
//             `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
//             "Unnamed candidate",
//           email: c.email || "N/A",
//           mobile: c.mobile || "",
//           mobile_verified: !!(c.mobile_verified || c.is_mobile_verified),
//           profile_photo: c.profile_photo || null,
//           status: item.status || c.status || "pending",
//           applied_at: item.applied_at || item.created_at || item.createdAt,
//           updated_at: item.updated_at || item.updatedAt,
//           is_newly_added: isRecentlyApplied(
//             item.applied_at || item.created_at || item.createdAt,
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
//               (l) => (l.social_type || "").toLowerCase() === "linkedin",
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

//   const handleOpenProfile = async (applicant) => {
//     setSelectedCandidate(applicant);
//     setProfile(null);
//     setProfileError(null);

//     if (
//       applicant.candidate_id === undefined ||
//       applicant.candidate_id === null
//     ) {
//       console.error(
//         "Missing candidate_id for applicant:",
//         applicant,
//         "— check the shape of the /jobs/:jobId/applications response and adjust the transform in fetchApplicants.",
//       );
//       setProfileError("This applicant record is missing a candidate id.");
//       showError("Could not identify this candidate");
//       return;
//     }

//     setProfileLoading(true);
//     try {
//       const result = await applicantsApiService.getCandidateFullProfile(
//         applicant.candidate_id,
//       );
//       const data = result?.data || result;
//       setProfile(data);
//     } catch (error) {
//       console.error(
//         `Error fetching profile for candidate_id=${applicant.candidate_id}:`,
//         error,
//       );
//       setProfileError(error.message);
//       showError("Failed to load candidate profile");
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleCloseProfile = () => {
//     setSelectedCandidate(null);
//     setProfile(null);
//     setProfileError(null);
//   };

//   const handleToggleFavourite = (applicant) => {
//     // Wire this up to a PATCH/POST call to persist favourite state if needed.
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

//   const goToPage = (page) =>
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));

//   return (
//     <div className="min-h-screen">
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
//             <p className="text-red-500 font-medium">
//               Failed to load applicants
//             </p>
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
//                   onOpen={handleOpenProfile}
//                   onToggleFavourite={handleToggleFavourite}
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

//       {/* Full profile modal */}
//       {selectedCandidate && (
//         <ProfileModal
//           profile={profile}
//           loading={profileLoading}
//           error={profileError}
//           onClose={handleCloseProfile}
//         />
//       )}
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

// ---------------------------------------------------------------------------
// API Service (same as before)
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
};

// ---------------------------------------------------------------------------
// Helpers (same as before)
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
// Reusable bits (same)
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
// Candidate Card (with navigation instead of modal)
// ---------------------------------------------------------------------------
const CandidateCard = ({
  applicant,
  onCardClick, // new prop: function to navigate
  onToggleFavourite,
  jobSkillTerms,
}) => {
  const [favourite, setFavourite] = useState(!!applicant.is_favourite);

  const handleFavourite = (e) => {
    e.stopPropagation();
    setFavourite((f) => !f);
    onToggleFavourite && onToggleFavourite(applicant);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const skillNames = applicant.skills || [];
  const visibleSkills = skillNames.slice(0, 6);
  const extraSkillsCount = skillNames.length - visibleSkills.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all w-full overflow-hidden">
      {/* Top meta bar – not clickable */}
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
        <div className="flex items-center gap-3 text-gray-400">
          {applicant.updated_at && (
            <span>Updated: {formatDate(applicant.updated_at)}</span>
          )}
        </div>
      </div>

      {/* Main body – clickable to navigate to details */}
      <div
        className="flex flex-col lg:flex-row gap-5 p-5 cursor-pointer"
        onClick={() => onCardClick(applicant)} // navigate
      >
        {/* Left: candidate details (same as before, but with navigation) */}
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
            {/* Name + badges */}
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

            {/* Experience / salary / notice / location row */}
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

            {/* Current role */}
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

            {/* Skills */}
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

            {/* Preferred locations */}
            {applicant.preferred_locations?.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Pref. location: </span>
                <span className="text-gray-700">
                  {applicant.preferred_locations.join(", ")}
                </span>
              </div>
            )}

            {/* Education */}
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

            {/* Bottom actions – stop propagation */}
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

        {/* Right panel – same as before */}
        <div className="w-full lg:w-72 shrink-0 lg:border-l lg:border-gray-100 lg:pl-5 flex flex-col gap-3">
          <div className="flex items-center gap-2" onClick={stopPropagation}>
            {applicant.resume_url && (
              <a
                href={applicant.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
              >
                <TbFileText size={14} /> Resume
              </a>
            )}
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
// Main Component (JobApplicants)
// ---------------------------------------------------------------------------
export default function JobApplicants() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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

  // Navigate to applicant details page
  const handleCardClick = (applicant) => {
    if (applicant.candidate_id) {
      navigate(`/jobs/${jobId}/applicants/${applicant.candidate_id}`);
    } else {
      showError("Candidate ID missing");
    }
  };

  const handleToggleFavourite = (applicant) => {
    // Placeholder for favourite toggle
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
                />
              ))}
            </div>

            {/* Pagination */}
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