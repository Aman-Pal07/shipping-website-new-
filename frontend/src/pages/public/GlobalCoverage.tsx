import { Globe } from "lucide-react";

const GlobalCoverage = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white text-gray-800 overflow-hidden mt-[-100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center  relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600  shadow-lg">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-6 p-[8px] bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Global Coverage
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our extensive network spans across all continents, connecting your
            business to every corner of the world with reliable shipping
            solutions and unmatched global reach.
          </p>
        </div>

        {/* World Map Visualization */}
        <div className="  ">
          <div className="relative">
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <div className="absolute inset-0">
                <img
                  src="/1.jpg"
                  alt="World Map showing global shipping routes"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalCoverage;
