import { TbPlus } from 'react-icons/tb'
import Button from '../components/ui/Button'

export default function Placeholder({ title, icon: Icon }) {
  return (
    <div className="py-2 flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-[72px] h-[72px] rounded-2xl bg-brand-50 flex items-center justify-center">
        <Icon size={36} className="text-brand-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-400">This section is under construction.</p>
      <Button icon={TbPlus} uppercase>Get Started</Button>
    </div>
  )
}
