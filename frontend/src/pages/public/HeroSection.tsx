import { Package, Clock, Zap, Globe, Users, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="relative bg-slate-900">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundAttachment: "scroll",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
        </div>

        {/* Floating Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-20">
          <div className="text-center space-y-12">
            {/* Main Heading */}
            <div className="space-y-10 mt-10">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight relative">
                <div className="relative inline-block">
                  <span
                    className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent block animate-gradient"
                    style={{
                      filter: "drop-shadow(0 4px 20px rgba(255,255,255,0.3))",
                      textShadow: "0 0 30px rgba(255,255,255,0.5)",
                    }}
                  >
                    Ship
                  </span>
                  {/* Enhanced text shadow blur */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent blur-sm opacity-30 animate-gradient">
                    Ship
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-3xl opacity-60 animate-pulse-slow" />
                </div>
                <div className="relative inline-block mt-4">
                  <span
                    className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block hover:scale-105 transition-transform duration-500 cursor-default animate-gradient"
                    style={{
                      filter: "drop-shadow(0 4px 20px rgba(59,130,246,0.4))",
                      textShadow: "0 0 30px rgba(147,51,234,0.5)",
                    }}
                  >
                    Smarter
                  </span>
                  {/* Enhanced text shadow blur */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-40 animate-gradient">
                    Smarter
                  </div>
                  <div className="absolute -inset-8 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-cyan-400/50 blur-3xl opacity-60 animate-pulse-slow" />
                </div>
                <div className="relative">
                  <span
                    className="text-gray-300 block text-4xl md:text-6xl lg:text-7xl font-bold mt-4"
                    style={{
                      filter: "drop-shadow(0 4px 15px rgba(209,213,219,0.3))",
                      textShadow: "0 0 20px rgba(209,213,219,0.3)",
                    }}
                  >
                    Deliver Faster
                  </span>
                  {/* Enhanced text shadow blur */}
                  <div className="absolute inset-0 text-gray-300 block text-4xl md:text-6xl lg:text-7xl font-bold mt-4 blur-sm opacity-30">
                    Deliver Faster
                  </div>
                </div>
                {/* Added a subtle background layer for extra depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 blur-3xl opacity-30 animate-gradient-bg" />
              </h1>

              <div className="max-w-4xl mx-auto space-y-6 relative">
                {/* Background blur layer for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 blur-3xl opacity-30 animate-gradient-bg" />

                <div className="flex items-center justify-center space-x-4 text-blue-400 relative">
                  <Zap
                    className="w-6 h-6 animate-pulse text-blue-400"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(59,130,246,0.6))",
                    }}
                  />
                  <div className="relative">
                    <span
                      className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                      style={{
                        filter: "drop-shadow(0 2px 10px rgba(59,130,246,0.4))",
                        textShadow: "0 0 15px rgba(34,211,238,0.4)",
                      }}
                    >
                      Lightning Fast • Global Network • 24/7 Support
                    </span>
                    {/* Text shadow blur */}
                    <div className="absolute inset-0 text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-40">
                      Lightning Fast • Global Network • 24/7 Support
                    </div>
                  </div>
                  <Globe
                    className="w-6 h-6 animate-spin slow-spin text-cyan-400"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))",
                    }}
                  />
                  {/* Subtle glow effect behind icons and text */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-2xl opacity-50 animate-pulse-slow" />
                </div>

                <div className="relative">
                  <p
                    className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium max-w-3xl mx-auto relative"
                    style={{
                      filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.5))",
                      textShadow: "0 0 15px rgba(0,0,0,0.5)",
                    }}
                  >
                    Transform your logistics with our revolutionary shipping
                    platform. Get
                    <span
                      className="text-blue-400 font-bold relative"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.4))",
                        textShadow: "0 0 12px rgba(59,130,246,0.4)",
                      }}
                    >
                      {" "}
                      real-time tracking
                      <div className="absolute -inset-2 bg-blue-500/20 blur-xl opacity-60 animate-pulse-slow" />
                    </span>
                    ,
                    <span
                      className="text-purple-400 font-bold relative"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(147,51,234,0.4))",
                        textShadow: "0 0 12px rgba(147,51,234,0.4)",
                      }}
                    >
                      {" "}
                      competitive rates
                      <div className="absolute -inset-2 bg-purple-500/20 blur-xl opacity-60 animate-pulse-slow" />
                    </span>
                    , and
                    <span
                      className="text-cyan-400 font-bold relative"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(34,211,238,0.4))",
                        textShadow: "0 0 12px rgba(34,211,238,0.4)",
                      }}
                    >
                      {" "}
                      guaranteed delivery
                      <div className="absolute -inset-2 bg-cyan-500/20 blur-xl opacity-60 animate-pulse-slow" />
                    </span>{" "}
                    worldwide.
                    {/* Subtle underline glow for highlighted text */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-sm opacity-70 animate-gradient" />
                  </p>
                  {/* Enhanced paragraph text shadow */}
                  <div className="absolute inset-0 text-xl md:text-2xl text-gray-300 leading-relaxed font-medium max-w-3xl mx-auto blur-sm opacity-20">
                    Transform your logistics with our revolutionary shipping
                    platform. Get real-time tracking, competitive rates, and
                    guaranteed delivery worldwide.
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 flex items-center space-x-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Rocket
                    className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                    style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}
                  />
                  <div className="relative z-10">
                    <span
                      style={{
                        filter: "drop-shadow(0 2px 6px rgba(59,130,246,0.4))",
                        textShadow: "0 0 10px rgba(59,130,246,0.3)",
                      }}
                    >
                      <Link to="/register">Start Shipping</Link>
                    </span>
                    {/* Button text shadow */}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="mt-24 relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Package,
                  value: "5M+",
                  label: "Packages Delivered",
                  color: "blue",
                  delay: "0s",
                },
                {
                  icon: Clock,
                  value: "99.9%",
                  label: "On-Time Rate",
                  color: "green",
                  delay: "0.2s",
                },
                {
                  icon: Globe,
                  value: "180+",
                  label: "Countries",
                  color: "purple",
                  delay: "0.4s",
                },
                {
                  icon: Users,
                  value: "50K+",
                  label: "Happy Customers",
                  color: "cyan",
                  delay: "0.6s",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="text-center space-y-4">
                    <div
                      className={`w-20 h-20 mx-auto bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                    >
                      <stat.icon
                        className={`w-10 h-10 text-${stat.color}-400`}
                        style={{
                          filter: `drop-shadow(0 2px 8px rgba(${
                            stat.color === "blue"
                              ? "59,130,246"
                              : stat.color === "green"
                              ? "34,197,94"
                              : stat.color === "purple"
                              ? "147,51,234"
                              : "34,211,238"
                          },0.5))`,
                        }}
                      />
                    </div>
                    <div className="relative">
                      <div
                        className={`text-5xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 bg-clip-text text-transparent`}
                        style={{
                          filter: `drop-shadow(0 4px 15px rgba(${
                            stat.color === "blue"
                              ? "59,130,246"
                              : stat.color === "green"
                              ? "34,197,94"
                              : stat.color === "purple"
                              ? "147,51,234"
                              : "34,211,238"
                          },0.4))`,
                          textShadow: `0 0 20px rgba(${
                            stat.color === "blue"
                              ? "59,130,246"
                              : stat.color === "green"
                              ? "34,197,94"
                              : stat.color === "purple"
                              ? "147,51,234"
                              : "34,211,238"
                          },0.4)`,
                        }}
                      >
                        {stat.value}
                      </div>
                      {/* Stats value shadow */}
                      <div
                        className={`absolute inset-0 text-5xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 bg-clip-text text-transparent blur-sm opacity-30`}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        className="text-gray-300 font-semibold"
                        style={{
                          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
                          textShadow: "0 0 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        {stat.label}
                      </div>
                      {/* Stats label shadow */}
                      <div className="absolute inset-0 text-gray-300 font-semibold blur-sm opacity-20">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-${stat.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-blue-400/30 rotate-45 animate-spin-slow opacity-60" />
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rotate-12 animate-pulse opacity-50" />
        <div className="absolute bottom-40 left-1/4 w-8 h-8 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full animate-bounce opacity-70" />
        <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-full animate-ping opacity-60" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse opacity-40" />
        <div
          className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse opacity-30"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        .slow-spin {
          animation: spin 4s linear infinite;
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.6;
          }
        }

        @keyframes gradient-bg {
          0% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(10px);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-gradient-bg {
          animation: gradient-bg 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
