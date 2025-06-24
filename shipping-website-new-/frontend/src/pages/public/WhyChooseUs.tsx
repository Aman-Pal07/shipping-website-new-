import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Award,
  Users,
  Truck,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  Globe,
} from "lucide-react";

const WhyChooseUs = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: Globe,
      title: "Global Network",
      description:
        "AI-powered logistics across 200+ countries with real-time optimization",
      gradient: "from-blue-900 via-blue-800 to-blue-700",
      accentColor: "blue-900",
      bgPattern:
        "radial-gradient(circle at 30% 30%, rgba(29, 78, 216, 0.1) 0%, transparent 50%)",
    },
    {
      icon: Shield,
      title: "Quantum Security",
      description:
        "Military-grade encryption with blockchain verification technology",
      gradient: "from-blue-800 via-blue-700 to-blue-600",
      accentColor: "blue-800",
      bgPattern:
        "radial-gradient(circle at 70% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)",
    },
    {
      icon: Zap,
      title: "Instant Support",
      description:
        "AI chatbots + human experts available 24/7 with predictive assistance",
      gradient: "from-blue-700 via-blue-600 to-blue-500",
      accentColor: "blue-700",
      bgPattern:
        "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
    },
    {
      icon: Award,
      title: "Industry Pioneer",
      description:
        "Leading innovation for 50+ years with 200+ international awards",
      gradient: "from-blue-600 via-blue-500 to-blue-400",
      accentColor: "blue-600",
      bgPattern:
        "radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.1) 0%, transparent 50%)",
    },
    {
      icon: Users,
      title: "Elite Team",
      description:
        "Hand-picked experts with NASA-level precision and dedication",
      gradient: "from-blue-500 via-blue-400 to-blue-300",
      accentColor: "blue-500",
      bgPattern:
        "radial-gradient(circle at 40% 60%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)",
    },
    {
      icon: Truck,
      title: "Hyperloop Delivery",
      description:
        "Revolutionary speed with drone integration and quantum tracking",
      gradient: "from-blue-400 via-blue-300 to-blue-200",
      accentColor: "blue-400",
      bgPattern:
        "radial-gradient(circle at 60% 40%, rgba(191, 219, 254, 0.1) 0%, transparent 50%)",
    },
  ];

  const stats = [
    {
      number: "200+",
      label: "Countries",
      icon: Globe,
      color: "from-blue-900 to-blue-700",
    },
    {
      number: "50M+",
      label: "Deliveries",
      icon: TrendingUp,
      color: "from-blue-800 to-blue-600",
    },
    {
      number: "99.9%",
      label: "Success Rate",
      icon: Shield,
      color: "from-blue-700 to-blue-500",
    },
    {
      number: "24/7",
      label: "AI Support",
      icon: Zap,
      color: "from-blue-600 to-blue-400",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden"
    >
      {/* Ultra-modern background with mesh gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] opacity-60"></div>

      {/* Dynamic mesh background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.05) 0%, transparent 50%)
          `,
          transform: `translate(${mousePosition.x * 0.02}px, ${
            mousePosition.y * 0.02
          }px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${20 + ((i * 15) % 80)}%`,
              top: `${10 + ((i * 23) % 80)}%`,
              transform: `rotate(${i * 30}deg) translateY(${
                Math.sin(scrollY * 0.01 + i) * 10
              }px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <div
              className={`w-16 h-16 border-2 border-blue-${
                300 + (i % 4) * 100
              } rounded-lg backdrop-blur-sm`}
            ></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Ultra-modern header */}
        <div className="text-center mb-24">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Floating badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/60 transition-all duration-300 group">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-5 h-5 text-blue-400 opacity-30" />
                </div>
              </div>
              <span>Why Choose GlobalShip?</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>

            {/* Revolutionary title */}
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.8] tracking-tight">
              <span className="block bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent relative">
                Excellence
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent blur-sm opacity-50 scale-105"></div>
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent mt-2">
                Redefined
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of logistics with our revolutionary
              AI-powered platform that transforms how the world moves.
            </p>
          </div>
        </div>

        {/* Revolutionary features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-700 hover:scale-105 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
                transform: `translateY(${
                  Math.sin(scrollY * 0.005 + index) * 2
                }px) scale(${activeCard === index ? 1.05 : 1})`,
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Ultra-modern card with dynamic background */}
              <div
                className="relative backdrop-blur-2xl bg-white/70 border border-white/60 rounded-3xl p-8 h-full overflow-hidden group-hover:bg-white/90 transition-all duration-500 shadow-xl shadow-blue-100/30 group-hover:shadow-2xl group-hover:shadow-blue-200/40"
                style={{
                  backgroundImage: feature.bgPattern,
                  backdropFilter: "blur(20px) saturate(180%)",
                }}
              >
                {/* Dynamic gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 rounded-3xl`}
                ></div>

                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-blue-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>

                {/* Floating particles effect */}
                {activeCard === index && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"
                        style={{
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`,
                          animationDelay: `${i * 100}ms`,
                          animationDuration: `${1 + Math.random()}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="relative z-10">
                  {/* Revolutionary icon design */}
                  <div className="mb-8 relative">
                    <div
                      className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl shadow-${feature.accentColor}/30 group-hover:shadow-3xl group-hover:shadow-${feature.accentColor}/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
                    >
                      <feature.icon className="h-12 w-12 text-white" />
                    </div>

                    {/* Pulsing ring effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl border-2 border-${feature.accentColor} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 animate-pulse`}
                    ></div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 font-medium">
                    {feature.description}
                  </p>

                  {/* Subtle hover arrow */}
                  <div className="mt-6 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm font-semibold mr-2">
                      Learn More
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revolutionary stats section */}
        <div
          className={`transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="relative backdrop-blur-3xl bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 border border-blue-100/50 rounded-[2rem] p-16 overflow-hidden shadow-2xl shadow-blue-100/50">
            {/* Dynamic background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)] bg-[length:60px_60px] animate-pulse"></div>

            {/* Floating orbs */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-500"
                  style={{
                    transform: `translateY(${
                      Math.sin(scrollY * 0.003 + index) * 3
                    }px) scale(${1 + (activeCard === index ? 0.1 : 0)})`,
                  }}
                >
                  <div className="mb-6 relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/90 to-blue-50/90 rounded-2xl backdrop-blur-xl border border-blue-200/50 group-hover:border-blue-300/70 transition-all duration-500 shadow-lg shadow-blue-100/50 group-hover:shadow-xl group-hover:shadow-blue-200/60 group-hover:rotate-6">
                      <stat.icon className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    </div>

                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 animate-pulse"></div>
                  </div>

                  <div
                    className={`text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
