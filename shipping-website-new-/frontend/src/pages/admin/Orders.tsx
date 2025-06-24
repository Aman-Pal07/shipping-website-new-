import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import api from "@/lib/axios";

interface Package {
  _id: string;
  trackingId: string;
  adminTrackingId?: string;
  status: PackageStatus;
  destinationAddress: string;
  weight: number;
  weightUnit: string;
  updatedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  items?: Array<{
    description: string;
    quantity: number;
    value: number;
  }>;
}

type PackageStatus =
  | "waiting"
  | "in_transit"
  | "india"
  | "dispatch"
  | "completed";

const statusVariantMap: Record<PackageStatus, BadgeProps["variant"]> = {
  waiting: "default",
  in_transit: "secondary",
  india: "outline",
  dispatch: "secondary",
  completed: "default",
};

const statusTextMap: Record<PackageStatus, string> = {
  waiting: "Waiting",
  in_transit: "In Transit",
  india: "In India",
  dispatch: "Out for Delivery",
  completed: "Delivered",
};

export default function AdminOrders() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const status = searchParams.get("status") || "all";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: { status?: string } = {};

        if (status !== "all") {
          params.status = status;
        }

        console.log("Fetching packages with params:", params);
        const response = await api.get<Package[]>("/packages", { params });
        console.log("Packages received:", response.data);
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Status changed to:", status);
    fetchData();
  }, [status]);

  const filteredPackages = packages.filter((pkg) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      pkg.trackingId?.toLowerCase().includes(term) ||
      pkg.adminTrackingId?.toLowerCase().includes(term) ||
      pkg.destinationAddress?.toLowerCase().includes(term) ||
      pkg.customerName?.toLowerCase().includes(term) ||
      pkg.customerEmail?.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Package Management
        </h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search packages..."
            className="pl-10 h-11 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Package List</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-sm font-semibold">
                    Tracking ID
                  </TableHead>
                  <TableHead className="text-sm font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-sm font-semibold">
                    Weight
                  </TableHead>
                  <TableHead className="text-sm font-semibold">
                    Last Updated
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                    <TableRow
                      key={pkg._id}
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium text-sm">
                        {pkg.trackingId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariantMap[pkg.status] as any}
                          className="text-xs font-medium px-2.5 py-0.5"
                        >
                          {statusTextMap[pkg.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {pkg.weight} {pkg.weightUnit}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(pkg.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground text-sm"
                    >
                      No packages found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
