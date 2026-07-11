import { TbDots, TbArrowUpRight } from 'react-icons/tb'
import { LOCATIONS } from '../../data/staticData'

export default function LocationsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Candidates by Location</h3>
        <TbDots className="text-gray-400 cursor-pointer" size={18} />
      </div>

      <div className="flex flex-col gap-4">
        {LOCATIONS.map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {l.code}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-gray-800">{l.candidates}</span>
                <span className="flex items-center text-success-700 text-xs font-semibold">
                  <TbArrowUpRight size={13} />{l.percent}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[13px] font-semibold text-gray-700">{l.name}</div>
              <div className="text-xs text-gray-400">{l.jobs} jobs</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
