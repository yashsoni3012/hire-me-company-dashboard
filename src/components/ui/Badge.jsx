const STYLES = {
  active: 'bg-success-50 text-success-700',
  pending: 'bg-warn-50 text-warn-700',
  closed: 'bg-gray-100 text-gray-500',
  rejected: 'bg-danger-50 text-danger-700',
  blue: 'bg-info-50 text-info-700',
  purple: 'bg-brand-50 text-brand-600',
}

export default function Badge({ status, children }) {
  const label = children ?? status.charAt(0).toUpperCase() + status.slice(1)
  const style = STYLES[status] || STYLES.blue
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${style}`}>
      {label}
    </span>
  )
}
