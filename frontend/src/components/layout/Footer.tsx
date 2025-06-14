import {
  Package,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Clock,
  Shield,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Track Package", href: "/track" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Express Delivery", href: "/services/express" },
    { name: "Ocean Freight", href: "/services/ocean" },
    { name: "Air Freight", href: "/services/air" },
    { name: "Ground Transport", href: "/services/ground" },
    { name: "Customs Clearance", href: "/services/customs" },
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Shipping Guide", href: "/guide" },
    { name: "Package Insurance", href: "/insurance" },
    { name: "Bulk Shipping", href: "/bulk" },
    { name: "API Documentation", href: "/api" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR Compliance", href: "/gdpr" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  const features = [
    { icon: Globe, text: "Global Network" },
    { icon: Clock, text: "24/7 Support" },
    { icon: Shield, text: "Secure Delivery" },
  ];

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Package Tracker
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Your trusted global logistics partner, delivering excellence
              across 150+ countries.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                    <feature.icon className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-2 h-2 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-900">
              Services
            </h4>
            <ul className="space-y-1">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-2 h-2 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-900">
              Support
            </h4>
            <ul className="space-y-1">
              {support.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-2 h-2 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-900">
              Contact
            </h4>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2 mt-0.5">
                  <MapPin className="w-3 h-3 text-blue-600" />
                </div>
                <div className="text-gray-600 text-xs">
                  123 Shipping Lane
                  <br />
                  Mumbai, MH 400001
                  <br />
                  India
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                  <Phone className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-gray-600 text-xs">+91 123 456 7890</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                  <Mail className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-gray-600 text-xs">
                  info@packagetracker.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-600 text-xs">
                &copy; {currentYear} Package Tracker. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Trusted by 50,000+ businesses worldwide
              </p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-4">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-500 hover:text-blue-600 text-xs transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
