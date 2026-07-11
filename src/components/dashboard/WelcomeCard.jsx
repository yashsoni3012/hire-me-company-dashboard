import { WELCOME } from '../../data/staticData'
import Button from '../ui/Button'

export default function WelcomeCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 h-full relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, #F3EBFD 0%, transparent 70%)' }}
      />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Congratulations {WELCOME.name}! 🎉
          </h3>
          <p className="text-[13px] text-gray-400 mt-1">{WELCOME.message}</p>
          <div className="text-2xl font-bold text-brand-500 mt-3">
            {WELCOME.value}
            <span className="text-sm text-gray-400 font-medium ml-1">{WELCOME.valueLabel}</span>
          </div>
          <Button uppercase className="mt-4 text-xs px-3.5 py-2">View Report</Button>
        </div>
        <div className="text-5xl flex-shrink-0 hidden sm:block">🏆</div>
      </div>
    </div>
  )
}
