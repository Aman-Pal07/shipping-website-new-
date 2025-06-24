import {
  Mail,
  Phone,
  ArrowRight,
  Facebook,
  Instagram,
  Globe,
  Clock,
  Shield,
  Package,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Track Package", href: "/dashboard/track" },
    { name: "Pricing", href: "/register" },
    // { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Express Delivery", href: "/services/express" },
    { name: "Ocean Freight", href: "/services/ocean" },
    { name: "Air Freight", href: "/services/air" },
    { name: "Ground Transport", href: "/services/ground" },
    { name: "Customs Clearance", href: "/services/customs" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR Compliance", href: "/gdpr" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: " https://www.facebook.com/share/1GCk6d8c7T/?mibextid=wwXIfr ",
      color: "hover:bg-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/parcelup.in?igsh=MTEyczlmNTY5MWtocA==",
      color: "hover:bg-pink-600",
    },
  ];

  const features = [
    { icon: Globe, text: "Global Network", color: "text-blue-600" },
    { icon: Clock, text: "24/7 Support", color: "text-green-600" },
    { icon: Shield, text: "Secure Delivery", color: "text-purple-600" },
    { icon: Package, text: "Fast Shipping", color: "text-orange-600" },
  ];

  return (
    <footer className="relative bg-gradient-to-br bg-white text-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-600/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-18 py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-20">
          {/* Brand Section - Left Aligned */}
          <div className="lg:w-1/3 space-y-4">
            <div className="flex items-center -ml-7">
              <img src="/e2.png" alt="PARCELUP Logo" className="h-16 w-auto" />
            </div>

            <p className="text-gray-800 leading-relaxed max-w-md">
              Your trusted global logistics partner, connecting businesses from
              10+ countries to India with innovative shipping solutions and
              unmatched reliability.
            </p>

            {/* Enhanced Features */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/10`}
                  >
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold mb-3 ">Stay Updated</h4>
              <p className=" text-sm mb-4">
                Get the latest shipping updates and exclusive offers.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2  placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Columns - Equal Spacing */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 ml-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></div>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className=" hover:text-blue-400 transition-all duration-300 flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                      <span className="relative">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6  flex items-center ml-4">
                <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3"></div>
                Services
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href={service.href}
                      className=" hover:text-green-400 transition-all duration-300 flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                      <span className="relative">
                        {service.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-6 ml-4  flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                Get In Touch
              </h4>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Phone className="w-5 h-5 " />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Call Us</p>
                    <p className=" font-medium">+91 9289933290</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-10 h-10 px-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Mail className="w-5 h-5 " />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email Us</p>
                    <p className=" font-medium">support@parcelup.in</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Social Links */}
              <div className="ml-4">
                <p className=" mb-6">Follow us on social media</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 ${social.color} hover: transition-all duration-300 transform hover:scale-110 hover:rotate-6 shadow-lg`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Section */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="">
                &copy; {currentYear}{" "}
                <span className="font-semibold ">ParcelUp</span>. All rights
                reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className=" hover: text-sm transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
