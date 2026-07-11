import { TbX } from "react-icons/tb";
import Button from "./Button";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
  icon: Icon,
  iconColor = "brand",
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  const iconColors = {
    brand:
      "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400",
    success:
      "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400",
    danger:
      "bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400",
    warning: "bg-warn-50 text-warn-600 dark:bg-warn-900/30 dark:text-warn-400",
    info: "bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400",
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden animate-modal-slide ${className}`}
        >
          {/* Header with gradient accent */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconColors[iconColor]}`}
                  >
                    <Icon size={22} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {title}
                  </h3>
                  {children.props?.subtitle && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                      {children.props.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-colors"
              >
                <TbX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-end gap-3">
                {footer}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
