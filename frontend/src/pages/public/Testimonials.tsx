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
import trackingMapImage from "./img (4).png";
import image2 from "./img (6).png";
import image3 from "./img (5).png";

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
    <section
      className="py-16 bg-white relative mt-8"
      aria-label="Shipping Features"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Hero Title */}
          <div className="space-y-4">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transform Your Shipping Experience
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover next-generation logistics technology that revolutionizes
              how you manage, track, and optimize your global shipping
              operations with precision.
            </motion.p>
          </div>

          {/* Secondary Question/CTA */}
          <motion.div
            className="pt-8 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6">
              How to Ship With{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Parcel Up
              </span>
              ?
            </h2>

            {/* Optional: Add a subtle call-to-action */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="inline-flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <span>Get started in 3 simple steps</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Icons Preview */}
        {/* <motion.div
          className="flex justify-center items-center space-x-8 mt-16 opacity-60"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-600 rounded opacity-80"></div>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-600 rounded opacity-80"></div>
          </div>
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-pink-600 rounded opacity-80"></div>
          </div>
        </motion.div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative h-full"
              // variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              onMouseEnter={() => setActiveCard(feature.id)}
              onMouseLeave={() => setActiveCard(null)}
              role="region"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <div
                className={`bg-white rounded-xl p-5 transition-all duration-300 ${feature.border} flex flex-col h-full`}
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
                      {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
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
                      </div> */}
                      <img
                        src={trackingMapImage}
                        alt="Tracking Map"
                        className="w-full h-full object-cover rounded-md mb-4"
                      />
                    </div>
                  )}

                  {feature.analytics && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      {/* <div className="flex items-center justify-between mb-4">
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
                      </div> */}
                      <img
                        src={image2}
                        alt="Tracking Map"
                        className="w-full h-full object-cover rounded-md mb-4"
                      />
                    </div>
                  )}

                  {feature.routing && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      {/* <div className="flex items-center justify-between mb-4">
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
                      </div> */}
                      <img
                        src={image3}
                        alt="Routing Map"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <h3
                    id={`feature-${feature.id}-title`}
                    className="text-lg font-semibold text-gray-800 mb-2 "
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
            </div>
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
