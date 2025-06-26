import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Mail,
  HelpCircle,
} from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [pricingTimer, setPricingTimer] = useState<NodeJS.Timeout | null>(null);
  const [contactTimer, setContactTimer] = useState<NodeJS.Timeout | null>(null);
  const [servicesTimer, setServicesTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const navItems = [
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "#services",
    },
    {
      label: "Contact",
      href: "/contact",
      dropdown: [
        {
          label: "WhatsApp",
          href: "#",
          icon: MessageCircle,
          info: "+91 85276 31629",
        },
        {
          label: "Email",
          href: "#",
          icon: Mail,
          info: "support@parcelup.in",
        },
      ],
    },
    {
      label: "Pricing",
      href: "/pricing",
      dropdown: [
        { label: "Individual Shipments", href: "/pricing/individual" },
        { label: "B2B Shipments", href: "/pricing/b2b" },
      ],
    },
    { label: "FAQs", href: "#faqs", icon: HelpCircle },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];

  // Smooth scroll function
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navHeight = 80; // Height of fixed navbar
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  const handlePricingMouseEnter = () => {
    if (pricingTimer) {
      clearTimeout(pricingTimer);
      setPricingTimer(null);
    }
    setIsPricingOpen(true);
  };

  const handlePricingMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsPricingOpen(false);
    }, 300);
    setPricingTimer(timer);
  };

  const handleContactMouseEnter = () => {
    if (contactTimer) {
      clearTimeout(contactTimer);
      setContactTimer(null);
    }
    setIsContactOpen(true);
  };

  const handleContactMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsContactOpen(false);
    }, 300);
    setContactTimer(timer);
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimer) {
      clearTimeout(servicesTimer);
      setServicesTimer(null);
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300);
    setServicesTimer(timer);
  };

  // Keep dropdown open when hovering over it
  const handleDropdownMouseEnter = (
    type: "pricing" | "contact" | "services"
  ) => {
    if (pricingTimer) clearTimeout(pricingTimer);
    if (contactTimer) clearTimeout(contactTimer);
    if (servicesTimer) clearTimeout(servicesTimer);

    if (type === "pricing") setIsPricingOpen(true);
    if (type === "contact") setIsContactOpen(true);
    if (type === "services") setIsServicesOpen(true);
  };

  const handleDropdownMouseLeave = (
    type: "pricing" | "contact" | "services"
  ) => {
    const timer = setTimeout(() => {
      if (type === "pricing") setIsPricingOpen(false);
      if (type === "contact") setIsContactOpen(false);
      if (type === "services") setIsServicesOpen(false);
    }, 300);

    if (type === "pricing") setPricingTimer(timer);
    if (type === "contact") setContactTimer(timer);
    if (type === "services") setServicesTimer(timer);
  };

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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="group cursor-pointer">
            <img src="/e2.png" alt="PARCELUP Logo" className="h-16 w-25" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  // Dropdown items (Services, Pricing and Contact)
                  <div
                    className="relative"
                    onMouseEnter={
                      item.label === "Pricing"
                        ? handlePricingMouseEnter
                        : item.label === "Contact"
                        ? handleContactMouseEnter
                        : handleServicesMouseEnter
                    }
                    onMouseLeave={
                      item.label === "Pricing"
                        ? handlePricingMouseLeave
                        : item.label === "Contact"
                        ? handleContactMouseLeave
                        : handleServicesMouseLeave
                    }
                  >
                    <button
                      className="relative flex items-center px-6 py-3 font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50/70 transition-all duration-400 rounded-2xl group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                    >
                      <span className="relative z-10 mr-1">{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 relative z-10 transition-transform duration-300 ${
                          (item.label === "Pricing" && isPricingOpen) ||
                          (item.label === "Contact" && isContactOpen) ||
                          (item.label === "Services" && isServicesOpen)
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                      {/* Hover effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl scale-0 group-hover:scale-100 transition-all duration-500 origin-center"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full"></div>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-blue-200/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                        (item.label === "Pricing" && isPricingOpen) ||
                        (item.label === "Contact" && isContactOpen) ||
                        (item.label === "Services" && isServicesOpen)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                      onMouseEnter={() => {
                        if (item.label === "Pricing")
                          handleDropdownMouseEnter("pricing");
                        if (item.label === "Contact")
                          handleDropdownMouseEnter("contact");
                        if (item.label === "Services")
                          handleDropdownMouseEnter("services");
                      }}
                      onMouseLeave={() => {
                        if (item.label === "Pricing")
                          handleDropdownMouseLeave("pricing");
                        if (item.label === "Contact")
                          handleDropdownMouseLeave("contact");
                        if (item.label === "Services")
                          handleDropdownMouseLeave("services");
                      }}
                    >
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            onClick={(e) =>
                              handleSmoothScroll(e, dropdownItem.href)
                            }
                            className="block px-6 py-3 text-blue-700 hover:text-blue-800 hover:bg-blue-50/70 transition-all duration-300 font-medium group relative"
                            style={{
                              animationDelay: `${dropdownIndex * 0.1}s`,
                            }}
                          >
                            <div className="flex items-center">
                              <div>
                                <span className="relative z-10 block">
                                  {dropdownItem.label}
                                </span>
                              </div>
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full"></div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular nav items
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`relative flex items-center px-6 py-3 font-semibold transition-all duration-400 rounded-2xl group ${
                      item.label === "Login"
                        ? "text-blue-700 hover:text-blue-800 hover:bg-blue-50/70"
                        : item.label === "Register"
                        ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                        : "text-blue-700 hover:text-blue-800 hover:bg-blue-50/70"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="relative z-10 flex items-center">
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.label}
                    </span>

                    {item.label === "Register" ? (
                      <>
                        {/* Register button hover effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl scale-0 group-hover:scale-100 transition-all duration-500 origin-center"></div>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                      </>
                    ) : (
                      <>
                        {/* Login and other buttons hover effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl scale-0 group-hover:scale-100 transition-all duration-500 origin-center"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full"></div>
                      </>
                    )}
                  </a>
                )}
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
                <div key={item.label}>
                  {item.dropdown ? (
                    // Mobile dropdown items
                    <div className="space-y-2">
                      <div
                        className="px-6 py-3 font-semibold text-blue-700 rounded-2xl cursor-pointer"
                        onClick={(e) => handleSmoothScroll(e, item.href)}
                      >
                        <span className="flex items-center">{item.label}</span>
                      </div>
                      {item.dropdown.map((dropdownItem) => (
                        <a
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          onClick={(e) =>
                            handleSmoothScroll(e, dropdownItem.href)
                          }
                          className="block px-8 py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50/70 rounded-2xl transition-all duration-300 font-medium ml-4"
                        >
                          <div className="flex items-center">
                            <div>
                              <span className="block">
                                • {dropdownItem.label}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    // Regular mobile nav items
                    <a
                      href={item.href}
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                      className={`block px-6 py-4 font-semibold rounded-2xl transition-all duration-400 transform hover:translate-x-2 group ${
                        item.label === "Login"
                          ? "text-blue-700 hover:text-blue-800 hover:bg-blue-50/70"
                          : item.label === "Register"
                          ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-center shadow-lg"
                          : "text-blue-700 hover:text-blue-800 hover:bg-blue-50/70"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="flex items-center">
                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                        {item.label}
                      </span>
                      {(item.label === "Login" ||
                        item.label === "About" ||
                        item.label === "FAQs") && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full"></div>
                      )}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
