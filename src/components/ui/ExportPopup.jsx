import { useState } from "react";
import {
  TbX,
  TbFileExport,
  TbFileTypeCsv,
  TbFileTypeXls,
  TbFileTypePdf,
  TbDownload,
  TbCheck,
  TbUsers,
} from "react-icons/tb";
import Button from "./Button";

export default function ExportPopup({
  isOpen,
  onClose,
  onExport,
  title,
  data,
  selectedCount = 0,
}) {
  const [format, setFormat] = useState("xlsx");
  const [fileName, setFileName] = useState("");
  const [exportScope, setExportScope] = useState("all");

  if (!isOpen) return null;

  const handleExport = () => {
    let exportData = [];

    if (exportScope === "selected") {
      // Selected data is passed as data (already filtered)
      exportData = data;
    } else {
      // All data - would need to pass all data
      exportData = data;
    }

    const exportResult = {
      data: exportData,
      format: format,
      fileName: fileName || title.replace(/\s+/g, "_").toLowerCase(),
      scope: exportScope,
    };

    onExport(exportResult);
    onClose();
  };

  const getSelectedCount = () => {
    if (exportScope === "selected") {
      return data.length;
    }
    return 0;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                <TbFileExport size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                  Export {title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Choose format and scope
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600"
            >
              <TbX size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Export Scope */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                Export Scope
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setExportScope("all")}
                  className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 transition-all ${
                    exportScope === "all"
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <TbUsers size={18} />
                  <div className="text-left">
                    <div className="text-sm font-medium">All Data</div>
                    <div className="text-xs text-gray-400">
                      Export everything
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setExportScope("selected")}
                  disabled={selectedCount === 0}
                  className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 transition-all ${
                    exportScope === "selected" && selectedCount > 0
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  } ${selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <TbCheck size={18} />
                  <div className="text-left">
                    <div className="text-sm font-medium">Selected Only</div>
                    <div className="text-xs text-gray-400">
                      {selectedCount > 0
                        ? `${selectedCount} items selected`
                        : "No items selected"}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* File Name */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                File Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={`${title.replace(/\s+/g, "_").toLowerCase()}`}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-brand-400"
              />
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFormat("xlsx")}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all ${
                    format === "xlsx"
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <TbFileTypeXls size={24} />
                  <span className="text-xs font-medium">Excel</span>
                  <span className="text-[10px] text-gray-400">.xlsx</span>
                </button>
                <button
                  onClick={() => setFormat("csv")}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all ${
                    format === "csv"
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <TbFileTypeCsv size={24} />
                  <span className="text-xs font-medium">CSV</span>
                  <span className="text-[10px] text-gray-400">.csv</span>
                </button>
                <button
                  onClick={() => setFormat("pdf")}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all ${
                    format === "pdf"
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <TbFileTypePdf size={24} />
                  <span className="text-xs font-medium">PDF</span>
                  <span className="text-[10px] text-gray-400">.pdf</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              icon={TbDownload}
              onClick={handleExport}
              disabled={exportScope === "selected" && selectedCount === 0}
            >
              Export{" "}
              {exportScope === "selected" && selectedCount > 0
                ? `(${selectedCount} items)`
                : ""}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
