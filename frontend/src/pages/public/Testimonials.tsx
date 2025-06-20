import {
  Package,
  BarChart3,
  Route,
  MapPin,
  Truck,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const ShippingFeatures = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      icon: Package,
      title: "Ship Your Products to Our Warehouses",
      description:
        "find our international warehouse addresses in your panel when you login/register.",
      gradient: "from-blue-500 to-blue-700",
      border: "hover:border-blue-200",
      bgGradient: "from-blue-100 to-blue-200",
      tracking: {
        from: "BGR",
        to: "JKT",
        orderId: "#90120",
        delivery: "Today 7:50 PM",
        status: "In Transit",
        progress: 75,
      },
    },
    {
      id: 2,
      icon: BarChart3,
      title: "Upload Tracking Details on the Panel",
      description:
        "Upload all the tracking details associated with your shipment on the “Track Package” section on the panel.",
      gradient: "from-purple-500 to-purple-700",
      border: "hover:border-purple-200",
      bgGradient: "from-purple-100 to-purple-200",
      analytics: {
        score: 85,
        onTime: 94.2,
        savings: 12.4,
      },
    },
    {
      id: 3,
      icon: Route,
      title: "Payment on arrival ",
      description:
        "Sit back and relax as our team works to deliver the shipment to your doorstep within 5-15 days. ",
      gradient: "from-pink-500 to-pink-700",
      border: "hover:border-pink-200",
      bgGradient: "from-pink-100 to-pink-200",
      routing: {
        distance: 156,
        time: 2.4,
        fuel: 23,
      },
    },
  ];

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  return (
    <section
      className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      aria-label="Shipping Features"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.6, 0.5] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Animation */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <motion.div
              className="w-2 h-2 bg-white rounded-full mr-2"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shipping Experience
            </span>
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-600 mb-8">
            with Powerful AI-Driven Features
          </h3>
          <p className="text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed">
            Discover next-generation logistics technology that revolutionizes
            how you manage, track, and optimize your global shipping operations
            with unprecedented precision.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="group relative h-full flex"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
              role="region"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm`}
              />
              <div
                className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 ${feature.border} flex flex-col w-full`}
              >
                <div className="flex-1">
                  {/* Icon with Animation */}
                  <div className="relative mb-8">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-lg opacity-20`}
                    />
                    <motion.div
                      className={`relative bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-xl`}
                      animate={{
                        rotate:
                          hoveredCard === feature.id ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon
                        className="h-8 w-8 text-white"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </div>

                  {/* Feature-Specific Content */}
                  {feature.tracking && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
                            <MapPin
                              className="h-4 w-4 text-blue-600"
                              aria-hidden="true"
                            />
                            <span className="text-blue-700 font-bold text-sm">
                              {feature.tracking.from}
                            </span>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-transparent" />
                          <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
                            <Truck
                              className="h-4 w-4 text-blue-600"
                              aria-hidden="true"
                            />
                            <span className="text-blue-700 font-bold text-sm">
                              {feature.tracking.to}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                          {feature.tracking.orderId}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Estimated Delivery
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {feature.tracking.delivery}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Current Status
                          </span>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="text-sm font-bold text-green-600">
                              {feature.tracking.status}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${feature.tracking.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.analytics && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <TrendingUp
                            className="h-5 w-5 text-purple-600"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-bold text-gray-700">
                            Performance Score
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Low
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            High
                          </span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 h-4 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${feature.analytics.score}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
                        </div>
                        <div className="text-center">
                          <motion.span
                            className="text-4xl font-black text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            {feature.analytics.score}%
                          </motion.span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 mb-1">
                            On-Time Rate
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {feature.analytics.onTime}%
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 mb-1">
                            Cost Savings
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            ${feature.analytics.savings}K
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.routing && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Route
                            className="h-5 w-5 text-pink-600"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-bold text-gray-700">
                            Smart Routing
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          OPTIMIZED
                        </div>
                      </div>
                      <div className="space-y-4">
                        <motion.div
                          className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            Distance Saved
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            {feature.routing.distance} km
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            Time Reduced
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            {feature.routing.time} hrs
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            Fuel Efficiency
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            +{feature.routing.fuel}%
                          </span>
                        </motion.div>
                      </div>
                      <div className="mt-6 flex justify-center">
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-16 h-10 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Truck
                              className="h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <h3
                    id={`feature-${feature.id}-title`}
                    className="text-2xl font-bold text-gray-900 mb-4"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <motion.button
                    className="mt-4 flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900"
                    whileHover={{ x: 5 }}
                    aria-label={`Learn more about ${feature.title}`}
                  >
                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call-to-Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            className="inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Start your shipping transformation"
          >
            <span>Start Your Transformation Today</span>
            <motion.div
              className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <ChevronRight className="w-3 h-3 text-white" />
            </motion.div>
          </motion.button>
          <p className="text-gray-500 mt-4 text-sm">
            Join thousands of businesses already using our platform
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ShippingFeatures;
