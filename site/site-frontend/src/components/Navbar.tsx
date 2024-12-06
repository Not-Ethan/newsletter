import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ["Home", "Features", "Pricing", "About", "Contact"];

  return (
    <nav className="relative flex items-center justify-between px-8 h-16 bg-white shadow-md font-sans">
      {/* Left: Logo */}
      <a href="/" className="flex items-center space-x-2">
        <img
          src="Cura_processed.png"
          alt="Logo"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-lg font-bold text-black">Newsletta</span>
      </a>

      {/* Desktop Nav Links (center) and Buttons (right) */}
      <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="relative text-black hover:text-[#FCAEAE] transition-colors"
          >
            {item}
            <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#FCAEAE] scale-x-0 transition-transform duration-300 transform origin-left hover:scale-x-100"></span>
          </a>
        ))}
      </div>

      <div className="hidden lg:flex space-x-4">
        <a
          href="/login"
          className="px-4 py-2 border border-[#FA8072] text-[#FA8072] rounded-full hover:bg-[#FA8072] hover:text-white transition"
        >
          Log in
        </a>
        <a
          href="/get-started"
          className="px-4 py-2 bg-[#FA8072] text-white rounded-full hover:bg-[#e67063] transition shadow-md"
        >
          Get Started Now
        </a>
      </div>

      {/* Mobile Hamburger Icon */}
      <button
        className="lg:hidden text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-8 mt-2 w-48 bg-white border shadow-md rounded-md flex flex-col lg:hidden">
          {navItems.map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="px-4 py-2 text-black hover:bg-gray-100 hover:text-[#FCAEAE] transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="border-t mt-2 pt-2 flex flex-col space-y-2 px-4 pb-4">
            <a
              href="/login"
              className="px-4 py-2 border border-[#FA8072] text-[#FA8072] rounded-full hover:bg-[#FA8072] hover:text-white transition text-center"
            >
              Log in
            </a>
            <a
              href="/get-started"
              className="px-4 py-2 bg-[#FA8072] text-white rounded-full hover:bg-[#e67063] transition shadow-md text-center"
            >
              Get Started Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
