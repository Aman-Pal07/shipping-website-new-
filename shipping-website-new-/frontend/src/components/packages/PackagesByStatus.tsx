// Package Status Component
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { Package } from "../../types/package";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface PackagesByStatusProps {
  packages: Package[];
  status: string;
  isLoading: boolean;
}

export default function PackagesByStatus({
  packages,
  status,
  isLoading,
}: PackagesByStatusProps) {
  const { getStatusLabel } = usePackageStatus();

  const getStatusTitle = (status: string) => {
    return getStatusLabel(status) + " Packages";
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "waiting":
        return "Packages waiting to be processed";
      case "in_transit":
        return "Packages currently in transit";
      case "india":
        return "Packages that have arrived in India";
      case "dispatch":
        return "Packages ready for dispatch";
      case "delivered":
        return "Packages that have been delivered";
      default:
        return "Your packages";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {getStatusTitle(status)}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            {getStatusDescription(status)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          ) : packages.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Tracking ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Weight
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">
                      Content
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg, index) => (
                    <motion.tr
                      key={pkg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-blue-600 py-4">
                        {pkg.trackingId}
                      </TableCell>
                      <TableCell className="text-gray-700 py-4">
                        <span className="font-medium">{pkg.weight}</span>{" "}
                        <span className="text-gray-500">{pkg.weightUnit}</span>
                      </TableCell>
                      <TableCell className="truncate max-w-[200px] text-gray-700 py-4" title={pkg.content || 'No content provided'}>
                        {pkg.content || '—'}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Link to={`/dashboard/track?id=${pkg.trackingId}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-100 hover:text-blue-600 rounded-full transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2m-5-4v4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No packages with this status
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Packages will appear here when they match this status
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
