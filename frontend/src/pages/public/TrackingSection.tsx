import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, MapPin } from "lucide-react";

const TrackingSection = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      console.log("Tracking:", trackingNumber);
      // Here you would implement actual tracking logic
    }
  };

  return (
    <section
      id="tracking"
      className="py-20 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Shipment
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your
            shipment's location and delivery status
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., GS123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>
              <Button
                onClick={handleTrack}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 text-lg font-semibold rounded-lg transition-colors duration-200"
              >
                <Search className="mr-2 h-5 w-5" />
                Track
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Quick tracking examples:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["GS123456789", "GS987654321", "GS456789123"].map(
                  (example) => (
                    <button
                      key={example}
                      onClick={() => setTrackingNumber(example)}
                      className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      {example}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Tracking Status Preview */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Tracking Activity
              </h3>
              <span className="text-green-600 font-medium">In Transit</span>
            </div>
            <div className="space-y-3">
              {[
                {
                  location: "Los Angeles, CA",
                  status: "Departed facility",
                  time: "2 hours ago",
                },
                {
                  location: "Phoenix, AZ",
                  status: "In transit",
                  time: "6 hours ago",
                },
                {
                  location: "Denver, CO",
                  status: "Arrived at facility",
                  time: "12 hours ago",
                },
              ].map((update, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">
                        {update.location}
                      </span>
                      <span className="text-sm text-gray-500">
                        {update.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{update.status}</p>
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

export default TrackingSection;
