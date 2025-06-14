import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Ship,
  Globe,
  Package,
  Truck,
  Star,
  CheckCircle,
  Zap,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 mt-[81px] mb-10">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs with Blue Accents */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

        {/* Geometric Shapes with Blue Accents */}
        <div className="absolute top-32 right-20 w-32 h-32 border-2 border-blue-200/40 rounded-2xl rotate-45 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-blue-100/30 to-blue-200/20 rounded-full animate-float"></div>

        {/* Additional Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-blue-300/30 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-r from-blue-50/40 to-gray-100/30 rounded-lg rotate-12 animate-float delay-3000"></div>
      </div>

      {/* Enhanced Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ship Icon with Blue Accent */}
        <div className="absolute top-32 left-20 animate-float">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-blue-200/30 shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-700 hover:shadow-blue-200/20">
            <Ship className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Globe Icon with Enhanced Styling */}
        <div className="absolute top-40 right-32 animate-float delay-1000">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-blue-200/30 shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-700 hover:shadow-blue-200/20">
            <Globe className="w-10 h-10 text-blue-700" />
          </div>
        </div>

        {/* Package Icon */}
        <div className="absolute bottom-40 left-32 animate-float delay-500">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-blue-200/30 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-700 hover:shadow-blue-200/20">
            <Package className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Truck Icon */}
        <div className="absolute bottom-32 right-20 animate-float delay-1500">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-blue-200/30 shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-700 hover:shadow-blue-200/20">
            <Truck className="w-10 h-10 text-blue-700" />
          </div>
        </div>

        {/* New Floating Icons */}
        <div className="absolute top-1/2 left-12 animate-float delay-2000">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-blue-100/40 shadow-lg">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="absolute top-1/3 right-12 animate-float delay-2500">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-blue-100/40 shadow-lg">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center px-6 py-3 mb-10 text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50/80 to-white/80 backdrop-blur-md border border-blue-200/50 rounded-full shadow-lg hover:shadow-blue-200/30 transition-all duration-300">
            <Star className="w-4 h-4 text-blue-500 mr-2 animate-pulse" />
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Trusted by 10,000+ businesses worldwide
          </div>

          {/* Enhanced Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-8 leading-none tracking-tight">
            <span className="block bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
              Global
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent transform -rotate-1 drop-shadow-sm">
              Shipping
            </span>
            <span className="block text-gray-900 text-5xl md:text-6xl lg:text-7xl mt-6 font-bold">
              <span className="bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </span>
          </h1>

          {/* Enhanced Subtitle */}
          <div className="mb-14 max-w-5xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed font-light">
              Experience the future of logistics with our
              <span className="text-blue-600 font-semibold">
                {" "}
                AI-powered
              </span>{" "}
              shipping platform.
            </p>
            <p className="text-lg md:text-xl text-gray-700 font-medium flex items-center justify-center flex-wrap gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              Fast, intelligent, and sustainable delivery to
              <span className="text-blue-600 font-bold">200+ countries</span>
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-blue-600/30 transition-all duration-500 hover:scale-105 border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                Start Shipping Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 backdrop-blur-md px-12 py-7 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105 bg-white/60 shadow-lg hover:shadow-blue-200/20"
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </Button>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
            <div className="group bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="text-4xl font-black text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-gray-700 font-semibold text-lg">
                Delivery Success Rate
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-3 mx-auto"></div>
            </div>
            <div className="group bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="text-4xl font-black text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-700 font-semibold text-lg">
                Real-time Tracking
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-3 mx-auto"></div>
            </div>
            <div className="group bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80">
              <div className="text-4xl font-black text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                200+
              </div>
              <div className="text-gray-700 font-semibold text-lg">
                Countries Covered
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }`,
        }}
      />
    </section>
  );
};

export default HeroSection;
