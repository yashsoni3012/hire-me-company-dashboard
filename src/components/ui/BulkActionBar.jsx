import { TbTrash, TbCheck, TbX, TbMail, TbDownload } from "react-icons/tb";
import Button from "./Button";

export default function BulkActionBar({
  selectedCount,
  onClear,
  onDelete,
  onExport,
  onEmail,
  customActions = [],
  className = "",
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3 animate-slide-up ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          {selectedCount}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          selected
        </span>
      </div>

      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />

      <div className="flex items-center gap-1.5">
        <Button
          variant="danger"
          icon={TbTrash}
          onClick={onDelete}
          className="text-sm"
        >
          Delete
        </Button>

        {onExport && (
          <Button
            variant="outline"
            icon={TbDownload}
            onClick={onExport}
            className="text-sm"
          >
            Export
          </Button>
        )}

        {onEmail && (
          <Button
            variant="outline"
            icon={TbMail}
            onClick={onEmail}
            className="text-sm"
          >
            Email
          </Button>
        )}

        {customActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "outline"}
            icon={action.icon}
            onClick={() => action.onClick()}
            className="text-sm"
          >
            {action.label}
          </Button>
        ))}

        <Button
          variant="ghost"
          icon={TbX}
          onClick={onClear}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
