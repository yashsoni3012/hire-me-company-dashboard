// // src/components/CommentSection.jsx
// import React, { useState, useEffect } from "react";
// import { TbX } from "react-icons/tb";

// const CommentSection = ({ isOpen, applicant, onClose, onSubmit, loading }) => {
//   const [commentText, setCommentText] = useState("");

//   // Reset text when modal opens or applicant changes
//   useEffect(() => {
//     if (isOpen) {
//       setCommentText("");
//     }
//   }, [isOpen, applicant]);

//   const handleSubmit = () => {
//     if (commentText.trim()) {
//       onSubmit(commentText);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//           disabled={loading}
//         >
//           <TbX size={22} />
//         </button>
//         <h3 className="text-xl font-semibold text-gray-900 mb-1">Add Comment</h3>
//         <p className="text-sm text-gray-500 mb-4">{applicant?.full_name}</p>

//         <textarea
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           placeholder="Write your comment here..."
//           rows={4}
//           className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm"
//           disabled={loading}
//         />

//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || !commentText.trim()}
//             className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Posting...
//               </>
//             ) : (
//               "Post Comment"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentSection;

import React, { useState, useEffect } from "react";
import {
  TbX,
  TbMessage,
  TbUser,
  TbClock,
  TbPencil,
  TbTrash,
  TbCheck,
  TbLoader2,
} from "react-icons/tb";
import { API_BASE_URL } from "../../config/api";

const CommentSection = ({
  isOpen,
  applicant,
  applicationId,
  onClose,
  onSubmit,
  loading,
  currentUserId, // ✅ ID of the logged-in company user
  userMap = {}, // { company_user_id: email }
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);

  // ✅ Edit state
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savingEditId, setSavingEditId] = useState(null);

  // ✅ Delete state
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCommentText("");
      setCommentsError(null);
      setEditingId(null);
      setEditValue("");
      if (applicationId) {
        fetchComments(applicationId);
      }
    }
  }, [isOpen, applicationId]);

  const fetchComments = async (appId) => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/application-notes?application_id=${appId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const data = result?.data || result || [];
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentsError("Failed to load comments");
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit(commentText);
      setCommentText("");
    }
  };

  const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // ✅ Filter comments to only those from the current user
  const filteredComments = comments.filter((comment) => {
    const userId = comment.CompanyUser?.company_user_id || comment.created_by;
    return userId === currentUserId;
  });

  // Get user email from map for display (or fallback)
  const getCommenterName = (comment) => {
    const userId = comment.CompanyUser?.company_user_id || comment.created_by;
    return userMap[userId] || `User ${userId}`;
  };

  // ─── Edit handlers ──────────────────────────────────────────
  const startEdit = (comment) => {
    if (deletingId) return;
    setEditingId(comment.id);
    setEditValue(comment.note || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (comment) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === comment.note) {
      cancelEdit();
      return;
    }

    setSavingEditId(comment.id);
    const previousNote = comment.note;

    // optimistic update
    setComments((prev) =>
      prev.map((c) => (c.id === comment.id ? { ...c, note: trimmed } : c))
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/application-notes/${comment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            note: trimmed,
            updated_by: currentUserId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingId(null);
      setEditValue("");
    } catch (error) {
      console.error("Error updating comment:", error);
      // rollback
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, note: previousNote } : c
        )
      );
    } finally {
      setSavingEditId(null);
    }
  };

  const handleEditKeyDown = (e, comment) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit(comment);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // ─── Delete handler ─────────────────────────────────────────
  const deleteComment = async (comment) => {
    if (!window.confirm("Delete this comment? This cannot be undone.")) {
      return;
    }

    setDeletingId(comment.id);
    const previousComments = comments;

    // optimistic removal
    setComments((prev) => prev.filter((c) => c.id !== comment.id));

    try {
      const response = await fetch(
        `${API_BASE_URL}/application-notes/${comment.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      // rollback
      setComments(previousComments);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
            <p className="text-sm text-gray-500">{applicant?.full_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-200"
            disabled={loading}
          >
            <TbX size={22} />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
          {commentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
            </div>
          ) : commentsError ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{commentsError}</p>
              <button
                onClick={() => applicationId && fetchComments(applicationId)}
                className="mt-2 text-sm text-purple-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-8">
              <TbMessage size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-400 text-sm">You have no comments yet</p>
            </div>
          ) : (
            [...filteredComments]
              .sort((a, b) => b.id - a.id)
              .map((comment) => {
                const isEditing = editingId === comment.id;
                const isSaving = savingEditId === comment.id;
                const isDeleting = deletingId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className={`group relative bg-gray-50 rounded-lg p-3 border border-gray-100 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50/40 hover:shadow-sm ${
                      isDeleting ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          <TbUser size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {getCommenterName(comment)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <TbClock size={12} />
                          {formatCommentDate(comment.created_at)}
                        </span>

                        {/* ✅ Hover-reveal action icons */}
                        {!isEditing && (
                          <div
                            className={`flex items-center gap-1 transition-all duration-200 ${
                              isDeleting
                                ? "opacity-0 pointer-events-none"
                                : "opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                            }`}
                          >
                            <button
                              onClick={() => startEdit(comment)}
                              disabled={isDeleting}
                              title="Edit comment"
                              className="p-1 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-100 hover:scale-110 active:scale-95 transition-all duration-150"
                            >
                              <TbPencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteComment(comment)}
                              disabled={isDeleting}
                              title="Delete comment"
                              className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-100 hover:scale-110 active:scale-95 transition-all duration-150"
                            >
                              {isDeleting ? (
                                <TbLoader2 size={14} className="animate-spin" />
                              ) : (
                                <TbTrash size={14} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body: view mode vs edit mode */}
                    {isEditing ? (
                      <div className="mt-2 pl-8 animate-in fade-in slide-in-from-top-1 duration-150">
                        <textarea
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, comment)}
                          rows={3}
                          disabled={isSaving}
                          className="w-full p-2.5 text-sm border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                        />
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <button
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(comment)}
                            disabled={isSaving || !editValue.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <>
                                <TbLoader2 size={13} className="animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <TbCheck size={13} />
                                Save
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 mt-1.5 pl-8 whitespace-pre-wrap break-words">
                        {comment.note}
                      </p>
                    )}
                  </div>
                );
              })
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm transition-shadow"
            disabled={loading}
          />

          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !commentText.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;