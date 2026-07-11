const VARIANTS = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_2px_6px_rgba(140,87,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
    "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-danger-50 text-danger-500 hover:bg-danger-50/80 disabled:opacity-50 disabled:cursor-not-allowed",
};

export default function Button({
  children,
  variant = "primary",
  icon: Icon,
  uppercase = false,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
        uppercase ? "uppercase tracking-wide" : ""
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
