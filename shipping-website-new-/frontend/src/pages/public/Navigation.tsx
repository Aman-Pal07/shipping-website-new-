import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white`}>
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -top-5 right-1/4 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="group cursor-pointer">
            <img src="/e2.png" alt="PARCELUP Logo" className="h-16 w-25  " />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <div key={item.label} className="relative">
                <a
                  href={item.href}
                  className={`relative flex items-center px-8 py-3 font-semibold transition-all duration-400 rounded-2xl group ${
                    item.label === "Login"
                      ? "text-blue-700 hover:text-blue-800 hover:bg-blue-50/70"
                      : "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10">{item.label}</span>

                  {item.label === "Login" ? (
                    <>
                      {/* Login button hover effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl scale-0 group-hover:scale-100 transition-all duration-500 origin-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full"></div>
                    </>
                  ) : (
                    <>
                      {/* Register button hover effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl scale-0 group-hover:scale-100 transition-all duration-500 origin-center"></div>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                    </>
                  )}
                </a>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-3 text-blue-700 hover:text-blue-800 transition-all duration-300 group rounded-2xl hover:bg-blue-50/70"
            >
              <div className="absolute inset-0 bg-blue-100/50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <div className="relative z-10">
                {isMenuOpen ? (
                  <X className="h-7 w-7 transform rotate-0 transition-transform duration-500" />
                ) : (
                  <Menu className="h-7 w-7 transform rotate-0 transition-transform duration-500" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed left-0 right-0 bg-white shadow-lg transition-all duration-300 ${
            isMenuOpen ? "top-20 opacity-100" : "-top-full opacity-0"
          }`}
        >
          <div className="bg-white/98 backdrop-blur-xl border border-blue-200/30 rounded-3xl mx-4 shadow-2xl overflow-hidden">
            <div className="px-6 py-6 space-y-3">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-6 py-4 font-semibold rounded-2xl transition-all duration-400 transform hover:translate-x-2 group ${
                    item.label === "Login"
                      ? "text-blue-700 hover:text-blue-800 hover:bg-blue-50/70"
                      : "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-center shadow-lg"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                  {item.label === "Login" && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
