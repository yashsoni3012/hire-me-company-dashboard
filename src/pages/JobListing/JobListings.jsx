import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TbBriefcase,
  TbEye,
  TbEdit,
  TbTrash,
  TbCalendar,
  TbUsers,
  TbTrendingUp,
  TbPlus,
  TbSearch,
  TbFilter,
  TbDownload,
  TbRefresh,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";
import { API_BASE_URL } from "../../config/api";

const jobApiService = {
  getAllJobs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  deleteJob: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },

  // New: Fetch applicant count for a single job
  getApplicantCount: async (jobId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/candidate-profile-job-application?job_id=${jobId}`,
      );
      if (!response.ok) {
        // If job has no applicants, the API might return 404 or an empty array
        return 0;
      }
      const result = await response.json();
      // The API returns { success: true, count: N, data: [...] }
      return result?.count || 0;
    } catch (error) {
      console.error(`Error fetching applicants for job ${jobId}:`, error);
      return 0; // fallback
    }
  },

  // New: Fetch applicant counts for multiple jobs in parallel
  getApplicantCounts: async (jobIds) => {
    try {
      const promises = jobIds.map((id) =>
        jobApiService.getApplicantCount(id).catch(() => 0),
      );
      const counts = await Promise.all(promises);
      return counts;
    } catch (error) {
      console.error("Error fetching applicant counts:", error);
      return jobIds.map(() => 0);
    }
  },
};

export default function JobListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 1. Fetch all jobs
      const result = await jobApiService.getAllJobs();

      let jobsData = [];

      if (Array.isArray(result)) {
        jobsData = result;
      } else if (result.data) {
        if (Array.isArray(result.data)) {
          jobsData = result.data;
        } else if (result.data.jobs && Array.isArray(result.data.jobs)) {
          jobsData = result.data.jobs;
        } else if (result.data.results && Array.isArray(result.data.results)) {
          jobsData = result.data.results;
        }
      } else if (result.jobs && Array.isArray(result.jobs)) {
        jobsData = result.jobs;
      } else if (result.results && Array.isArray(result.results)) {
        jobsData = result.results;
      }

      const transformedJobs = jobsData.map((job) => ({
        id: job.id || job._id || Math.random().toString(),
        title: job.title || job.job_title || "Untitled",
        company:
          job.company_name || job.Company?.company_name || job.company || "N/A",
        location:
          job.location_name || job.location || job.Location?.name || "N/A",
        type: job.posting_type || job.job_type || "Full-time",
        applications: job.applications_count || job.apps || 0, // will be overwritten
        status:
          job.is_status === true ||
          job.is_status === 1 ||
          job.status === "active"
            ? "active"
            : job.is_status === false ||
                job.is_status === 0 ||
                job.status === "inactive"
              ? "closed"
              : job.status === "pending"
                ? "pending"
                : "draft",
        created_at:
          job.created_at ||
          job.createdAt ||
          job.posted_date ||
          new Date().toISOString(),
        is_trending: job.is_trending || false,
        reference_code: job.reference_code || job.code,
        views: job.views || job.job_views || 0,
      }));

      // 2. Fetch applicant counts for all jobs in parallel
      const jobIds = transformedJobs.map((job) => job.id);
      const applicantCounts = await jobApiService.getApplicantCounts(jobIds);

      // 3. Merge counts back into jobs
      const jobsWithCounts = transformedJobs.map((job, index) => ({
        ...job,
        applications: applicantCounts[index] || 0,
      }));

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      showError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await jobApiService.deleteJob(id);
        showSuccess(`"${title}" deleted successfully!`);
        fetchJobs();
      } catch (error) {
        showError("Failed to delete job");
      }
    }
  };

  const handlePostNewJob = () => {
    navigate("/job-post");
  };

  const handleViewApplications = (jobId) => {
    navigate(`/jobs/${jobId}/applicants`);
  };

  const handleManageJob = (jobId) => {
    navigate(`/jobs/${jobId}/manage`);
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Count jobs by status
  const statusCounts = {
    all: jobs.length,
    active: jobs.filter((j) => j.status === "active").length,
    pending: jobs.filter((j) => j.status === "pending").length,
    closed: jobs.filter((j) => j.status === "closed").length,
    draft: jobs.filter((j) => j.status === "draft").length,
  };

  // Pagination calculations
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);

      if (currentPage - half < 1) {
        end = maxPagesToShow;
      }
      if (currentPage + half > totalPages) {
        start = totalPages - maxPagesToShow + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Calculate stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalApplications = jobs.reduce(
    (sum, job) => sum + (job.applications || 0),
    0,
  );
  const trendingJobs = jobs.filter((j) => j.is_trending).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      active: "bg-green-50 text-green-700 border-green-200",
      closed: "bg-red-50 text-red-700 border-red-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      draft: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.draft}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your job postings
            </p>
          </div>
          <button
            onClick={handlePostNewJob}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <TbPlus size={18} />
            Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TbBriefcase className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
                <p className="text-xs text-gray-500">Total Jobs</p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TbTrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
                <p className="text-xs text-gray-500">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TbUsers className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalApplications}
                </p>
                <p className="text-xs text-gray-500">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TbTrendingUp className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {trendingJobs}
                </p>
                <p className="text-xs text-gray-500">Trending</p>
              </div>
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
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white min-w-[130px]"
              >
                <option value="all">All ({statusCounts.all})</option>
                <option value="active">Active ({statusCounts.active})</option>
                <option value="pending">
                  Pending ({statusCounts.pending})
                </option>
                <option value="closed">Closed ({statusCounts.closed})</option>
                <option value="draft">Draft ({statusCounts.draft})</option>
              </select>
              <button
                onClick={fetchJobs}
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

        {/* Job List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <TbBriefcase size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No jobs found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {job.title}
                        </h3>
                        {job.is_trending && (
                          <span className="flex items-center gap-1 text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                            <TbTrendingUp size={12} />
                            Trending
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-gray-700">
                            {job.company}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <TbCalendar size={14} />
                          Created: {formatDate(job.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TbUsers size={14} />
                          {job.applications}{" "}
                          {job.applications === 1 ? "applicant" : "applicants"}
                        </span>
                        <StatusBadge status={job.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleViewApplications(job.id)}
                        className="px-4 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        View applications
                      </button>
                      <button
                        onClick={() => handleManageJob(job.id)}
                        className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Manage job
                      </button>
                      {/* <button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete job"
                      >
                        <TbTrash size={18} />
                      </button> */}
                    </div>
                  </div>
                </div>
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
                  jobs
                </div>

                <div className="flex items-center gap-1">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                  >
                    <TbChevronsLeft size={16} />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <TbChevronLeft size={16} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {currentPage > 3 && totalPages > 5 && (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="text-gray-400 px-1">...</span>
                        )}
                      </>
                    )}

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {currentPage < totalPages - 2 && totalPages > 5 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="text-gray-400 px-1">...</span>
                        )}
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <TbChevronRight size={16} />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                  >
                    <TbChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Stats */}
        {filteredJobs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div>
              Showing {Math.min(endIndex, totalItems)} of {totalItems} jobs
            </div>
            <div className="flex items-center gap-4">
              <span>
                👁️ {jobs.reduce((sum, j) => sum + (j.views || 0), 0)} job views
              </span>
              <span>📝 {totalApplications} Total applications</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
