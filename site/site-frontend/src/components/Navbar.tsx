function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 h-16 bg-white shadow-md">
      {/* Left: Logo */}
      <a href="/" className="flex items-center space-x-2">
        <img
          src="Cura_processed.png"
          alt="Logo"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-lg font-bold text-black">Newsletta</span>
      </a>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex space-x-8">
        {["Home", "Features", "Pricing", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="relative text-black hover:text-[#FCAEAE] transition-colors"
          >
            {item}
            {/* Underline Effect */}
            <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#FCAEAE] scale-x-0 transition-transform duration-300 transform origin-left hover:scale-x-100"></span>
          </a>
        ))}
      </div>

      {/* Right: Buttons */}
      <div className="flex space-x-4">
        {/* Sign In */}
        <a
          href="/signin"
          className="px-4 py-2 border border-[#FA8072] text-[#FA8072] rounded-full hover:bg-[#FA8072] hover:text-white transition"
        >
          Sign In
        </a>
        {/* Get Started */}
        <a
          href="/get-started"
          className="px-4 py-2 bg-[#FA8072] text-white rounded-full hover:bg-[#e67063] transition shadow-md"
        >
          Get Started Now
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
