import { TbX } from "react-icons/tb";
import { NOTIFICATIONS } from "../../data/staticData";
import Button from "../ui/Button";

export default function NotificationPanel({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-80 bg-white dark:bg-gray-900 z-50 flex flex-col shadow-card dark:shadow-gray-800/50
          transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-base font-semibold text-gray-800 dark:text-white">
            Notifications
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-xs px-2.5 py-1">
              Mark all read
            </Button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <TbX size={15} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {NOTIFICATIONS.map((n, i) => (
            <div
              key={i}
              className={`flex gap-3 px-5 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                n.unread ? "bg-brand-50/60 dark:bg-brand-900/20" : ""
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-brand-500" : "bg-transparent"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-snug">
                  {n.msg}
                </p>
                <p className="text-[11.5px] text-gray-400 dark:text-gray-500 mt-1">
                  {n.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
