
// import { useState } from "react";
// import {
//   TbMenu2,
//   TbChevronDown,
//   TbBriefcase,
//   TbUserSearch,
//   TbClockHour4,
//   TbBookmark,
//   TbBriefcase2,
//   TbUsers,
//   TbFolderPlus,
//   TbFolders,
//   TbArchive,
//   TbSearch,
// } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";

// // ---------------------------------------------------------------------------
// // Dropdown data — 3 options each for Search, Jobs, Folders
// // ---------------------------------------------------------------------------
// const NAV_MENUS = {
//   search: {
//     label: "Search",
//     items: [
//       {
//         label: "Search Candidates",
//         icon: TbUserSearch,
//         path: "/search/candidates",
//       },
//       { label: "Recent Searches", icon: TbClockHour4, path: "/search/recent" },
//       { label: "Saved Searches", icon: TbBookmark, path: "/search/saved" },
//     ],
//   },
//   jobs: {
//     label: "Jobs",
//     items: [
//       { label: "Post a Job", icon: TbBriefcase2, path: "/jobs/create" },
//       { label: "My Jobs", icon: TbBriefcase, path: "/jobs" },
//       { label: "View Applications", icon: TbUsers, path: "/jobs/applications" },
//     ],
//   },
//   folders: {
//     label: "Folders",
//     items: [
//       { label: "All Folders", icon: TbFolders, path: "/folders" },
//       { label: "Create Folder", icon: TbFolderPlus, path: "/folders/create" },
//       { label: "Archived", icon: TbArchive, path: "/folders/archived" },
//     ],
//   },
// };

// // ---------------------------------------------------------------------------
// // Reusable hover dropdown nav item
// // ---------------------------------------------------------------------------
// const NavDropdown = ({ menuKey, onNavigate }) => {
//   const menu = NAV_MENUS[menuKey];

//   return (
//     <div className="relative group">
//       <button
//         type="button"
//         className="flex items-center gap-1 px-4 py-2 text-[14.5px] font-medium rounded-lg text-black hover:bg-[#f2f2f2] transition-colors duration-200"
//       >
//         {menu.label}
//         <TbChevronDown
//           size={14}
//           className="transition-transform duration-200 group-hover:rotate-180"
//         />
//       </button>

//       {/* Invisible bridge so hover doesn't drop between button and menu */}
//       <div className="absolute left-0 top-full h-2 w-full" />

