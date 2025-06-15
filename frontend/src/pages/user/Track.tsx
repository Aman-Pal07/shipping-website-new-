import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  Plus,
  Eye,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  createPackage,
  fetchMyPackages,
} from "../../features/packages/packageSlice";
import { RootState } from "../../store";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function Track() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idFromUrl = queryParams.get("id");
  const { isAdmin } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const { packages, isLoading: packagesLoading } = useSelector(
    (state: RootState) => ({
      packages: state.packages.packages,
      isLoading: state.packages.isLoading,
    })
  );

  const [trackingNumber, setTrackingNumber] = useState(idFromUrl || "");
  const { getStatusLabel } = usePackageStatus();

  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [packageData, setPackageData] = useState({
    packageId: "",
    weight: "",
    weightUnit: "kg",
    content: "",
    initialStatus: "waiting",
    paymentStatus: "pending",
    description: "",
    shippingAddress: "",
    customerEmail: "",
  });

  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyPackages());
  }, [dispatch]);

  const handleOpenAddPackage = () => {
    setPackageData({
      packageId: "",
      weight: "",
      weightUnit: "kg",
      content: "",
      initialStatus: "waiting",
      paymentStatus: "pending",
      description: "",
      shippingAddress: "",
      customerEmail: "",
    });
    setIsAddPackageOpen(true);
  };

  const handleCloseAddPackage = () => {
    setIsAddPackageOpen(false);
  };

  const handlePackageInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPackageData({
      ...packageData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setPackageData({
      ...packageData,
      [name]: value,
    });
  };

  const handleCreatePackage = async () => {
    try {
      const packagePayload = {
        trackingId: packageData.packageId,
        weight: parseFloat(packageData.weight) || 0,
        weightUnit: packageData.weightUnit as "kg" | "lbs" | "g",
        content: packageData.content,
        destinationAddress: "Shipping address",
        priority: "standard" as "standard" | "express" | "overnight",
        customerEmail: "customer@example.com",
      };

      const result = await dispatch(createPackage(packagePayload));
      console.log("Package created:", result);
      await dispatch(fetchMyPackages());
      setIsAddPackageOpen(false);
      alert("Package created successfully!");
    } catch (error) {
      console.error("Failed to create package:", error);
      alert("Failed to create package. Please try again.");
    }
  };

  const getModernStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "in_transit":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "waiting":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "dispatch":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const renderPackageDetails = (pkg: any) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Package Details
            </h2>
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="text-gray-500">
                Tracking ID:{" "}
                <span className="font-medium text-gray-700">
                  {pkg.trackingId || "Processing..."}
                </span>
              </p>
              <p className="text-gray-500">
                Admin ID:{" "}
                <span className="font-medium text-gray-700">
                  {pkg.adminTrackingId || "Not assigned yet"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => {
              // Navigate to package details
            }}
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Volumetric Weight</p>
            <p className="text-sm font-medium text-gray-700">
              {pkg.volumetricWeight
                ? `${pkg.volumetricWeight} ${pkg.volumetricWeightUnit || "kg"}`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Package Content
        </h3>
        <p className="text-gray-700 text-sm">
          {pkg.content || "No content description provided"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </h3>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {pkg.status ? getStatusLabel(pkg.status) : "Processing..."}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Priority
            </h3>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {pkg.priority || "Standard"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Weight
            </h3>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {pkg.weight
              ? `${pkg.weight} ${pkg.weightUnit || "kg"}`
              : "Processing..."}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Destination
            </h3>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {pkg.destinationAddress || "Processing..."}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Truck className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Location
            </h3>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {pkg.currentLocation || "Processing..."}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Delivery
            </h3>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {pkg.estimatedDelivery
              ? formatDate(pkg.estimatedDelivery)
              : "Processing..."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
                Track Your Packages
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                Monitor your shipments in real-time with our advanced tracking
                system
              </p>
            </div>
            <Button
              onClick={handleOpenAddPackage}
              className="group bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white rounded-2xl px-6 sm:px-8 py-3 sm:py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Add Package</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <Input
                type="text"
                className="pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 h-12 sm:h-14 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 text-base sm:text-lg"
                placeholder="Enter tracking number or search packages..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14 font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
              Search Packages
            </Button>
          </div>
        </motion.div>

        {/* Packages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Packages
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage and track all your shipments
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {packages.map((pkg, index) => (
                  <motion.tr
                    key={pkg._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Package className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {pkg.trackingId}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {pkg._id?.slice(-6) || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                      <span
                        className={`px-3 sm:px-4 py-1 sm:py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getModernStatusColor(
                          pkg.status
                        )}`}
                      >
                        {getStatusLabel(pkg.status)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pkg.weight} {pkg.weightUnit}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={pkg.content || "No content provided"}
                      >
                        {pkg.content || "—"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(pkg.updatedAt, "dd/MM/yyyy HH:mm")}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900 border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl px-3 sm:px-4 py-1 sm:py-2 transition-all duration-200"
                          onClick={() => {
                            // Navigate to package tracking
                          }}
                        >
                          <Truck className="h-4 w-4 mr-1 sm:mr-2" />
                          Track
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 hover:text-purple-900 border-purple-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl px-3 sm:px-4 py-1 sm:py-2 transition-all duration-200"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                          View
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {pkg.trackingId}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {pkg._id?.slice(-6) || "N/A"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getModernStatusColor(
                      pkg.status
                    )}`}
                  >
                    {getStatusLabel(pkg.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Weight</p>
                    <p className="text-sm font-medium text-gray-900">
                      {pkg.weight} {pkg.weightUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Content</p>
                    <p
                      className="text-sm text-gray-900 truncate"
                      title={pkg.content || "No content provided"}
                    >
                      {pkg.content || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(pkg.updatedAt, "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-900 border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl px-3 py-1 transition-all duration-200"
                    onClick={() => {
                      // Navigate to package tracking
                    }}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 hover:text-purple-900 border-purple-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl px-3 py-1 transition-all duration-200"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {packages.length === 0 && !packagesLoading && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Package className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No packages found
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Add a new package or search by tracking number to get started.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Package Dialog */}
      <AnimatePresence>
        {isAddPackageOpen && (
          <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-white rounded-3xl shadow-2xl border-0 p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Package className="h-5 sm:h-6 w-5 sm:w-6" />
                      </div>
                      Add New Package
                    </DialogTitle>
                    <p className="text-blue-100 mt-2 text-sm sm:text-base">
                      Create a new package for tracking
                    </p>
                  </DialogHeader>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800">
                        Tracking ID
                      </label>
                      <Input
                        id="packageId"
                        name="packageId"
                        value={packageData.packageId}
                        onChange={handlePackageInputChange}
                        placeholder="Enter package ID (e.g., PKG-12345)"
                        className="h-10 sm:h-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800">
                        Package Weight
                      </label>
                      <div className="flex gap-3">
                        <Input
                          id="weight"
                          name="weight"
                          value={packageData.weight}
                          onChange={handlePackageInputChange}
                          placeholder="Enter weight"
                          className="flex-1 h-10 sm:h-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <Select
                          value={packageData.weightUnit}
                          onValueChange={(value) =>
                            handleSelectChange("weightUnit", value)
                          }
                        >
                          <SelectTrigger className="w-20 sm:w-24 h-10 sm:h-12 bg-gray-50 border-0 rounded-2xl">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-2xl shadow-xl border-0">
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800">
                        Initial Status
                      </label>
                      <Select
                        value={packageData.initialStatus}
                        onValueChange={(value) =>
                          handleSelectChange("initialStatus", value)
                        }
                        disabled={!isAdmin}
                      >
                        <SelectTrigger className="h-10 sm:h-12 bg-gray-50 border-0 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl shadow-xl border-0">
                          <SelectItem value="waiting">Waiting</SelectItem>
                          {isAdmin && (
                            <>
                              <SelectItem value="in_transit">
                                In Transit
                              </SelectItem>
                              <SelectItem value="india">India</SelectItem>
                              <SelectItem value="dispatch">Dispatch</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800">
                        Payment Status
                      </label>
                      <Select
                        value={packageData.paymentStatus}
                        onValueChange={(value) =>
                          handleSelectChange("paymentStatus", value)
                        }
                        disabled={!isAdmin}
                      >
                        <SelectTrigger className="h-10 sm:h-12 bg-gray-50 border-0 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl shadow-xl border-0">
                          <SelectItem value="pending">Pending</SelectItem>
                          {isAdmin && (
                            <>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 sm:mt-6">
                    <label className="text-sm font-bold text-gray-800">
                      Package Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={packageData.content}
                      onChange={handlePackageInputChange}
                      placeholder="Describe the contents of the package (e.g., Electronics, Clothes, Documents)"
                      className="w-full h-20 sm:h-24 p-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter className="bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseAddPackage}
                    className="flex-1 h-10 sm:h-12 border-gray-300 bg-white hover:bg-gray-100 text-gray-800 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePackage}
                    className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Package
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Package Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-4xl bg-white rounded-3xl shadow-2xl border-0 p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-3xl font-bold">
                Package Details
              </DialogTitle>
              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Complete package information
              </p>
            </DialogHeader>
          </div>
          <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto p-4 sm:p-6 lg:p-8">
            {selectedPackage && renderPackageDetails(selectedPackage)}
          </div>
          <DialogFooter className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <Button
              onClick={() => setIsDetailsOpen(false)}
              className="h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 sm:px-8 font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
