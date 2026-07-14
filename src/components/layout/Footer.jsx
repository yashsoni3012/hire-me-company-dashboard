import { Link } from "react-router-dom";
import { TbBriefcase } from "react-icons/tb";
import logoImg from '../../../public/logo.png'


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F4F5FA] border-t border-gray-200">
      <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <img
            src={logoImg}
            alt="HIRE ME"
            className="h-8 w-auto object-contain"
          />
          {/* <span className="text-[13px] font-semibold text-black">
            HIRE<span className="text-brand-500">ME</span>
          </span> */}
        </div>

        {/* Center: copyright */}
        <p className="text-[12.5px] text-gray-500 text-center order-3 sm:order-2 w-full sm:w-auto">
          © {year} HIRE ME. All rights reserved.
        </p>

        {/* Right: links */}
        {/* <div className="flex items-center gap-1 order-2 sm:order-3">
          <Link
            to="/privacy-policy"
            className="text-[12.5px] text-black px-2.5 py-1.5 rounded-lg hover:bg-[#f2f2f2] transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-[12.5px] text-black px-2.5 py-1.5 rounded-lg hover:bg-[#f2f2f2] transition-colors duration-200"
          >
            Terms
          </Link>
          <Link
            to="/support"
            className="text-[12.5px] text-black px-2.5 py-1.5 rounded-lg hover:bg-[#f2f2f2] transition-colors duration-200"
          >
            Support
          </Link>
        </div> */}
      </div>
    </footer>
  );
}