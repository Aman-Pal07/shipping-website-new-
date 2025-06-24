import {
  Truck,
  Ship,
  Plane,
  MapPin,
  FileCheck,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState } from "react";

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      icon: Truck,
      title: "Express Delivery",
      description:
        "Same-day and next-day Domestic delivery options for urgent shipments across major Indian cities.",
      gradient: "from-blue-500 to-blue-700",
      border: "hover:border-blue-200",
      bgGradient: "from-blue-100 to-blue-200",
      features: [
        "Same-day delivery",
        "Next-day delivery",
        "Real-time tracking",
        "Priority handling",
      ],
    },
    {
      id: 2,
      icon: Ship,
      title: "Ocean Freight",
      description:
        "Cost-effective international shipping solutions for large volume shipments with competitive transit times.",
      gradient: "from-cyan-500 to-cyan-700",
      border: "hover:border-cyan-200",
      bgGradient: "from-cyan-100 to-cyan-200",
      features: ["FCL & LCL options", "Door-to-door service", "Global network"],
    },
    {
      id: 3,
      icon: Plane,
      title: "Air Freight",
      description:
        "Fast and reliable air cargo services for time-sensitive international and domestic shipments.",
      gradient: "from-purple-500 to-purple-700",
      border: "hover:border-purple-200",
      bgGradient: "from-purple-100 to-purple-200",
      features: [
        "Express air service",
        "Cargo consolidation",
        "Temperature control",
        "Fragile handling",
      ],
    },
    {
      id: 4,
      icon: MapPin,
      title: "Ground Transport",
      description:
        "Comprehensive land transportation network covering pan-India delivery with flexible scheduling.",
      gradient: "from-green-500 to-green-700",
      border: "hover:border-green-200",
      bgGradient: "from-green-100 to-green-200",
      features: [
        "Pan-India coverage",
        "Flexible scheduling",
        "Load optimization",
        "Route planning",
      ],
    },
    {
      id: 5,
      icon: FileCheck,
      title: "Customs Clearance",
      description:
        "Expert customs brokerage services ensuring smooth clearance of international shipments with compliance.",
      gradient: "from-orange-500 to-orange-700",
      border: "hover:border-orange-200",
      bgGradient: "from-orange-100 to-orange-200",
      features: [
        "Document preparation",
        "Duty calculation",
        "Compliance support",
        "Fast clearance",
      ],
    },
  ];

  const whyChooseUs = [
    {
      icon: Star,
      title: "Reliable Service",
      description: "99.9% on-time delivery rate with real-time tracking",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: MapPin,
      title: "Global Reach",
      description: "Extensive network covering 200+ countries worldwide",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      icon: FileCheck,
      title: "Expert Support",
      description: "24/7 customer support with logistics expertise",
      gradient: "from-cyan-500 to-cyan-700",
    },
  ];

  return (
    <section
      id="services"
      className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            OUR SERVICES
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Modern Logistics{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Efficient, reliable, and innovative shipping services designed to
            meet your unique needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 ${service.border} transform hover:scale-105`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Hover background effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="relative mb-8">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl blur-lg opacity-20`}
                  />
                  <div
                    className={`relative bg-gradient-to-br ${
                      service.gradient
                    } rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-xl transform transition-transform duration-300 ${
                      hoveredCard === service.id ? "rotate-12" : ""
                    }`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 group">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ParcelUp?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our comprehensive logistics
              solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-full mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center">
          <a
            href="/register"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:scale-105 active:scale-95 no-underline"
          >
            <span>Get Started Today</span>
            <div className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            Join thousands of businesses trusting ParcelUp for their logistics
            needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
