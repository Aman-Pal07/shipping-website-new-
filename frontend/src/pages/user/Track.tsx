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

  // Using the imported formatDate function from @/utils/formatDate

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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-8 mb-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Package Details
            </h2>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Tracking ID:{" "}
                <span className="font-medium text-gray-700">
                  {pkg.trackingId || "Processing..."}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Admin ID:{" "}
                <span className="font-medium text-gray-700">
                  {pkg.adminTrackingId || "Not assigned yet"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors"
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
      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Package Content
        </h3>
        <p className="text-gray-700">
          {pkg.content || "No content description provided"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </h3>
          </div>
          <p className="font-semibold text-gray-900">
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
          <p className="font-semibold text-gray-900">
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
          <p className="font-semibold text-gray-900">
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
        <div className="max-w-7xl mx-auto px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Track Your Packages
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Monitor your shipments in real-time with our advanced tracking
                system
              </p>
            </div>
            <Button
              onClick={handleOpenAddPackage}
              className="group bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white rounded-2xl px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Add Package</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                className="pl-14 pr-6 py-4 h-14 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 text-lg"
                placeholder="Enter tracking number or search packages..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-8 py-4 h-14 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              Search Packages
            </Button>
          </div>
        </motion.div>

        {/* Packages Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Your Packages</h2>
            <p className="text-gray-600 mt-1">
              Manage and track all your shipments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
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
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
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
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getModernStatusColor(
                          pkg.status
                        )}`}
                      >
                        {getStatusLabel(pkg.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pkg.weight} {pkg.weightUnit}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={pkg.content || "No content provided"}
                      >
                        {pkg.content || "—"}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(pkg.updatedAt, 'dd/MM/yyyy HH:mm')}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900 border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl px-4 py-2 transition-all duration-200"
                          onClick={() => {
                            // Navigate to package tracking
                          }}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Track
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 hover:text-purple-900 border-purple-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl px-4 py-2 transition-all duration-200"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {packages.length === 0 && !packagesLoading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No packages found
              </h3>
              <p className="text-gray-600">
                Add a new package or search by tracking number to get started.
              </p>
            </div>
          )}
        </motion.div>

        {/* Package Details Cards */}
        <div className="mt-12 space-y-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              {renderPackageDetails(pkg)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Package Dialog */}
      <AnimatePresence>
        {isAddPackageOpen && (
          <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl shadow-2xl border-0 p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      Add New Package
                    </DialogTitle>
                    <p className="text-blue-100 mt-2">
                      Create a new package for tracking
                    </p>
                  </DialogHeader>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="h-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                          className="flex-1 h-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <Select
                          value={packageData.weightUnit}
                          onValueChange={(value) =>
                            handleSelectChange("weightUnit", value)
                          }
                        >
                          <SelectTrigger className="w-24 h-12 bg-gray-50 border-0 rounded-2xl">
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
                        <SelectTrigger className="h-12 bg-gray-50 border-0 rounded-2xl">
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
                        <SelectTrigger className="h-12 bg-gray-50 border-0 rounded-2xl">
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

                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-gray-800">
                      Package Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={packageData.content}
                      onChange={handlePackageInputChange}
                      placeholder="Describe the contents of the package (e.g., Electronics, Clothes, Documents)"
                      className="w-full h-24 p-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter className="bg-gray-50 p-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseAddPackage}
                    className="flex-1 h-12 border-gray-300 bg-white hover:bg-gray-100 text-gray-800 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePackage}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        <DialogContent className="sm:max-w-4xl bg-white rounded-3xl shadow-2xl border-0 p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                Package Details
              </DialogTitle>
              <p className="text-blue-100 mt-2">Complete package information</p>
            </DialogHeader>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-8">
            {selectedPackage && renderPackageDetails(selectedPackage)}
          </div>
          <DialogFooter className="bg-gray-50 p-8">
            <Button
              onClick={() => setIsDetailsOpen(false)}
              className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-8 font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