//       <div
//         className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible translate-y-1
//                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
//                    transition-all duration-200 ease-out z-40"
//       >
//         <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden py-1.5">
//           {menu.items.map((item) => (
//             <button
//               key={item.path}
//               onClick={() => onNavigate(item.path)}
//               className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13.5px] text-black hover:bg-[#f2f2f2] transition-colors duration-200 text-left"
//             >
//               <item.icon size={16} className="shrink-0 text-black" />
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------------------------------------------------------------------
// // Header
// // ---------------------------------------------------------------------------
// export default function Header({ onMenuClick }) {
//   const navigate = useNavigate();
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleNavigate = (path) => {
//     navigate(path);
//     setMobileNavOpen(false);
//   };

//   return (
//     <header className="sticky top-0 z-30 bg-[#F4F5FA] dark:bg-[#F4F5FA] shadow-sm">
//       <div className="h-[68px] flex items-center gap-2 px-4 sm:px-6">
//         {/* Mobile hamburger (sidebar toggle) */}
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800/60 shrink-0"
//           aria-label="Toggle menu"
//         >
//           <TbMenu2 size={22} />
//         </button>

//         {/* Desktop nav links — Search, Jobs, Folders */}
//         <nav className="hidden lg:flex items-center gap-1">
//           <NavDropdown menuKey="search" onNavigate={handleNavigate} />
//           <NavDropdown menuKey="jobs" onNavigate={handleNavigate} />
//           <NavDropdown menuKey="folders" onNavigate={handleNavigate} />
//         </nav>

//         {/* Right side search bar (rounded pill) */}
//         <div className="ml-auto flex items-center">
//           <div className="relative hidden sm:block">
//             <TbSearch
//               size={17}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search jobs, candidates, companies…"
//               className="w-56 md:w-72 pl-10 pr-4 py-2.5 text-[13.5px] text-black bg-white border border-gray-200 rounded-full outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all duration-200"
//             />
//           </div>

//           {/* Mobile search icon button */}
//           <button
//             type="button"
//             className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-white transition-colors"
//             aria-label="Search"
//           >
//             <TbSearch size={19} />
//           </button>
//         </div>

//         {/* Mobile nav toggle */}
//         <button
//           onClick={() => setMobileNavOpen((v) => !v)}
//           className="lg:hidden flex items-center gap-1 px-3 py-2 text-[14px] font-medium rounded-lg text-black hover:bg-[#f2f2f2] transition-colors"
//         >
//           Menu
//           <TbChevronDown
//             size={16}
//             className={`transition-transform duration-200 ${mobileNavOpen ? "rotate-180" : ""}`}
//           />
//         </button>
//       </div>

//       {/* Mobile nav panel — now matches desktop dropdown styling */}
//       {mobileNavOpen && (
//         <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 px-4 py-3 space-y-3">
//           {Object.entries(NAV_MENUS).map(([key, menu]) => (
//             <div key={key}>
//               <p className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 {menu.label}
//               </p>
//               {menu.items.map((item) => (
//                 <button
//                   key={item.path}
//                   onClick={() => handleNavigate(item.path)}
//                   className="w-full flex items-center gap-2.5 px-2 py-2 text-[13.5px] text-black hover:bg-[#f2f2f2] dark:text-white dark:hover:bg-gray-700 transition-colors duration-200 text-left rounded-lg"
//                 >
//                   <item.icon size={16} className="shrink-0 text-black dark:text-white" />
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </header>
//   );
// }

import { useState } from "react";
import {
  TbMenu2,
  TbChevronDown,
  TbBriefcase,
  TbUserSearch,
  TbClockHour4,
  TbBookmark,
  TbBriefcase2,
  TbUsers,
  TbFolderPlus,
  TbFolders,
  TbArchive,
  TbSearch,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Dropdown data — 3 options each for Search, Jobs, Folders
// ---------------------------------------------------------------------------
const NAV_MENUS = {
  search: {
    label: "Search",
    items: [
      {
        label: "Search Candidates",
        icon: TbUserSearch,
        path: "/search/candidates",
      },
      { label: "Recent Searches", icon: TbClockHour4, path: "/search/recent" },
      { label: "Saved Searches", icon: TbBookmark, path: "/search/saved" },
    ],
  },
  jobs: {
    label: "Jobs",
    items: [
      { label: "Post a Job", icon: TbBriefcase2, path: "/jobs/create" },
      { label: "My Jobs", icon: TbBriefcase, path: "/jobs" },
      { label: "View Applications", icon: TbUsers, path: "/jobs/applications" },
    ],
  },
  folders: {
    label: "Folders",
    items: [
      { label: "All Folders", icon: TbFolders, path: "/folders" },
      { label: "Create Folder", icon: TbFolderPlus, path: "/folders/create" },
      { label: "Archived", icon: TbArchive, path: "/folders/archived" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Reusable hover dropdown nav item (desktop)
// ---------------------------------------------------------------------------
const NavDropdown = ({ menuKey, onNavigate }) => {
  const menu = NAV_MENUS[menuKey];

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 px-4 py-2 text-[14.5px] font-medium rounded-lg text-black hover:bg-[#f2f2f2] transition-colors duration-200"
      >
        {menu.label}
        <TbChevronDown
          size={14}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
      </button>

      {/* Invisible bridge so hover doesn't drop between button and menu */}
      <div className="absolute left-0 top-full h-2 w-full" />

      <div
        className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible scale-95 -translate-y-1
                   origin-top
                   group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0
                   transition-all duration-250 ease-out z-40"
      >
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden py-1.5">
          {menu.items.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13.5px] text-black hover:bg-[#f2f2f2] transition-colors duration-200 text-left"
            >
              <item.icon size={16} className="shrink-0 text-black" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigate = (path) => {
    navigate(path);
    setMobileNavOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F4F5FA] dark:bg-[#F4F5FA] shadow-sm">
      <div className="h-[68px] flex items-center gap-2 px-4 sm:px-6">
        {/* Mobile hamburger (sidebar toggle) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800/60 shrink-0"
          aria-label="Toggle menu"
        >
          <TbMenu2 size={22} />
        </button>

        {/* Desktop nav links — Search, Jobs, Folders */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavDropdown menuKey="search" onNavigate={handleNavigate} />
          <NavDropdown menuKey="jobs" onNavigate={handleNavigate} />
          <NavDropdown menuKey="folders" onNavigate={handleNavigate} />
        </nav>

        {/* Right side search bar (rounded pill) */}
        <div className="ml-auto flex items-center">
          <div className="relative hidden sm:block">
            <TbSearch
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, candidates, companies…"
              className="w-56 md:w-72 pl-10 pr-4 py-2.5 text-[13.5px] text-black bg-white border border-gray-200 rounded-full outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all duration-200"
            />
          </div>

          {/* Mobile search icon button */}
          <button
            type="button"
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-white transition-colors"
            aria-label="Search"
          >
            <TbSearch size={19} />
          </button>
        </div>

        {/* Mobile nav toggle — opens on hover, with tap fallback for touch */}
        <div className="relative lg:hidden group">
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium rounded-lg text-black hover:bg-[#f2f2f2] transition-colors duration-200"
          >
            Menu
            <TbChevronDown
              size={16}
              className={`transition-transform duration-300 group-hover:rotate-180 ${
                mobileNavOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Invisible bridge so hover doesn't drop between button and panel */}
          <div className="absolute right-0 top-full h-2 w-full" />

          {/* Mobile nav panel — hover-triggered with fade + scale animation, plus tap fallback */}
          <div
            className={`absolute right-0 top-full pt-2 w-64 origin-top-right z-40
              transition-all duration-250 ease-out
              opacity-0 invisible scale-95 -translate-y-1
              group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0
              ${
                mobileNavOpen
                  ? "!opacity-100 !visible !scale-100 !translate-y-0"
                  : ""
              }`}
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden py-2 px-1 space-y-1">
              {Object.entries(NAV_MENUS).map(([key, menu]) => (
                <div key={key}>
                  <p className="px-3 pt-1.5 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    {menu.label}
                  </p>
                  {menu.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13.5px] text-black hover:bg-[#f2f2f2] transition-colors duration-200 text-left rounded-lg"
                    >
                      <item.icon size={16} className="shrink-0 text-black" />
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}