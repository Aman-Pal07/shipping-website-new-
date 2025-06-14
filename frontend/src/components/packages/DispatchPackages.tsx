import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import {
  Circle,
  Package as PackageIcon,
  CreditCard,
  Ruler,
  Scale,
} from "lucide-react";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

interface CompletedTransaction {
  _id: string;
  userId: string;
  packageId: {
    _id: string;
    trackingId: string;
    status: string;
    destination: {
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    weight?: number;
    weightUnit?: string;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
  };
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  description?: string;
  dimensions?: {
    width: number;
    height: number;
    length: number;
    unit: string;
  };
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  adminTrackingId?: string;
  notes?: string;
  weight?: number;
  weightUnit?: string;
  packageStatus?: "Processing" | "Dispatch";
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  paymentAttempts?: number;
  lastPaymentAttempt?: string;
  paidAt?: string;
  error?: string;
}

// Helper function to safely format dates

export default function DispatchPackages() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<CompletedTransaction[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    const fetchCompletedTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/completed-transactions/my");
        // Sort by completedAt in descending order (newest first)
        const sortedTransactions = (response.data || []).sort(
          (a: CompletedTransaction, b: CompletedTransaction) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        );
        setTransactions(sortedTransactions);
      } catch (err) {
        console.error("Error fetching completed transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTransactions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Circle className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-emerald-600" />
                Completed Shipments
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                View all your completed shipping transactions
              </p>
            </div>
            <Badge variant="outline" className="bg-white">
              {transactions.length}{" "}
              {transactions.length === 1 ? "Transaction" : "Transactions"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  {/* in last column */}
                  <TableHead className="font-semibold">Weight</TableHead>
                  <TableHead className="font-semibold">Dimensions</TableHead>
                  <TableHead className="font-semibold">
                    Volumetric Weight
                  </TableHead>

                  <TableHead className="font-semibold text-right">
                    Amount
                  </TableHead>

                  <TableHead className="font-semibold">
                    Package Status
                  </TableHead>
                  <TableHead className="font-semibold">Shipping ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => {
                    const pkg = tx.packageId || {};
                    return (
                      <TableRow key={tx._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <PackageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-medium truncate">
                              {pkg.trackingId || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Scale className="w-3 h-3 mr-1 text-gray-400" />
                            {tx.weight || pkg.weight ? (
                              <span>
                                {tx.weight || pkg.weight}{" "}
                                {tx.weightUnit || pkg.weightUnit || "kg"}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {tx.dimensions ? (
                            <div className="flex items-center text-sm">
                              <Ruler className="w-3 h-3 mr-1 text-gray-400" />
                              {tx.dimensions.length}×{tx.dimensions.width}×
                              {tx.dimensions.height} {tx.dimensions.unit}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>

                        <TableCell>
                          {tx.volumetricWeight ? (
                            <div className="flex items-center text-sm">
                              <Scale className="w-3 h-3 mr-1 text-gray-400" />
                              {tx.volumetricWeight}{" "}
                              {tx.volumetricWeightUnit || "kg"}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="font-medium">
                            ₹{tx.amount?.toLocaleString() || "0"}
                          </div>
                          {tx.paymentMethod && (
                            <div className="text-xs text-gray-500 flex items-center justify-end">
                              <CreditCard className="w-3 h-3 mr-1" />
                              {tx.paymentMethod}
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              tx.packageStatus === "Dispatch"
                                ? "default"
                                : "outline"
                            }
                            className={`capitalize ${
                              tx.packageStatus === "Dispatch"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                : "bg-blue-50 text-blue-800 hover:bg-blue-50 border-blue-200"
                            }`}
                          >
                            {tx.packageStatus || "Processing"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {tx.adminTrackingId ? (
                              <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                {tx.adminTrackingId}
                              </div>
                            ) : (
                              <span className="text-sm text-blue-600 font-medium">
                                Processing
                              </span>
                            )}
                            {tx.notes && (
                              <div className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded border border-gray-100">
                                <div className="whitespace-pre-wrap">
                                  {tx.notes}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No completed transactions found
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
