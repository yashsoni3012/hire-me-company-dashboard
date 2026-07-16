// // src/pages/JobListing/CommentSection.jsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { TbArrowLeft, TbSend, TbEdit } from "react-icons/tb";
// import { useToast } from "../../context/ToastContext";
// import { useAuth } from "../../context/AuthContext";

// const API_BASE_URL = "https://hire-me-jobs.onrender.com";

// export default function CommentSection() {
//   const { jobId, applicationId } = useParams();
//   const navigate = useNavigate();
//   const { showSuccess, showError } = useToast();
//   const { user } = useAuth();

//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!note.trim()) {
//       showError("Please enter a note");
//       return;
//     }

//     if (!applicationId) {
//       showError("Application ID is missing");
//       return;
//     }

//     const companyUserId = user?.id;
//     if (!companyUserId) {
//       showError("You must be logged in to add a note");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         note: note.trim(),
//         job_application_id: Number(applicationId),
//         company_user_id: Number(companyUserId),
//       };

//       const response = await fetch(`${API_BASE_URL}/application-notes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.message || "Failed to save note");
//       }

//       showSuccess("Note added successfully");
//       setNote("");
//       setTimeout(() => navigate(-1), 1500);
//     } catch (error) {
//       console.error("Error saving note:", error);
//       showError(error.message || "Failed to save note");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
//         {/* Back button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors mb-4"
//         >
//           <TbArrowLeft size={18} />
//           Back to applicants
//         </button>

//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
//             <div className="p-2 bg-purple-50 rounded-lg">
//               <TbEdit className="text-purple-600" size={20} />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">Add Note</h2>
//               <p className="text-sm text-gray-500">
//                 Write a comment or note about this applicant
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Your Note
//               </label>
//               <textarea
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 rows="6"
//                 placeholder="Write your comment here..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
//                 disabled={loading}
//               />
//               <p className="mt-1 text-xs text-gray-400">
//                 {note.length} characters
//               </p>
//             </div>

//             <div className="flex gap-3 pt-2">
//               {/* Cancel button (secondary) */}
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 disabled={loading}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>

//               {/* Submit button (primary) */}
//               <button
//                 type="submit"
//                 disabled={!note.trim() || loading}
//                 className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <TbSend size={16} />
//                     Post Note
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TbArrowLeft,
  TbSend,
  TbEdit,
  TbMessage,
  TbCalendar,
  TbUser,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://hire-me-jobs.onrender.com";

export default function CommentSection() {
  const { jobId, applicationId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ─── Fetch existing notes for this application ──────────────────
  const fetchNotes = async () => {
    if (!applicationId) {
      showError("Application ID is missing");
      setFetching(false);
      return;
    }

    setFetching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/application-notes?job_application_id=${applicationId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // The API might return { data: [...] } or directly an array
      const notesData = result?.data || result || [];
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showError("Failed to load notes");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  // ─── Submit new note ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNote = newNote.trim();
    if (!trimmedNote) {
      showError("Please enter a note");
      return;
    }

    if (!applicationId) {
      showError("Application ID is missing – cannot save note");
      return;
    }

    const companyUserId = user?.id;
    if (!companyUserId) {
      showError("You must be logged in to add a note");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        note: trimmedNote,
        job_application_id: Number(applicationId),
        company_user_id: Number(companyUserId),
      };

      const response = await fetch(`${API_BASE_URL}/application-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save note");
      }

      const savedNote = await response.json();
      // Add the new note to the list (optimistic update)
      setNotes((prev) => [savedNote.data || savedNote, ...prev]);
      setNewNote("");
      showSuccess("Note added successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      showError(error.message || "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Format date (if needed) ────────────────────────────────────
  const formatNoteDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors mb-4"
        >
          <TbArrowLeft size={18} />
          Back to applicants
        </button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TbEdit className="text-purple-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Notes & Comments
              </h2>
              <p className="text-sm text-gray-500">
                View and add notes for this application
              </p>
            </div>
          </div>

          {/* Existing notes */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <TbMessage size={16} />
              Previous Notes
              <span className="text-xs text-gray-400 font-normal">
                ({notes.length})
              </span>
            </h3>

            {fetching ? (
              <div className="text-center py-4 text-sm text-gray-400">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-400 italic">
                No notes yet. Add the first one below.
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div
                    key={note.id || index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-purple-100 rounded-full mt-0.5">
                        <TbUser size={14} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                            {note.note}
                          </p>
                          <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                            <TbCalendar size={12} />
                            {formatNoteDate(note.created_at || note.updated_at)}
                          </span>
                        </div>
                        {note.created_by && (
                          <p className="text-xs text-gray-400 mt-1">
                            By: User #{note.created_by}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new note form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Add a New Note
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows="4"
                placeholder="Write your comment here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
                disabled={submitting || fetching}
              />
              <p className="mt-1 text-xs text-gray-400">
                {newNote.length} characters
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newNote.trim() || submitting || fetching}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <TbSend size={16} />
                    Post Note
                  </>
                )}
              </button>
            </div>

            {/* Hidden debug info (optional) */}
            <div className="text-xs text-gray-300 text-center border-t border-gray-100 pt-3 mt-2">
              Application ID: {applicationId || "⚠️ missing"}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}