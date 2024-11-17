function Navbar() {
    return (
      <nav className="shadow-md hover:shadow-none transition-shadow duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold font-sans text-primary">
                Newsletta
              </a>
            </div>
  
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#work" className="text-primary hover:underline">Work</a>
              <a href="#services" className="text-primary hover:underline">Services</a>
              <a href="#about" className="text-primary hover:underline">About</a>
              <a href="#contact" className="text-primary hover:underline">Contact</a>
            </div>
  
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="text-gray-800 dark:text-gray-200 focus:outline-none"
                aria-label="Toggle navigation"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;
  