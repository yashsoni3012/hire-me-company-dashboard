import { TbDots, TbChartBar, TbCurrencyDollar, TbBriefcase, TbHelp } from 'react-icons/tb'
import { MINI_STATS } from '../../data/staticData'

const ICONS = { chart: TbChartBar, dollar: TbCurrencyDollar, briefcase: TbBriefcase, help: TbHelp }

export default function MiniStatGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {MINI_STATS.map((s, i) => {
        const Icon = ICONS[s.icon]
        return (
          <div key={i} className="bg-white rounded-2xl shadow-card p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${s.iconBg}`}>
                <Icon size={17} />
              </div>
              <TbDots className="text-gray-400 cursor-pointer" size={16} />
            </div>
            <div className="text-[13px] font-medium text-gray-600">{s.label}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-gray-800">{s.val}</span>
              <span className={`text-xs font-semibold ${s.up ? 'text-success-700' : 'text-danger-500'}`}>
                {s.change}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-auto pt-1">{s.sub}</div>
          </div>
        )
      })}
    </div>
  )
}
