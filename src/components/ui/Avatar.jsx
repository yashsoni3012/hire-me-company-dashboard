const SIZES = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-[13px]',
  lg: 'w-11 h-11 text-sm',
}

export default function Avatar({ initials, size = 'md', active = true, className = '' }) {
  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white ${SIZES[size]} ${active ? 'bg-brand-500' : 'bg-gray-400'} ${className}`}
    >
      {initials}
    </div>
  )
}
