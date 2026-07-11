import { useState } from 'react'
import { TbSearch, TbPhone, TbDots, TbSend } from 'react-icons/tb'
import { MESSAGES } from '../data/staticData'
import { Card } from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'

export default function Messages() {
  const [active, setActive] = useState(MESSAGES[0])

  return (
    <div className="py-2">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-400 mt-1">Communicate with candidates and companies.</p>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] h-[560px]">
          <div className="border-r border-gray-100 hidden sm:flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <TbSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  placeholder="Search…"
                  className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {MESSAGES.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActive(m)}
                  className={`flex gap-2.5 p-3 cursor-pointer border-b border-gray-50 transition-colors ${
                    active.id === m.id ? 'bg-brand-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar initials={m.avatar} size="sm" active={m.unread} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className={`text-[13px] ${m.unread ? 'font-bold' : 'font-medium'} text-gray-800`}>
                        {m.name}
                      </span>
                      <span className="text-[11px] text-gray-400">{m.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{m.text}</p>
                  </div>
                  {m.unread && <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 p-4 border-b border-gray-100">
              <Avatar initials={active.avatar} />
              <div>
                <div className="text-sm font-semibold text-gray-800">{active.name}</div>
                <div className="text-xs text-success-500">● Online</div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50">
                  <TbPhone size={16} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50">
                  <TbDots size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-end gap-3 overflow-y-auto">
              <div className="self-start bg-gray-50 rounded-tr-xl rounded-br-xl rounded-bl-xl px-3.5 py-2.5 max-w-[75%] text-[13px] text-gray-800">
                {active.text}
              </div>
              <div className="self-end bg-brand-500 rounded-tl-xl rounded-bl-xl rounded-br-xl px-3.5 py-2.5 max-w-[75%] text-[13px] text-white">
                Thanks for reaching out! We'll get back to you shortly.
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                placeholder="Type a message…"
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-brand-400"
              />
              <button className="px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                <TbSend size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
