import { Package, Clock, Shield, ArrowRight, Zap, Star } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-x-hidden">
      {/* Enhanced Background with Glassmorphism */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage:
              "url('https   s://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="hidden md:flex items-center space-x-8">
          {["Services", "Tracking", "Pricing", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="relative text-gray-300 hover:text-white font-medium transition-all duration-500 group px-4 py-2 rounded-lg"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 group-hover:w-full" />
              <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-22">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent block drop-shadow-2xl">
                    Ship
                  </span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block transform hover:scale-105 transition-all duration-500 cursor-default drop-shadow-2xl relative">
                    Smarter
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl opacity-50" />
                  </span>
                  <span className="text-gray-300 block text-4xl lg:text-6xl font-bold drop-shadow-xl">
                    Deliver Faster
                  </span>
                </h1>

                <div className="flex items-center space-x-3 text-blue-400 group">
                  <div className="relative">
                    <Zap className="w-6 h-6 group-hover:text-yellow-400 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  </div>
                  <span className="text-lg font-medium tracking-wide">
                    Lightning Fast • Worldwide Coverage
                  </span>
                  <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </div>

              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl font-medium">
                Experience revolutionary shipping solutions with
                <span className="text-blue-400 font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}
                  real-time tracking
                </span>
                ,
                <span className="text-purple-400 font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  competitive rates
                </span>
                , and
                <span className="text-cyan-400 font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  unmatched reliability
                </span>{" "}
                for all your delivery needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 text-white px-12 py-6 rounded-3xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">Start Shipping Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/20 to-cyan-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>

              <button className="group relative border-2 border-blue-400/50 bg-white/5 backdrop-blur-xl text-blue-400 hover:bg-blue-400/10 hover:text-white px-12 py-6 rounded-3xl font-bold text-lg transition-all duration-500 flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-blue-400/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Package className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                <span className="relative z-10">Track Package</span>
              </button>
            </div>

            {/* Enhanced Stats with Glassmorphism */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
              {[
                {
                  icon: Package,
                  value: "2.5M+",
                  label: "Packages Delivered",
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  icon: Clock,
                  value: "99.9%",
                  label: "On-Time Delivery",
                  color: "from-green-400 to-emerald-400",
                },
                {
                  icon: Shield,
                  value: "24/7",
                  label: "Customer Support",
                  color: "from-purple-400 to-pink-400",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center group cursor-default relative"
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100" />
                  <div className="relative p-4">
                    <div className="flex items-center justify-center mb-3">
                      <stat.icon className="w-6 h-6 text-blue-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <div
                        className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 drop-shadow-lg`}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-gray-300 font-medium text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements with Glow Effects */}
      <div className="absolute top-1/4 right-12 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full opacity-80 animate-pulse shadow-2xl shadow-blue-500/20 backdrop-blur-xl" />
      <div className="absolute bottom-1/3 left-12 w-28 h-28 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full opacity-70 animate-bounce shadow-2xl shadow-purple-500/20 backdrop-blur-xl" />
      <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full opacity-60 animate-pulse shadow-xl shadow-cyan-500/20 backdrop-blur-xl" />
      <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full opacity-50 animate-bounce shadow-xl shadow-pink-500/20 backdrop-blur-xl" />

      {/* Geometric Shapes with Glow */}
      <div
        className="absolute top-20 left-1/4 w-12 h-12 border-2 border-blue-400/50 rotate-45 animate-spin opacity-40 shadow-xl shadow-blue-400/20 backdrop-blur-sm"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute bottom-24 right-20 w-10 h-10 bg-gradient-to-br from-purple-400/50 to-pink-400/50 rotate-12 animate-pulse opacity-50 shadow-xl shadow-purple-400/20 backdrop-blur-sm" />

      {/* Additional Modern Elements */}
      <div className="absolute top-32 right-32 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-ping" />
      <div className="absolute bottom-40 left-40 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-70 animate-pulse" />

      {/* Floating Particles */}
      <div
        className="absolute top-16 left-16 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "3s" }}
      />
      <div
        className="absolute top-2/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-16 right-16 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Glowing Orbs */}
      <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-transparent rounded-full blur-2xl animate-pulse opacity-30" />
      <div
        className="absolute bottom-1/2 right-1/2 w-36 h-36 bg-gradient-to-r from-purple-400/15 to-transparent rounded-full blur-3xl animate-pulse opacity-25"
        style={{ animationDelay: "1.5s" }}
      />
    </div>
  );
}
