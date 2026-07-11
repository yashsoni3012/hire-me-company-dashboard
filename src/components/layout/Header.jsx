import { TbMenu2, TbSearch, TbMoon, TbSun, TbBell } from "react-icons/tb";
import Avatar from "../ui/Avatar";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick, onBellClick }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 lg:pl-0 h-[68px] flex items-center gap-3 px-4 sm:px-6 z-30 bg-[#F8F7FA]/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/60"
        aria-label="Toggle menu"
      >
        <TbMenu2 size={22} />
      </button>

      <div className="relative flex-1 ml-6 max-w-xs hidden sm:block">
        <TbSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search jobs, candidates, companies…"
          className="w-full pl-9 pr-3 py-2 text-[13px] bg-white dark:bg-gray-800 border border-transparent rounded-full outline-none focus:border-brand-300 transition-colors shadow-card dark:shadow-gray-800/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        {/* <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60"
          title="Toggle theme"
        >
          {theme === "light" ? <TbMoon size={19} /> : <TbSun size={19} />}
        </button> */}
        <button
          onClick={onBellClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60"
          title="Notifications"
        >
          <TbBell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>
        <div className="relative ml-1" onClick={() => navigate("/profile")}>
          <Avatar initials="AD" size="sm" className="cursor-pointer" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-[#F8F7FA] dark:border-gray-900" />
        </div>
      </div>
    </header>
  );
}
