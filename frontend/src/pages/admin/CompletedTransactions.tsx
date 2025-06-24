import { useEffect, useState, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchAllCompletedTransactions,
  updateAdminTrackingId,
  setSelectedTransaction,
  updatePackageStatus,
} from "../../features/completedTransactions/completedTransactionSlice";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Eye, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types/transaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define interface for state
interface CompletedTransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;
}

const CompletedTransactions = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error, selectedTransaction } = useSelector(
    (state: RootState) =>
      (state as any).completedTransactions || ({} as CompletedTransactionsState)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentUpdatingId, setCurrentUpdatingId] = useState<string | null>(
    null
  );
  const [editingTrackingId, setEditingTrackingId] = useState<{
    id: string | null;
    value: string;
    notes?: string; // Make notes optional since it's not in the Transaction type
  }>({ id: null, value: "", notes: "" });

  useEffect(() => {
    dispatch(fetchAllCompletedTransactions());
  }, [dispatch]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    const searchLower = searchTerm.toLowerCase();
    return transactions.filter((transaction: Transaction) => {
      // Safely access and convert all searchable fields to lowercase strings
      const searchFields = [
        transaction._id,
        transaction.razorpayOrderId,
        transaction.razorpayPaymentId,
        transaction.adminTrackingId,
        transaction.status,
        // Handle packageId which could be string or Package type
        typeof transaction.packageId === "object" && transaction.packageId !== null
          ? (transaction.packageId as any)?.trackingId || (transaction.packageId as any)?.id
          : transaction.packageId,
      ];
      
      // Ensure all fields are strings before calling toLowerCase()
      return searchFields.some(field => 
        field ? field.toString().toLowerCase().includes(searchLower) : false
      );

      // Check if any field includes the search term (case-insensitive)
      return searchFields.some((field) =>
        field?.toString().toLowerCase().includes(searchLower)
      );
    });
  }, [transactions, searchTerm]);

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, "PPpp");
    } catch {
      return "Invalid date";
    }
  };

  const handleUpdateTrackingId = async (id: string) => {
    if (!editingTrackingId.value.trim()) {
      toast.error("Tracking ID cannot be empty");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateAdminTrackingId({
          id,
          adminTrackingId: editingTrackingId.value.trim(),
          notes: editingTrackingId.notes?.trim() || undefined,
        })
      );

      if (updateAdminTrackingId.fulfilled.match(resultAction)) {
        setEditingTrackingId({ id: null, value: "", notes: "" });
        toast.success("Tracking information updated successfully");
      } else {
        throw new Error(
          (resultAction.payload as string) ||
            "Failed to update tracking information"
        );
      }
    } catch (error) {
      console.error("Error updating tracking ID:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update tracking information"
      );
    }
  };

  const handleStatusChange = async (
    transactionId: string,
    newStatus: "Processing" | "Dispatch"
  ) => {
    try {
      setCurrentUpdatingId(transactionId);
      const result = await dispatch(
        updatePackageStatus({ id: transactionId, packageStatus: newStatus })
      );

      if (updatePackageStatus.fulfilled.match(result)) {
        await dispatch(fetchAllCompletedTransactions());
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error(
          `Failed to update status: ${result.error.message || "Unknown error"}`
        );
      }
    } catch {
      toast.error("An unexpected error occurred while updating status");
    } finally {
      setCurrentUpdatingId(null);
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    dispatch(setSelectedTransaction(transaction));
    setIsViewModalOpen(true);
  };

  if (loading && !transactions?.length) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Completed Transactions
          </h1>
          <p className="text-muted-foreground">
            View and manage all completed transactions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full bg-background pl-8 sm:w-[300px] md:w-[400px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Package Status</TableHead>
                  <TableHead>Order Tracking ID</TableHead>
                  <TableHead>Volumetric Weight</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length ? (
                  filteredTransactions.map((transaction: Transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        {(typeof transaction.packageId === 'object' && transaction.packageId !== null 
                          ? (transaction.packageId as any)?.trackingId 
                          : transaction.razorpayOrderId) || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {transaction.createdAt
                          ? formatDate(transaction.createdAt)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        ₹{transaction.amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.status || "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.paymentMethod || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <select
                            className={`border rounded px-2 py-1 text-sm w-32 bg-white appearance-none ${
                              (transaction.packageStatus || "Processing") ===
                              "Dispatch"
                                ? "bg-green-50 text-green-800"
                                : "bg-blue-50 text-blue-800"
                            }`}
                            value={transaction.packageStatus || "Processing"}
                            onChange={(e) =>
                              handleStatusChange(
                                transaction._id,
                                e.target.value as "Processing" | "Dispatch"
                              )
                            }
                            disabled={
                              loading && transaction._id === currentUpdatingId
                            }
                          >
                            <option
                              value="Processing"
                              className="bg-blue-50 text-blue-800"
                            >
                              Processing
                            </option>
                            <option
                              value="Dispatch"
                              className="bg-green-50 text-green-800"
                            >
                              Dispatch
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                        {loading && transaction._id === currentUpdatingId && (
                          <div className="text-xs text-gray-500 mt-1">
                            Updating...
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTrackingId.id === transaction._id ? (
                          <div className="flex items-center gap-2">
                            <div className="space-y-2 w-64">
                              <div>
                                <input
                                  type="text"
                                  className="border rounded px-2 py-1 text-sm w-full"
                                  value={editingTrackingId.value}
                                  onChange={(e) =>
                                    setEditingTrackingId({
                                      ...editingTrackingId,
                                      value: e.target.value,
                                    })
                                  }
                                  placeholder="Enter tracking ID"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  className="border rounded px-2 py-1 text-sm w-full"
                                  value={editingTrackingId.notes}
                                  onChange={(e) =>
                                    setEditingTrackingId({
                                      ...editingTrackingId,
                                      notes: e.target.value,
                                    })
                                  }
                                  placeholder="Add notes (optional)"
                                />
                              </div>
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingTrackingId({
                                      id: null,
                                      value: "",
                                      notes: "",
                                    })
                                  }
                                  className="text-gray-600 hover:text-gray-800 text-sm px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateTrackingId(transaction._id)
                                  }
                                  className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span>{transaction.adminTrackingId || "N/A"}</span>
                            <button
                              onClick={() =>
                                setEditingTrackingId({
                                  id: transaction._id,
                                  value: transaction.adminTrackingId || "",
                                  notes: (transaction as any).notes || "", // Using type assertion since notes isn't in the Transaction type
                                })
                              }
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.volumetricWeight
                          ? `${transaction.volumetricWeight} ${
                              transaction.volumetricWeightUnit || "kg"
                            }`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {transaction.weight
                          ? `${transaction.weight} ${
                              transaction.weightUnit || "kg"
                            }`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </h4>
                  <p>{selectedTransaction.orderId || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Razorpay Order ID
                  </h4>
                  <p>{selectedTransaction.razorpayOrderId || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Payment ID
                  </h4>
                  <p>{selectedTransaction.razorpayPaymentId || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h4>
                  <Badge variant="outline">
                    {selectedTransaction.status || "Completed"}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Amount
                  </h4>
                  <p>₹{selectedTransaction.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Currency
                  </h4>
                  <p>{selectedTransaction.currency || "INR"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Tracking ID
                  </h4>
                  <p>{selectedTransaction.adminTrackingId || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Created At
                  </h4>
                  <p>
                    {selectedTransaction.createdAt
                      ? formatDate(selectedTransaction.createdAt)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedTransaction.dimensions && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Package Dimensions
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-xs text-muted-foreground">Width</h5>
                      <p>
                        {selectedTransaction.dimensions.width}{" "}
                        {selectedTransaction.dimensions.unit}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-xs text-muted-foreground">Height</h5>
                      <p>
                        {selectedTransaction.dimensions.height}{" "}
                        {selectedTransaction.dimensions.unit}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-xs text-muted-foreground">Length</h5>
                      <p>
                        {selectedTransaction.dimensions.length}{" "}
                        {selectedTransaction.dimensions.unit}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(selectedTransaction.weight ||
                selectedTransaction.volumetricWeight) && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Package Weight
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTransaction.weight && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">
                          Weight
                        </h5>
                        <p>
                          {selectedTransaction.weight}{" "}
                          {selectedTransaction.weightUnit || "kg"}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.volumetricWeight && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">
                          Volumetric Weight
                        </h5>
                        <p>
                          {selectedTransaction.volumetricWeight}{" "}
                          {selectedTransaction.volumetricWeightUnit || "kg"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTransaction.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h4>
                  <p className="whitespace-pre-line">
                    {selectedTransaction.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default CompletedTransactions;
