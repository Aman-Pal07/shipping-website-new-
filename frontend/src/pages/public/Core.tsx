import { Shield, Users, TrendingUp } from "lucide-react";

export default function Core() {
  const values = [
    {
      icon: Shield,
      title: "Reliability",
      description:
        "We understand that timely delivery is critical. That's why we've built our systems and processes to be reliable in every situation.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Our customers' needs drive our business. We listen, adapt, and go the extra mile to ensure complete satisfaction with every interaction.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description:
        "We constantly seek better ways to serve our customers through technological advancements and process improvements.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-600/3 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At ParcelUp, our values guide everything we do — from how we treat
            our customers to how we handle your packages.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`${value.bgColor} rounded-2xl p-8 border border-white/50 hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group relative overflow-hidden`}
            >
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`${value.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${value.color} rounded-lg flex items-center justify-center`}
                  >
                    <value.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors pb-2">
                  {value.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <value.icon className="w-20 h-20 text-gray-400" />
                </div>

                {/* Bottom Accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full`}
                ></div>
              </div>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
