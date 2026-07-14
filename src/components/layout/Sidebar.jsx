// // // import { NavLink } from 'react-router-dom'
// // // import { TbBriefcase, TbDotsVertical, TbUser } from 'react-icons/tb'
// // // import { NAV_ITEMS } from '../../data/staticData'
// // // import Avatar from '../ui/Avatar'

// // // export default function Sidebar({ open, onClose }) {
// // //   return (
// // //     <>
// // //       <div
// // //         className={`fixed inset-0 bg-black/35 z-40 lg:hidden transition-opacity ${
// // //           open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
// // //         }`}
// // //         onClick={onClose}
// // //       />

// // //       <aside
// // //         className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 flex flex-col z-50
// // //           transition-transform duration-300 ease-in-out
// // //           ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
// // //           border-r border-gray-100 dark:border-gray-800`}
// // //       >
// // //         <div className="h-[68px] flex items-center gap-2.5 px-6 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
// // //           <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
// // //             <TbBriefcase size={18} />
// // //           </div>
// // //           <span className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">
// // //             JOB<span className="text-brand-500">PORTAL</span>
// // //           </span>
// // //         </div>

// // //         <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-3">
// // //           {NAV_ITEMS.map((item, i) =>
// // //             item.section ? (
// // //               <div
// // //                 key={`section-${i}`}
// // //                 className="px-3 pt-4 pb-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
// // //               >
// // //                 {item.section}
// // //               </div>
// // //             ) : (
// // //               <NavLink
// // //                 key={item.id}
// // //                 to={item.path}
// // //                 onClick={onClose}
// // //                 className={({ isActive }) =>
// // //                   `flex items-center gap-3 mx-1 my-0.5 px-4 py-2.5 rounded-full text-[14px] font-medium transition-all
// // //                   ${
// // //                     isActive
// // //                       ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-[0_3px_8px_rgba(140,87,255,0.45)]'
// // //                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
// // //                   }`
// // //                 }
// // //               >
// // //                 <item.icon size={19} className="flex-shrink-0" />
// // //                 <span className="truncate">{item.label}</span>
// // //                 {item.badge && (
// // //                   <span
// // //                     className={`ml-auto text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${
// // //                       item.badgeRed ? 'bg-danger-500' : 'bg-brand-600'
// // //                     }`}
// // //                   >
// // //                     {item.badge}
// // //                   </span>
// // //                 )}
// // //               </NavLink>
// // //             )
// // //           )}
// // //         </nav>

// // //         <div className="p-3 flex-shrink-0 border-t border-gray-100 dark:border-gray-800">
// // //           <NavLink
// // //             to="/profile"
// // //             onClick={onClose}
// // //             className={({ isActive }) =>
// // //               `flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
// // //                 isActive
// // //                   ? 'bg-brand-50 dark:bg-brand-900/20'
// // //                   : 'hover:bg-gray-50 dark:hover:bg-gray-800'
// // //               }`
// // //             }
// // //           >
// // //             <Avatar initials="AD" />
// // //             <div className="flex-1 min-w-0">
// // //               <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">Admin User</div>
// // //               <div className="text-[11px] text-gray-400 dark:text-gray-500">Super Admin</div>
// // //             </div>
// // //             <TbDotsVertical size={16} className="text-gray-400" />
// // //           </NavLink>
// // //         </div>
// // //       </aside>
// // //     </>
// // //   )
// // // }
// // import { NavLink } from 'react-router-dom'
// // import { TbBriefcase, TbDotsVertical } from 'react-icons/tb'
// // import { NAV_ITEMS } from '../../data/staticData'
// // import Avatar from '../ui/Avatar'
// // import { useAuth } from '../../context/AuthContext'

// // export default function Sidebar({ open, onClose }) {
// //   const { user } = useAuth();

// //   // Derive display name and role from user object
// //   let displayName = 'Guest User';
// //   let displayRole = 'User';
// //   let initials = 'GU';

// //   if (user) {
// //     // If user has a 'name' field, use it; otherwise use email as name
// //     if (user.name) {
// //       displayName = user.name;
// //       // Generate initials from name
// //       const parts = user.name.trim().split(' ');
// //       initials = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
// //     } else if (user.email) {
// //       displayName = user.email;
// //       // Use first two letters of email as initials
// //       initials = user.email.slice(0, 2).toUpperCase();
// //     }

// //     // Role – fallback to 'User' if not present
// //     displayRole = user.role || user.user_type || 'User';
// //   }

