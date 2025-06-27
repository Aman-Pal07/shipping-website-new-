import { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle,
  Filter,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchAllPackages,
  updatePackageStatus,
} from "../../features/packages/packageSlice";
import { PackageWithCustomer } from "../../types/package";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updatePackageDimensions } from "../../features/packages/packageSlice";
import { useForm } from "react-hook-form";

interface DimensionsFormData {
  width: string;
  height: string;
  length: string;
  unit: "cm" | "in" | "m" | "ft";
}

export default function Track() {
  const dispatch = useDispatch<AppDispatch>();
  const { allPackages, isLoading } = useSelector(
    (state: RootState) => state.packages
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PackageWithCustomer | null>(null);

  const [showDimensionsModal, setShowDimensionsModal] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DimensionsFormData>({
    defaultValues: {
      width: "",
      height: "",
      length: "",
      unit: "cm",
    },
  });

  const handleOpenDimensionsModal = (pkg: PackageWithCustomer) => {
    setCurrentPackageId(pkg._id || pkg.id || null);
    reset({
      width: pkg.dimensions?.width?.toString() || "",
      height: pkg.dimensions?.height?.toString() || "",
      length: pkg.dimensions?.length?.toString() || "",
      unit: (pkg.dimensions?.unit as "cm" | "in" | "m" | "ft") || "cm",
    });
    setShowDimensionsModal(true);
  };

  const handleUpdateDimensions = async (data: DimensionsFormData) => {
    if (!currentPackageId) return;

    try {
      const dimensions = {
        width: parseFloat(data.width) || 0,
        height: parseFloat(data.height) || 0,
        length: parseFloat(data.length) || 0,
        unit: data.unit,
      };

      // Optimistically update the UI
      setLocalPackages((currentPackages) =>
        currentPackages.map((pkg) => {
          const pkgId = pkg._id || pkg.id;
          if (pkgId === currentPackageId) {
            return {
              ...pkg,
              dimensions: {
                ...(pkg.dimensions || {}),
                ...dimensions,
              },
            };
          }
          return pkg;
        })
      );

      // Update selectedPackage if it's the one being updated
      if (selectedPackage) {
        const selectedPkgId = selectedPackage._id || selectedPackage.id;
        if (selectedPkgId === currentPackageId) {
          setSelectedPackage({
            ...selectedPackage,
            dimensions: {
              ...(selectedPackage.dimensions || {}),
              ...dimensions,
            },
          });
        }
      }

      // Dispatch the update to the server
      await dispatch(
        updatePackageDimensions({
          packageId: currentPackageId,
          dimensions,
        })
      ).unwrap();

      // Refresh the data from the server to ensure consistency
      const resultAction = await dispatch(fetchAllPackages());
      const updatedPackages = resultAction.payload as PackageWithCustomer[];

      // Update localPackages with the fresh data from the server
      setLocalPackages(updatedPackages);

      // Update selectedPackage if it exists in the updated packages
      if (selectedPackage) {
        const updatedPkg = updatedPackages.find(
          (pkg) => pkg._id === currentPackageId || pkg.id === currentPackageId
        );

        if (updatedPkg) {
          setSelectedPackage(updatedPkg);
        }
      }

      toast.success("Package dimensions updated successfully");
      setShowDimensionsModal(false);
    } catch (error) {
      console.error("Failed to update dimensions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update dimensions";
      toast.error(errorMessage);

      // Revert to the original data on error
      dispatch(fetchAllPackages());
    }
  };
  const { getStatusColor, getStatusLabel } = usePackageStatus();

  useEffect(() => {
    dispatch(fetchAllPackages());
  }, [dispatch]);

  // Local state for packages to avoid unnecessary refreshes
  const [localPackages, setLocalPackages] = useState<PackageWithCustomer[]>([]);

  // Track package status changes locally
  const [packageStatuses, setPackageStatuses] = useState<
    Record<string, string>
  >({});

  // Update local packages when redux state changes
  useEffect(() => {
    if (allPackages.length > 0) {
      // Create a deep copy to avoid reference issues
      const packagesWithLocalStatus = allPackages.map((pkg) => {
        const packageId = pkg._id || pkg.id;
        // If we have a locally saved status for this package, use it
        if (packageId && packageStatuses[packageId]) {
          return {
            ...pkg,
            status: packageStatuses[packageId] as
              | "waiting"
              | "in_transit"
              | "india"
              | "dispatch"
              | "delivered",
          };
        }
        return { ...pkg }; // Return a new object to avoid reference issues
      });

      // Only update if the packages have actually changed
      setLocalPackages((prevPackages) => {
        // If the number of packages is different, definitely update
        if (prevPackages.length !== packagesWithLocalStatus.length) {
          return packagesWithLocalStatus;
        }

        // Check if any packages have actually changed
        const hasChanges = prevPackages.some((pkg, index) => {
          const newPkg = packagesWithLocalStatus[index];
          return JSON.stringify(pkg) !== JSON.stringify(newPkg);
        });

        return hasChanges ? packagesWithLocalStatus : prevPackages;
      });
    }
  }, [allPackages, packageStatuses]);

  // Function to view package details

  const handleUpdateStatus = async (
    packageId: string,
    newStatus: "waiting" | "in_transit" | "india" | "dispatch" | "delivered"
  ) => {
    console.log("Updating package status:", { packageId, newStatus });

    // Check if packageId is defined
    if (!packageId) {
      console.error("Package ID is undefined!");
      return;
    }

    try {
      // Immediately update the local status to provide instant feedback
      setPackageStatuses((prev) => ({
        ...prev,
        [packageId]: newStatus,
      }));

      // Also update the local packages array to ensure UI consistency
      setLocalPackages((currentPackages) => {
        return currentPackages.map((pkg) => {
          const pkgId = pkg._id || pkg.id;
          if (pkgId === packageId) {
            return {
              ...pkg,
              status: newStatus,
            };
          }
          return pkg;
        });
      });

      // Then update the backend
      await dispatch(
        updatePackageStatus({
          id: packageId,
          status: newStatus,
          location: "Updated by admin", // This could be improved with actual location data
        })
      ).unwrap();

      // If the currently selected package is the one being updated, update its status in the UI
      if (
        selectedPackage &&
        (selectedPackage._id === packageId || selectedPackage.id === packageId)
      ) {
        setSelectedPackage({
          ...selectedPackage,
          status: newStatus,
        });
      }
      toast.success("Package status updated successfully");
    } catch (error) {
      // If there's an error, revert the local status change
      setPackageStatuses((prev) => {
        const newStatuses = { ...prev };
        delete newStatuses[packageId];
        return newStatuses;
      });

      // Also revert the change in local packages
      setLocalPackages((currentPackages) => {
        return currentPackages.map((pkg) => {
          // Find the original package in allPackages to get its original status
          const pkgId = pkg._id || pkg.id;
          if (pkgId === packageId) {
            const originalPkg = allPackages.find(
              (p) => (p._id || p.id) === packageId
            );
            if (originalPkg) {
              return {
                ...pkg,
                status: originalPkg.status,
              };
            }
          }
          return pkg;
        });
      });

      console.error("Failed to update package status:", error);
      toast.error("Failed to update package status. Please try again.");
    }
  };

  // handleUpdateDimensions is now defined above with react-hook-form integration

  const handleRefresh = () => {
    dispatch(fetchAllPackages());
  };

  const handleViewDetails = (pkg: PackageWithCustomer) => {
    setSelectedPackage(pkg);
  };

  const handleClearSelection = () => {
    setSelectedPackage(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  // Filter packages based on search term and status filter
  const filteredPackages = localPackages.filter((pkg) => {
    const matchesSearch =
      !searchTerm ||
      pkg.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.customer?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus = !statusFilter || pkg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Package Tracking Management
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Monitor and manage all your packages with our advanced tracking
              system
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <input
                type="text"
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200"
                placeholder="Search by tracking ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl bg-white hover:bg-blue-50 transition-all duration-200 text-gray-700 hover:text-blue-600 shadow-sm"
                onClick={() => setStatusFilter(null)}
              >
                <Filter className="w-4 h-4" />
                {statusFilter ? getStatusLabel(statusFilter) : "All Statuses"}
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Packages Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-500 text-lg"
                    >
                      No packages found
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pkg.adminTrackingId || pkg.trackingId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof pkg.userId === 'object' ? pkg.userId.email : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            pkg.status
                          )}`}
                        >
                          {getStatusLabel(pkg.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(new Date(pkg.createdAt).toISOString())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pkg.weight} {pkg.weightUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewDetails(pkg)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            View
                          </button>
                          <select
                            className="text-sm border border-gray-200 rounded-lg py-2 px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            value={
                              pkg._id
                                ? packageStatuses[pkg._id] || pkg.status
                                : packageStatuses[pkg.id] || pkg.status
                            }
                            onChange={(e) => {
                              const packageId = pkg._id || pkg.id;
                              handleUpdateStatus(
                                packageId,
                                e.target.value as
                                  | "waiting"
                                  | "in_transit"
                                  | "india"
                                  | "dispatch"
                                  | "delivered"
                              );
                            }}
                          >
                            {(() => {
                              const packageId = pkg._id || pkg.id;
                              const currentStatus =
                                packageStatuses[packageId] || pkg.status;
                              const options = [];

                              switch (currentStatus) {
                                case "waiting":
                                  options.push(
                                    <option key="waiting" value="waiting">
                                      Waiting
                                    </option>,
                                    <option key="in_transit" value="in_transit">
                                      In Transit
                                    </option>
                                  );
                                  break;
                                case "in_transit":
                                  options.push(
                                    <option key="in_transit" value="in_transit">
                                      In Transit
                                    </option>,
                                    <option key="india" value="india">
                                      India
                                    </option>
                                  );
                                  break;
                                case "india":
                                  options.push(
                                    <option key="india" value="india">
                                      India
                                    </option>,
                                    <option key="dispatch" value="dispatch">
                                      Dispatch
                                    </option>
                                  );
                                  break;
                                case "dispatch":
                                  options.push(
                                    <option key="dispatch" value="dispatch">
                                      Dispatch
                                    </option>,
                                    <option key="delivered" value="delivered">
                                      Delivered
                                    </option>
                                  );
                                  break;
                                case "delivered":
                                  options.push(
                                    <option key="delivered" value="delivered">
                                      Delivered
                                    </option>
                                  );
                                  break;
                                default:
                                  options.push(
                                    <option key="waiting" value="waiting">
                                      Waiting
                                    </option>
                                  );
                                  break;
                              }

                              return options;
                            })()}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Package Details */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <button
              onClick={handleClearSelection}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700 z-10"
              title="Close Details"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Package Details
                  </h2>
                  <p className="text-blue-600 font-semibold text-lg">
                    Tracking ID: {selectedPackage.trackingId}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      selectedPackage.status
                    )}`}
                  >
                    {getStatusLabel(selectedPackage.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                <div className="flex items-start p-6 bg-purple-50 rounded-xl">
                  <div className="p-3 bg-purple-500 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-1">
                      Estimated Delivery
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedPackage.estimatedDelivery
                        ? formatDate(
                            new Date(
                              selectedPackage.estimatedDelivery
                            ).toISOString()
                          )
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Update Package Status
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPackage.id, "waiting")
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedPackage.status === "waiting"
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "bg-white border-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                    }`}
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPackage.id, "in_transit")
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedPackage.status === "in_transit"
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    In Transit
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPackage.id, "india")
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedPackage.status === "india"
                        ? "bg-purple-500 text-white shadow-lg"
                        : "bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    Arrived in India
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPackage.id, "dispatch")
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedPackage.status === "dispatch"
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-white border-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                    }`}
                  >
                    Out for Delivery
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPackage.id, "delivered")
                    }
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedPackage.status === "delivered"
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-white border-2 border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    Delivered
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Package Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">
                        Dimensions
                      </p>
                      <div className="mt-1">
                        {selectedPackage.dimensions ? (
                          <p className="text-gray-900">
                            {selectedPackage.dimensions.width} ×{" "}
                            {selectedPackage.dimensions.height} ×{" "}
                            {selectedPackage.dimensions.length}{" "}
                            {selectedPackage.dimensions.unit}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">Not specified</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDimensionsModal(selectedPackage)
                        }
                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Update dimensions
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">
                        Weight
                      </p>
                      <p className="mt-1 text-gray-900">
                        {selectedPackage.weight} {selectedPackage.weightUnit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Tracking History
                </h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 h-full w-0.5 bg-blue-200"></div>

                  {/* Timeline events */}
                  <div className="space-y-8">
                    {/* History would be shown here if available */}
                    {false ? (
                      [].map((event: any, index: number) => (
                        <div key={index} className="relative flex items-start">
                          <div
                            className={`absolute left-0 rounded-full w-12 h-12 flex items-center justify-center shadow-lg ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status === "delivered" ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : event.status === "dispatch" ? (
                              <Truck className="w-6 h-6" />
                            ) : (
                              <Package className="w-6 h-6" />
                            )}
                          </div>
                          <div className="ml-20 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="font-semibold text-gray-900 mb-2">
                              {event.description ||
                                `Status changed to ${getStatusLabel(
                                  event.status
                                )}`}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                              <span>
                                {event.location || "Unknown location"}
                              </span>
                              <span className="hidden sm:block mx-2">•</span>
                              <span>{formatDateTime(event.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-gray-500 text-lg">
                          No history available for this package
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Dimensions Update Modal */}
      {showDimensionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Update Package Dimensions
              </h3>
              <button
                onClick={() => setShowDimensionsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleUpdateDimensions)}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="width"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Width
                  </label>
                  <input
                    type="number"
                    id="width"
                    step="0.01"
                    min="0"
                    {...register("width", { required: "Width is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.width && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.width.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Height
                  </label>
                  <input
                    type="number"
                    id="height"
                    step="0.01"
                    min="0"
                    {...register("height", { required: "Height is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.height && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.height.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="length"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Length
                  </label>
                  <input
                    type="number"
                    id="length"
                    step="0.01"
                    min="0"
                    {...register("length", { required: "Length is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.length && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.length.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Unit
                </label>
                <select
                  id="unit"
                  {...register("unit")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="in">Inches (in)</option>
                  <option value="m">Meters (m)</option>
                  <option value="ft">Feet (ft)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDimensionsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Dimensions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
