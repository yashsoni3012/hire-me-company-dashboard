import { TbDots } from 'react-icons/tb'
import { STATISTICS } from '../../data/staticData'
import { IconChip } from '../ui/Card'

export default function StatisticsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 h-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-800">Statistics Card</h3>
        <TbDots className="text-gray-400 cursor-pointer" size={18} />
      </div>
      <p className="text-[13px] text-gray-400 mb-5">
        Total <span className="font-semibold text-gray-700">48.5% growth</span> 😎 this month
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATISTICS.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <IconChip icon={s.icon} color={s.color} size={40} />
            <div>
              <div className="text-[13px] text-gray-400">{s.label}</div>
              <div className="text-base font-bold text-gray-800">{s.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
