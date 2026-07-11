import { TbAlertCircle, TbX } from "react-icons/tb";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
  icon: Icon = TbAlertCircle,
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-danger-50 dark:bg-danger-900/20",
          iconColor: "text-danger-500",
          buttonVariant: "danger",
          borderColor: "border-danger-500",
        };
      case "warning":
        return {
          iconBg: "bg-warn-50 dark:bg-warn-900/20",
          iconColor: "text-warn-500",
          buttonVariant: "warning",
          borderColor: "border-warn-500",
        };
      case "info":
        return {
          iconBg: "bg-info-50 dark:bg-info-900/20",
          iconColor: "text-info-500",
          buttonVariant: "info",
          borderColor: "border-info-500",
        };
      default:
        return {
          iconBg: "bg-brand-50 dark:bg-brand-900/20",
          iconColor: "text-brand-500",
          buttonVariant: "primary",
          borderColor: "border-brand-500",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.iconBg}`}
              >
                <Icon size={20} className={styles.iconColor} />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600"
            >
              <TbX size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={styles.buttonVariant} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
