import Avatar from '../ui/Avatar'

export default function ListCard({ title, items, positive = true }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <button className="text-xs font-medium text-brand-500 hover:underline">View All</button>
      </div>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 py-2.5 ${i !== items.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <Avatar initials={item.initials} size="sm" active={positive} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</div>
              <div className="text-xs text-gray-400 truncate">{item.sub}</div>
            </div>
            <div
              className={`text-[13px] font-semibold whitespace-nowrap ${
                positive ? 'text-success-700' : 'text-danger-500'
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
