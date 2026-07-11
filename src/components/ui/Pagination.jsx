import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  currentItems,
  itemsPerPageOptions = [5, 10, 15, 20, 25, 50],
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      }
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-brand-400 text-sm cursor-pointer"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>entries</span>
        <span className="hidden sm:inline ml-2 text-gray-400">
          ({currentItems} of {totalItems} total)
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 1
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <TbChevronsLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 1
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <TbChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === totalPages
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <TbChevronRight size={16} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === totalPages
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <TbChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
