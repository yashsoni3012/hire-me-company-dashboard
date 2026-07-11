export function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card ${noPadding ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-[12.5px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

const SOFT_BG = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-50 text-success-700',
  info: 'bg-info-50 text-info-700',
  warn: 'bg-warn-50 text-warn-700',
  danger: 'bg-danger-50 text-danger-500',
}

// Square-ish soft icon badge, used in Statistics Card row & elsewhere — mirrors Materio's icon chips
export function IconChip({ icon: Icon, color = 'brand', size = 44 }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl ${SOFT_BG[color]}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.5} />
    </div>
  )
}