// //   return (
// //     <>
// //       <div
// //         className={`fixed inset-0 bg-black/35 z-40 lg:hidden transition-opacity ${
// //           open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
// //         }`}
// //         onClick={onClose}
// //       />

// //       <aside
// //         className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 flex flex-col z-50
// //           transition-transform duration-300 ease-in-out
// //           ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
// //           border-r border-gray-100 dark:border-gray-800`}
// //       >
// //         <div className="h-[68px] flex items-center gap-2.5 px-6 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
// //           <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
// //             <TbBriefcase size={18} />
// //           </div>
// //           <span className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">
// //             JOB<span className="text-brand-500">PORTAL</span>
// //           </span>
// //         </div>

// //         <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-3">
// //           {NAV_ITEMS.map((item, i) =>
// //             item.section ? (
// //               <div
// //                 key={`section-${i}`}
// //                 className="px-3 pt-4 pb-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
// //               >
// //                 {item.section}
// //               </div>
// //             ) : (
// //               <NavLink
// //                 key={item.id}
// //                 to={item.path}
// //                 onClick={onClose}
// //                 className={({ isActive }) =>
// //                   `flex items-center gap-3 mx-1 my-0.5 px-4 py-2.5 rounded-full text-[14px] font-medium transition-all
// //                   ${
// //                     isActive
// //                       ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-[0_3px_8px_rgba(140,87,255,0.45)]'
// //                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
// //                   }`
// //                 }
// //               >
// //                 <item.icon size={19} className="flex-shrink-0" />
// //                 <span className="truncate">{item.label}</span>
// //                 {item.badge && (
// //                   <span
// //                     className={`ml-auto text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${
// //                       item.badgeRed ? 'bg-danger-500' : 'bg-brand-600'
// //                     }`}
// //                   >
// //                     {item.badge}
// //                   </span>
// //                 )}
// //               </NavLink>

// //             )
// //           )}
// //         </nav>

// //         {/* User profile section – dynamic */}
// //         <div className="p-3 flex-shrink-0 border-t border-gray-100 dark:border-gray-800">
// //           <NavLink
// //             to="/profile"
// //             onClick={onClose}
// //             className={({ isActive }) =>
// //               `flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
// //                 isActive
// //                   ? 'bg-brand-50 dark:bg-brand-900/20'
// //                   : 'hover:bg-gray-50 dark:hover:bg-gray-800'
// //               }`
// //             }
// //           >
// //             <Avatar initials={initials} />
// //             <div className="flex-1 min-w-0">
// //               <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
// //                 {displayName}
// //               </div>
// //               <div className="text-[11px] text-gray-400 dark:text-gray-500">
// //                 {displayRole}
// //               </div>
// //             </div>
// //             <TbDotsVertical size={16} className="text-gray-400" />
// //           </NavLink>
// //         </div>
// //       </aside>
// //     </>
// //   );
// // }

// import { NavLink, useNavigate } from "react-router-dom";
// import { TbBriefcase, TbDotsVertical, TbLogout } from "react-icons/tb";
// import { NAV_ITEMS } from "../../data/staticData";
// import Avatar from "../ui/Avatar";
// import { useAuth } from "../../context/AuthContext";

// export default function Sidebar({ open, onClose }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // Derive display name and role from user object
//   let displayName = "Guest User";
//   let displayRole = "User";
//   let initials = "GU";

//   if (user) {
//     if (user.name) {
//       displayName = user.name;
//       const parts = user.name.trim().split(" ");
//       initials = parts
//         .map((p) => p[0])
//         .join("")
//         .toUpperCase()
//         .slice(0, 2);
//     } else if (user.email) {
//       displayName = user.email;
//       initials = user.email.slice(0, 2).toUpperCase();
//     }
//     displayRole = user.role || user.user_type || "User";
//   }

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//     // Close sidebar on mobile if open
//     if (onClose) onClose();
//   };

//   return (
//     <>
//       <div
//         className={`fixed inset-0 bg-black/35 z-40 lg:hidden transition-opacity ${
//           open
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//       />

//       <aside
//         className={`fixed top-0 left-0 h-screen w-72 xl:w-80 bg-white dark:bg-gray-900 flex flex-col z-50
//           transition-transform duration-300 ease-in-out
//           ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
//           border-r border-gray-100 dark:border-gray-800 shadow-sm lg:shadow-none`}
//       >
//         <div className="h-[72px] flex items-center gap-3 px-7 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
//           <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-[0_3px_10px_rgba(140,87,255,0.35)]">
//             <TbBriefcase size={20} />
//           </div>
//           <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
//             JOB<span className="text-brand-500">PORTAL</span>
//           </span>
//         </div>

