import { Button } from "@/components/ui/button";
import {
  Package,
  Plane,
  Ship,
  Truck,
  ArrowRight,
  Clock,
  Shield,
  Globe,
} from "lucide-react";

const OurServices = () => {
  const services = [
    {
      icon: Package,
      title: "Express Delivery",
      description:
        "Fast, reliable express shipping for urgent deliveries worldwide with guaranteed time slots.",
      features: [
        "Next-day delivery",
        "Real-time tracking",
        "Insurance included",
      ],
      gradient: "from-[#031EC4] to-[#5341EC]",
      bgColor: "bg-gradient-to-br from-[#031EC4]/5 to-[#5341EC]/5",
      iconBg: "bg-gradient-to-br from-[#031EC4] to-[#5341EC]",
      image:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      icon: Ship,
      title: "Ocean Freight",
      description:
        "Cost-effective sea freight solutions for large cargo shipments with global coverage.",
      features: [
        "FCL & LCL options",
        "Global port coverage",
        "Customs clearance",
      ],
      gradient: "from-[#5341EC] to-[#7C95D1]",
      bgColor: "bg-gradient-to-br from-[#5341EC]/5 to-[#7C95D1]/5",
      iconBg: "bg-gradient-to-br from-[#5341EC] to-[#7C95D1]",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      icon: Plane,
      title: "Air Freight",
      description:
        "Premium air cargo services for time-sensitive shipments with special handling.",
      features: [
        "Same-day delivery",
        "Temperature control",
        "Special handling",
      ],
      gradient: "from-[#7C95D1] to-[#DCE3FF]",
      bgColor: "bg-gradient-to-br from-[#7C95D1]/5 to-[#DCE3FF]/5",
      iconBg: "bg-gradient-to-br from-[#7C95D1] to-[#DCE3FF]",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      icon: Truck,
      title: "Ground Transport",
      description:
        "Reliable land transportation across continents with flexible scheduling options.",
      features: [
        "Door-to-door service",
        "Flexible scheduling",
        "Cargo security",
      ],
      gradient: "from-[#DCE3FF] to-[#F6F8FF]",
      bgColor: "bg-gradient-to-br from-[#DCE3FF]/5 to-[#F6F8FF]/5",
      iconBg: "bg-gradient-to-br from-[#DCE3FF] to-[#031EC4]",
      image:
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const stats = [
    { icon: Globe, number: "150+", label: "Countries Served" },
    { icon: Clock, number: "24/7", label: "Customer Support" },
    { icon: Shield, number: "99.9%", label: "Delivery Success" },
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#031EC4]/5 to-transparent rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#5341EC]/5 to-transparent rounded-full blur-3xl translate-x-48 translate-y-48" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#031EC4]/10 to-[#5341EC]/10 rounded-full text-[#031EC4] font-medium text-sm mb-6">
            <Package className="w-4 h-4 mr-2" />
            Our Services
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#031EC4] via-[#5341EC] to-[#7C95D1] bg-clip-text text-transparent mb-6 leading-tight">
            Logistics Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive logistics solutions tailored to your business needs,
            from express delivery to complex supply chain management across the
            globe.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#031EC4] to-[#5341EC] rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.bgColor} rounded-3xl p-8 group hover:scale-[1.02] transition-all duration-500 border border-white/20 backdrop-blur-sm relative overflow-hidden`}
            >
              {/* Decorative gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
              />

              <div className="relative z-10">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${service.iconBg} rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#031EC4] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-gray-700 group/feature hover:text-[#031EC4] transition-colors duration-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#031EC4] to-[#5341EC] flex items-center justify-center mr-3 flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-gradient-to-r from-[#031EC4] to-[#5341EC] hover:from-[#5341EC] hover:to-[#7C95D1] text-white border-0 h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
