// import { useState } from 'react'
// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import Header from './Header'
// import NotificationPanel from './NotificationPanel'
 
// export default function DashboardLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [notifOpen, setNotifOpen] = useState(false)
 
//   return (
//     <div className="min-h-screen bg-[#F4F5FA]">
//       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
 
//       <div className="lg:ml-72 xl:ml-80 transition-[margin] duration-300 ease-in-out">
//         <Header
//           onMenuClick={() => setSidebarOpen((v) => !v)}
//           onBellClick={() => setNotifOpen((v) => !v)}
//         />
//         <main className="px-4 sm:px-6 pb-8">
//           <Outlet />
//         </main>
//       </div>
 
//       <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
//     </div>
//   )
// }

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import NotificationPanel from './NotificationPanel'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F5FA]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72 xl:ml-80 transition-[margin] duration-300 ease-in-out min-h-screen flex flex-col">
        <Header
          onMenuClick={() => setSidebarOpen((v) => !v)}
          onBellClick={() => setNotifOpen((v) => !v)}
        />
        <main className="flex-1 px-4 sm:px-6 pb-8">
          <Outlet />
        </main>
        <Footer />
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}