//         <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-4">
//           {NAV_ITEMS.map((item, i) =>
//             item.section ? (
//               <div
//                 key={`section-${i}`}
//                 className="px-3 pt-5 pb-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
//               >
//                 {item.section}
//               </div>
//             ) : (
//               <NavLink
//                 key={item.id}
//                 to={item.path}
//                 onClick={onClose}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 mx-1 my-0.5 px-4 py-3 rounded-full text-[14.5px] font-medium transition-all
//                   ${
//                     isActive
//                       ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-[0_3px_8px_rgba(140,87,255,0.45)]"
//                       : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//                   }`
//                 }
//               >
//                 <item.icon size={20} className="flex-shrink-0" />
//                 <span className="truncate">{item.label}</span>
//               </NavLink>
//             ),
//           )}
//         </nav>

//         {/* User profile section – dynamic with logout */}
//         <div className="p-4 flex-shrink-0 border-t border-gray-100 dark:border-gray-800 space-y-3">
//           <NavLink
//             to="/profile"
//             onClick={onClose}
//             className={({ isActive }) =>
//               `flex items-center gap-3 p-3 rounded-xl transition-colors ${
//                 isActive
//                   ? "bg-brand-50 dark:bg-brand-900/20"
//                   : "hover:bg-gray-50 dark:hover:bg-gray-800"
//               }`
//             }
//           >
//             <Avatar initials={initials} />
//             <div className="flex-1 min-w-0">
//               <div className="text-[13.5px] font-semibold text-gray-900 dark:text-white truncate">
//                 {displayName}
//               </div>
//               <div className="text-[11.5px] text-gray-400 dark:text-gray-500">
//                 {displayRole}
//               </div>
//             </div>
//             <TbDotsVertical size={17} className="text-gray-400" />
//           </NavLink>

//           {/* Logout button */}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//           >
//             <TbLogout size={18} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }
import { NavLink, useNavigate } from "react-router-dom";
import { TbBriefcase, TbDotsVertical, TbLogout } from "react-icons/tb";
import { NAV_ITEMS } from "../../data/staticData";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import logoImg from '../../../public/logo.png'

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Derive display name and role from user object
  let displayName = "Guest User";
  let displayRole = "User";
  let initials = "GU";

  if (user) {
    if (user.name) {
      displayName = user.name;
      const parts = user.name.trim().split(" ");
      initials = parts
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } else if (user.email) {
      displayName = user.email;
      initials = user.email.slice(0, 2).toUpperCase();
    }
    displayRole = user.role || user.user_type || "User";
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/35 z-40 lg:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-screen w-72 xl:w-80 bg-[#F4F5FA] dark:bg-[#F4F5FA] flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          shadow-sm lg:shadow-none`}
      >
        {/* Logo area – icon + logo image */}
        <div className="h-[72px] flex items-center gap-3 px-7 flex-shrink-0">
          {/* <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-[0_3px_10px_rgba(140,87,255,0.35)]">
            <TbBriefcase size={20} />
          </div> */}
          {/* Replace text with logo image from public folder */}
          <img
            src={logoImg} // <-- adjust filename if needed (e.g., /logo.svg, /logo.webp)
            alt="HIRE ME"
            className="h-14 w-auto object-contain"
          />
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-4">
          {NAV_ITEMS.map((item, i) =>
            item.section ? (
              <div
                key={`section-${i}`}
                className="px-3 pt-5 pb-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
              >
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 mx-1 my-0.5 px-4 py-3 rounded-full text-[14.5px] font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-[0_3px_8px_rgba(140,87,255,0.45)]"
                      : "text-black hover:bg-[#f2f2f2]"
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ),
          )}
        </nav>

        {/* User profile section – dynamic with logout */}
        <div className="p-4 flex-shrink-0 border-t border-gray-200/70 dark:border-gray-800 space-y-3">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-brand-50 dark:bg-brand-900/20"
                  : "hover:bg-white dark:hover:bg-gray-800"
              }`
            }
          >
            <Avatar initials={initials} />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-black truncate">
                {displayName}
              </div>
              <div className="text-[11.5px] text-gray-500">{displayRole}</div>
            </div>
            <TbDotsVertical size={17} className="text-gray-400" />
          </NavLink>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-red-900/20 transition-colors"
          >
            <TbLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}