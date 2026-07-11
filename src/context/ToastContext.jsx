import { createContext, useContext, useState, useCallback } from "react";
import {
  TbCheck,
  TbX,
  TbAlertCircle,
  TbInfoCircle,
  TbX as TbClose,
} from "react-icons/tb";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = (message, duration) =>
    addToast(message, "success", duration);
  const showError = (message, duration) => addToast(message, "error", duration);
  const showWarning = (message, duration) =>
    addToast(message, "warning", duration);
  const showInfo = (message, duration) => addToast(message, "info", duration);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, onRemove }) {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return TbCheck;
      case "error":
        return TbX;
      case "warning":
        return TbAlertCircle;
      case "info":
        return TbInfoCircle;
      default:
        return TbInfoCircle;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case "success":
        return "bg-success-50 border-success-500 text-success-700 dark:bg-success-900/20 dark:border-success-500 dark:text-success-400";
      case "error":
        return "bg-danger-50 border-danger-500 text-danger-700 dark:bg-danger-900/20 dark:border-danger-500 dark:text-danger-400";
      case "warning":
        return "bg-warn-50 border-warn-500 text-warn-700 dark:bg-warn-900/20 dark:border-warn-500 dark:text-warn-400";
      case "info":
        return "bg-info-50 border-info-500 text-info-700 dark:bg-info-900/20 dark:border-info-500 dark:text-info-400";
      default:
        return "bg-info-50 border-info-500 text-info-700 dark:bg-info-900/20 dark:border-info-500 dark:text-info-400";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = getIcon(toast.type);
        const colors = getColors(toast.type);
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg ${colors} animate-slide-in`}
          >
            <Icon size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <TbClose size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
