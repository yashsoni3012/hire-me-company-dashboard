import { TbDots, TbArrowUpRight, TbBuildingSkyscraper } from 'react-icons/tb'
import { TOTAL_HIRES } from '../../data/staticData'

export default function TotalHires() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 h-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-800">Total Hires</h3>
        <TbDots className="text-gray-400 cursor-pointer" size={18} />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-3xl font-bold text-gray-800">{TOTAL_HIRES.value}</span>
        <span className="flex items-center gap-0.5 text-success-700 text-[13px] font-semibold bg-success-50 px-1.5 py-0.5 rounded-md">
          <TbArrowUpRight size={14} />{TOTAL_HIRES.change}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1 mb-5">{TOTAL_HIRES.compareText}</p>

      <div className="flex flex-col gap-4">
        {TOTAL_HIRES.companies.map((c, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
              style={{ background: c.color }}
            >
              <TbBuildingSkyscraper size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-gray-800">{c.name}</div>
              <div className="text-xs text-gray-400">{c.sub}</div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.progress}%`, background: c.color }}
                />
              </div>
            </div>
            <div className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">{c.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
