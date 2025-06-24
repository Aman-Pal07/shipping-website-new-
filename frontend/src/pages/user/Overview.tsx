import {
  Package,
  Clock,
  ShoppingBag,
  Plus,
  Eye,
  ArrowUpRight,
  Truck,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";
import {
  fetchPackagesByStatus,
  fetchMyPackages,
} from "../../features/packages/packageSlice";
import { Link } from "react-router-dom";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AppDispatch } from "../../store";

// Status types we want to fetch
const statusTypes = ["waiting", "in_transit", "india", "dispatch", "delivered"];

export default function UserOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const { getStatusLabel } = usePackageStatus();

  // Fetch packages by status when component mounts
  useEffect(() => {
    // Fetch all packages
    dispatch(fetchMyPackages());

    // Fetch packages by each status
    statusTypes.forEach((status) => {
      dispatch(fetchPackagesByStatus(status));
    });
  }, [dispatch]);

  // Get packages and stats from Redux store
  const {
    packages,
    packagesByStatus,
    stats: packageStats,
    isLoading,
  } = useSelector((state: RootState) => state.packages);

  // Use real stats or fallback to calculated values
  const stats = packageStats || {
    total: packages.length,
    waiting: packagesByStatus.waiting.length,
    inTransit: packagesByStatus.in_transit.length,
    delivered: packagesByStatus.delivered.length,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "in_transit":
        return "secondary";
      case "waiting":
        return "outline";
      default:
        return "outline";
    }
  };

  const statsCards = [
    {
      title: "Total Packages",
      value: stats.total,
      icon: Package,
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      change: "+12%",
      href: "/dashboard/packages",
    },
    {
      title: "Waiting",
      value: stats.waiting,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      change: "+3",
      href: "/dashboard/packages?status=waiting",
    },
    {
      title: "In Transit",
      value: stats.inTransit,
      icon: Truck,
      gradient: "from-purple-600 to-blue-600",
      bgGradient: "from-purple-50 to-blue-50",
      change: "+8",
      href: "/dashboard/packages?status=in_transit",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: ShoppingBag,
      gradient: "from-emerald-600 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      change: "+24%",
      href: "/dashboard/packages?status=delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your package shipments
            </p>
          </div>
          <Link to="/dashboard/track">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </Link>
        </div>

        {/* Package Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Link key={index} to={stat.href} className="group">
              <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
                ></div>
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Packages Section */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-6 border-b border-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Recent Packages
                </CardTitle>
                <CardDescription className="mt-1">
                  Your latest package shipments and their current status
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link to="/dashboard/packages">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    View All
                  </Button>
                </Link>
                <Link to="/dashboard/track">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                </div>
                <p className="text-gray-500 mt-4 font-medium">
                  Loading packages...
                </p>
              </div>
            ) : packages.length > 0 ? (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">
                        Tracking ID
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Weight
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Status
                      </TableHead>

                      <TableHead className="text-right font-semibold text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.slice(0, 5).map((pkg) => (
                      <TableRow
                        key={pkg.id}
                        className="border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <TableCell className="font-bold text-blue-600 py-4">
                          #{pkg.trackingId}
                        </TableCell>
                        <TableCell className="font-medium text-gray-700">
                          {pkg.weight} {pkg.weightUnit}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(pkg.status)}
                            className="font-semibold px-3 py-1 rounded-full"
                          >
                            {getStatusLabel(pkg.status)}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <Link to={`/dashboard/track?id=${pkg.trackingId}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                  <Package className="h-12 w-12 text-blue-500" />
                </div>
                <CardTitle className="mb-3 text-xl text-gray-900">
                  No packages yet
                </CardTitle>
                <CardDescription className="mb-6 text-gray-600 max-w-md mx-auto">
                  Get started by adding your first package to track its journey
                  from pickup to delivery
                </CardDescription>
                <Link to="/dashboard/track">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first package
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
