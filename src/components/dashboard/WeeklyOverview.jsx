import { TbDots } from 'react-icons/tb'
import { WEEKLY_OVERVIEW } from '../../data/staticData'
import Button from '../ui/Button'

export default function WeeklyOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Weekly Overview</h3>
        <TbDots className="text-gray-400 cursor-pointer" size={18} />
      </div>

      <div className="flex items-start gap-4 flex-1">
        <div className="text-3xl font-bold text-gray-800">{WEEKLY_OVERVIEW.percent}%</div>
        <p className="text-[13px] text-gray-400 leading-relaxed">{WEEKLY_OVERVIEW.message}</p>
      </div>

      <Button uppercase className="w-full mt-4 py-2.5">Details</Button>
    </div>
  )
}
