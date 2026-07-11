import { useState } from "react";
import {
  TbSearch,
  TbDownload,
  TbPlus,
  TbCheckbox,
  TbSquare,
  TbEye,
  TbEdit,
  TbTrash,
} from "react-icons/tb";
import { Card } from "./Card";
import Button from "./Button";
import Badge from "./Badge";
import Avatar from "./Avatar";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

export default function DataTable({
  title,
  data,
  columns,
  searchPlaceholder = "Search...",
  filterOptions = [],
  filterKey = "status",
  onAdd,
  onExport,
  onDelete,
  onEdit,
  onView,
  onBulkDelete,
  onBulkExport,
  onBulkEmail,
  selectedCount = 0,
  allSelected = false,
  onToggleAll,
  onToggleItem,
  isSelected,
  addButtonText = "Add New",
  exportButtonText = "Export",
  miniStats = [],
  renderCustomAction,
  className = "",
  itemsPerPageOptions = [5, 10, 15, 20, 25, 50],
  defaultItemsPerPage = 5,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const navigate = useNavigate();

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    );
    const matchesFilter = filter === "all" || item[filterKey] === filter;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    const tableElement = document.querySelector(".overflow-x-auto");
    if (tableElement) {
      tableElement.scrollTop = 0;
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Reset to first page when search or filter changes
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // Handle Post Job button click - navigate to job-post route
  const handlePostJob = () => {
    navigate("/job-post");
  };

  return (
    <div className={className}>
      {/* Mini Stats */}
      {miniStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {miniStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-card dark:shadow-gray-800/30 p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}
              >
                <stat.icon size={19} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card noPadding className="overflow-hidden">
        <div className="p-5 pb-0">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              {title}
              {selectedCount > 0 && (
                <span className="ml-2 text-sm font-normal text-brand-500">
                  ({selectedCount} selected)
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <TbSearch
                  size={15}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-8 pr-3 py-1.5 text-[13px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-brand-400 min-w-[160px] text-gray-800 dark:text-white"
                />
              </div>

              {/* Filter */}
              {filterOptions.length > 0 && (
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 outline-none cursor-pointer"
                >
                  <option value="all">All</option>
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              )}

              {/* Post Job Button - Navigates to /job-post */}
              <Button
                icon={TbPlus}
                uppercase
                onClick={handlePostJob}
                className="flex items-center gap-2"
              >
                {addButtonText}
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 border-y border-gray-100 dark:border-gray-800">
                {onToggleAll && (
                  <th className="px-4 py-2.5 whitespace-nowrap">
                    <button
                      onClick={() => onToggleAll(currentData)}
                      className="text-gray-400 hover:text-brand-500 transition-colors"
                    >
                      {allSelected ? (
                        <TbCheckbox size={16} />
                      ) : (
                        <TbSquare size={16} />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-4 py-2.5 whitespace-nowrap ${col.className || ""}`}
                    style={{ width: col.width }}
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-2.5 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onToggleAll ? 2 : 1)}
                    className="px-4 py-12 text-center text-gray-400 dark:text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <span className="text-sm">No items found</span>
                      <span className="text-xs">
                        Try adjusting your search or filter
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors ${
                      isSelected && isSelected(item.id)
                        ? "bg-brand-50/30 dark:bg-brand-900/10"
                        : ""
                    }`}
                  >
                    {onToggleItem && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onToggleItem(item.id)}
                          className="text-gray-400 hover:text-brand-500 transition-colors"
                        >
                          {isSelected && isSelected(item.id) ? (
                            <TbCheckbox size={16} className="text-brand-500" />
                          ) : (
                            <TbSquare size={16} />
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 ${col.cellClassName || ""}`}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 transition-colors"
                            title="View"
                          >
                            <TbEye size={15} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 transition-colors"
                            title="Edit"
                          >
                            <TbEdit size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 hover:text-danger-500 transition-colors"
                            title="Delete"
                          >
                            <TbTrash size={15} />
                          </button>
                        )}
                        {renderCustomAction && renderCustomAction(item)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={totalItems}
          currentItems={currentData.length}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      </Card>
    </div>
  );
}