import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbMapPin, TbRefresh, TbArrowRight, TbLoader } from "react-icons/tb";
import { JOBS } from "../../data/staticData";
import Badge from "../ui/Badge";
import { useToast } from "../../context/ToastContext";

export default function JobsTable() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // State for refresh loading
  const [isRefreshing, setIsRefreshing] = useState(false);
  // State for jobs data (so we can update it on refresh)
  const [jobs, setJobs] = useState(JOBS);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to fetch fresh data
      // In real app: const freshData = await fetchJobs()
      // For now, we'll just re-set the data after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // If you have an API, replace this with your actual data fetch
      // const freshData = await api.getJobs()
      // setJobs(freshData)

      // For demo, we'll just show success
      showSuccess("Jobs data refreshed successfully!");
    } catch (error) {
      showError("Failed to refresh jobs data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewAll = () => {
    navigate("/jobs");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card dark:shadow-gray-800/30 overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between p-5 pb-3">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
          Job Listings
        </h3>
        <div className="flex items-center gap-2">
          {/* Refresh Button with Loading State */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
            title="Refresh jobs"
          >
            {isRefreshing ? (
              <TbLoader size={18} className="animate-spin text-brand-500" />
            ) : (
              <TbRefresh
                size={18}
                className="text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors"
              />
            )}
          </button>

          {/* View All Button */}
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
          >
            <span>View All</span>
            <TbArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 border-y border-gray-100 dark:border-gray-800">
              <th className="px-5 py-3 whitespace-nowrap">Job Title</th>
              <th className="px-5 py-3 whitespace-nowrap">Company</th>
              <th className="px-5 py-3 whitespace-nowrap">Location</th>
              <th className="px-5 py-3 whitespace-nowrap">Salary</th>
              <th className="px-5 py-3 whitespace-nowrap">Applications</th>
              <th className="px-5 py-3 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.slice(0, 5).map((j) => (
              <tr
                key={j.id}
                className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors"
              >
                <td className="px-5 py-3 font-semibold text-gray-800 dark:text-white whitespace-nowrap">
                  {j.title}
                </td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {j.company}
                </td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  <TbMapPin size={13} className="inline mr-1 text-gray-400" />
                  {j.location}
                </td>
                <td className="px-5 py-3 font-semibold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                  {j.salary}
                </td>
                <td className="px-5 py-3">
                  <Badge status="purple">{j.apps} apps</Badge>
                </td>
                <td className="px-5 py-3">
                  <Badge status={j.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Footer */}
      {jobs.length > 5 && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <button
            onClick={handleViewAll}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors py-1.5 rounded-lg hover:bg-brand-50/50 dark:hover:bg-brand-900/20"
          >
            <span>View All {jobs.length} Jobs</span>
            <TbArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
