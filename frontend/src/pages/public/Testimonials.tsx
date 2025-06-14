import {
  Package,
  BarChart3,
  Route,
  MapPin,
  Truck,
  TrendingUp,
} from "lucide-react";

const ShippingFeatures = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
            Features
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shipping Experience
            </span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-medium text-gray-600 mb-8">
            with Powerful AI-Driven Features
          </h3>
          <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed">
            Discover next-generation logistics technology that revolutionizes
            how you manage, track, and optimize your global shipping operations
            with unprecedented precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-Time Shipment Tracking */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
              <div className="mb-8">
                {/* Modern Icon Design */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-xl">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Sleek Tracking Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700 font-bold text-sm">
                          BGR
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-transparent"></div>
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700 font-bold text-sm">
                          JKT
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                      #90120
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Estimated Delivery
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        Today 7:50 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Current Status
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-green-600">
                          In Transit
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full shadow-sm transition-all duration-1000"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered Real-Time Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Experience unprecedented visibility with machine
                learning-enhanced tracking that predicts delays and optimizes
                delivery routes in real-time.
              </p>
            </div>
          </div>

          {/* Smart Analytics Dashboard */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="mb-8">
                {/* Modern Icon Design */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-xl">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Advanced Analytics Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-bold text-gray-700">
                        Performance Score
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">Low</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        High
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 h-4 rounded-full shadow-sm transition-all duration-1000"
                        style={{ width: "85%" }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <span className="text-4xl font-black text-gray-900">
                        85%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        On-Time Rate
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        94.2%
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Cost Savings
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        $12.4K
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Analytics Dashboard
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transform data into actionable insights with advanced analytics
                that drive cost reduction and operational excellence across your
                supply chain.
              </p>
            </div>
          </div>

          {/* Dynamic Route Optimization */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 hover:-translate-y-1">
              <div className="mb-8">
                {/* Modern Icon Design */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-pink-600 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-xl">
                    <Route className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Smart Route Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Route className="h-5 w-5 text-pink-600" />
                      <span className="text-sm font-bold text-gray-700">
                        Smart Routing
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      OPTIMIZED
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Distance Saved
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        156 km
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Time Reduced
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        2.4 hrs
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Fuel Efficiency
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        +23%
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div className="relative">
                      <div className="w-16 h-10 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dynamic Route Optimization
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Leverage AI-driven algorithms that continuously adapt to traffic
                patterns, weather conditions, and delivery priorities for
                maximum efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Modern Call-to-Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer group">
            <span>Start Your Transformation Today</span>
            <div className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            Join thousands of businesses already using our platform
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShippingFeatures;
