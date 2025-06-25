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
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      icon: Package,
      title: "Ship Your Products to Our Warehouses",
      description:
        "find our international warehouse addresses in your panel when you login/register.",
      gradient: "from-blue-500 to-blue-700",
      border: "hover:border-blue-200",
      bgGradient: "bg-blue-50",
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
      bgGradient: "bg-purple-50",
      analytics: {
        score: 85,
        onTime: 94.2,
        savings: 12.4,
      },
    },
    {
      id: 3,
      icon: Route,
      title: "Payment on arrival",
      description:
        "Sit back and relax as our team works to deliver the shipment to your doorstep within 5-15 days.",
      gradient: "from-pink-500 to-pink-700",
      border: "hover:border-pink-200",
      bgGradient: "bg-pink-50",
      routing: {
        distance: 156,
        time: 2.4,
        fuel: 23,
      },
    },
  ];

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.01, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
  };

  return (
    <section className="py-16 bg-white relative" aria-label="Shipping Features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent p-1">
            Transform Your Shipping Experience
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Discover next-generation logistics technology that revolutionizes
            how you manage, track, and optimize your global shipping operations
            with precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="relative h-full"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              onMouseEnter={() => setActiveCard(feature.id)}
              onMouseLeave={() => setActiveCard(null)}
              role="region"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <div
                className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 ${feature.border} flex flex-col h-full`}
              >
                <div className="flex-1">
                  <div className="relative mb-4">
                    <motion.div
                      className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-2 w-10 h-10 flex items-center justify-center`}
                      animate={{ scale: activeCard === feature.id ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </div>

                  {feature.tracking && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <div className="flex items-center space-x-1 bg-blue-50 rounded-full px-3 py-1">
                            <MapPin
                              className="h-3 w-3 text-blue-600"
                              aria-hidden="true"
                            />
                            <span className="text-blue-700 font-semibold text-xs">
                              {feature.tracking.from}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 bg-blue-50 rounded-full px-3 py-1">
                            <Truck
                              className="h-3 w-3 text-blue-600"
                              aria-hidden="true"
                            />
                            <span className="text-blue-700 font-semibold text-xs">
                              {feature.tracking.to}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                          {feature.tracking.orderId}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            Estimated Delivery
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            {feature.tracking.delivery}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            Current Status
                          </span>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              className="w-1.5 h-1.5 bg-green-500 rounded-full"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5 }}
                            />
                            <span className="text-xs font-semibold text-green-600">
                              {feature.tracking.status}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                          <motion.div
                            className="h-1.5 rounded-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${feature.tracking.progress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.analytics && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <TrendingUp
                            className="h-4 w-4 text-purple-600"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-semibold text-gray-700">
                            Performance Score
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${feature.analytics.score}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {feature.analytics.score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">
                            On-Time Rate
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            {feature.analytics.onTime}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">
                            Cost Savings
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            ${feature.analytics.savings}K
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.routing && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Route
                            className="h-4 w-4 text-pink-600"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-semibold text-gray-700">
                            Smart Routing
                          </span>
                        </div>
                        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          OPTIMIZED
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
                          <span className="text-xs text-gray-600">
                            Distance Saved
                          </span>
                          <span className="text-xs font-semibold text-purple-600">
                            {feature.routing.distance} km
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
                          <span className="text-xs text-gray-600">
                            Time Reduced
                          </span>
                          <span className="text-xs font-semibold text-purple-600">
                            {feature.routing.time} hrs
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
                          <span className="text-xs text-gray-600">
                            Fuel Efficiency
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            +{feature.routing.fuel}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <h3
                    id={`feature-${feature.id}-title`}
                    className="text-lg font-semibold text-gray-800 mb-2"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    aria-label={`Learn more about ${feature.title}`}
                  >
                    Learn More <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 text-sm mb-4">
              Join thousands of businesses already using our platform
            </p>
            <a
              href="#"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Get Started Today
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShippingFeatures;
