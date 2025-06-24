import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchAllTransactions,
  updateTransactionFields,
} from "../../features/transactions/transactionSlice";
import { Search, Eye, Edit, Check, X, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";
import { Dimensions } from "@/types/transaction";

// Types
type WeightUnit = "kg" | "g" | "lb" | "oz"; // Simplified valid units
type DimensionUnit = "cm" | "in" | "m" | "ft";

interface PackageItem {
  _id: string;
  trackingId?: string;
  status?: string;
  dimensions?: Dimensions;
}

interface TransactionItem {
  id: string;
  packageId?: string | PackageItem;
  orderId?: string;
  customer: string;
  type: "payment" | "refund";
  status: "pending" | "completed" | "failed";
  amount: number;
  date: string;
  description?: string;
  paymentMethod?: string;
  dimensions?: Dimensions;
  volumetricWeight?: number;
  volumetricWeightUnit?: WeightUnit;
  adminTrackingId?: string;
  weight?: number;
  weightUnit?: WeightUnit;
}

// Utility functions
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(isNaN(amount) ? 0 : amount);

const formatDateTime = (dateTimeString: string): string =>
  new Date(dateTimeString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Format transaction data
const formatTransaction = (txn: any): TransactionItem => {
  const id = txn._id || `txn-${Math.random().toString(36).substring(2, 10)}`;
  const customer = txn.userId?.username || txn.userId?.email || "Unknown User";
  const orderId = txn.packageId
    ? typeof txn.packageId === "object"
      ? txn.packageId.trackingId || `PKG-${txn.packageId._id?.substring(0, 8)}`
      : `PKG-${String(txn.packageId).substring(0, 8)}`
    : undefined;

  return {
    id,
    packageId:
      typeof txn.packageId === "object" ? txn.packageId._id : txn.packageId,
    orderId,
    customer,
    type:
      txn.amount < 0 || txn.description?.toLowerCase().includes("refund")
        ? "refund"
        : "payment",
    status: txn.status || "unknown",
    amount: Math.abs(parseFloat(txn.amount) || 0),
    date: txn.createdAt
      ? new Date(txn.createdAt).toISOString()
      : new Date().toISOString(),
    description: txn.description || "No description",
    paymentMethod: txn.stripePaymentIntentId ? "stripe" : "other",
    dimensions: txn.dimensions
      ? {
          width: Number(txn.dimensions.width) || 0,
          height: Number(txn.dimensions.height) || 0,
          length: Number(txn.dimensions.length) || 0,
          unit: txn.dimensions.unit as DimensionUnit,
        }
      : undefined,
    volumetricWeight: Number(txn.volumetricWeight) || undefined,
    volumetricWeightUnit: txn.volumetricWeightUnit as WeightUnit,
    adminTrackingId: txn.adminTrackingId,
    weight: Number(txn.weight) || undefined,
    weightUnit: txn.weightUnit as WeightUnit,
  };
};

// Sub-components
interface EditDimensionsProps {
  transactionId: string;
  dimensions?: Dimensions;
  onSave: (id: string, dimensions: Dimensions) => void;
  onCancel: () => void;
}

const EditDimensions: React.FC<EditDimensionsProps> = ({
  transactionId,
  dimensions,
  onSave,
  onCancel,
}) => {
  const [editDimensions, setEditDimensions] = useState({
    width: dimensions?.width?.toString() || "",
    height: dimensions?.height?.toString() || "",
    length: dimensions?.length?.toString() || "",
    unit: dimensions?.unit || "cm",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditDimensions((prev) => ({
      ...prev,
      [name]: name === "unit" ? value : value,
    }));
  };

  const handleSubmit = () => {
    const { width, height, length, unit } = editDimensions;
    if (!width || !height || !length) {
      toast.error("Please fill in all dimension fields");
      return;
    }
    onSave(transactionId, {
      width: Number(width),
      height: Number(height),
      length: Number(length),
      unit: unit as DimensionUnit,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {["width", "height", "length"].map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            value={editDimensions[field as keyof typeof editDimensions]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-20 px-2 py-1 border rounded text-sm"
            min="0"
            step="0.01"
          />
        ))}
        <select
          name="unit"
          value={editDimensions.unit}
          onChange={handleChange}
          className="px-2 py-1 border rounded text-sm"
        >
          {["cm", "in", "m", "ft"].map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function Transactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, isLoading, error } = useSelector(
    (state: RootState) => state.transactions
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "payment" | "refund">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");
  const [filterPackageStatus, setFilterPackageStatus] = useState<
    "all" | "in_transit_to_india"
  >("all");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editingDimensionsId, setEditingDimensionsId] = useState<string | null>(
    null
  );
  const [editingVolumetricWeightId, setEditingVolumetricWeightId] = useState<
    string | null
  >(null);
  const [editVolumetricWeight, setEditVolumetricWeight] = useState<{
    value: string;
    unit: WeightUnit;
  }>({
    value: "",
    unit: "kg",
  });
  const [localTransactions, setLocalTransactions] = useState<TransactionItem[]>(
    []
  );

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Format transactions
  useEffect(() => {
    if (transactions?.length) {
      setLocalTransactions(
        transactions
          .filter((txn): txn is NonNullable<typeof txn> => txn !== null)
          .map(formatTransaction)
      );
    }
  }, [transactions]);

  // Fetch transactions
  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = localTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || transaction.type === filterType;
      const matchesStatus =
        filterStatus === "all" || transaction.status === filterStatus;
      const matchesPackageStatus =
        filterPackageStatus === "all" ||
        (filterPackageStatus === "in_transit_to_india" &&
          transaction.description?.includes(
            "Status changed from in_transit to india"
          ));

      return (
        matchesSearch && matchesType && matchesStatus && matchesPackageStatus
      );
    });

    if (!showAllTransactions) {
      const latestByPackage = new Map<string, TransactionItem>();
      result
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach((txn) => {
          if (txn.packageId) {
            const packageId =
              typeof txn.packageId === "string"
                ? txn.packageId
                : txn.packageId._id;
            if (packageId && !latestByPackage.has(packageId)) {
              latestByPackage.set(packageId, txn);
            }
          }
        });
      result = Array.from(latestByPackage.values());
    }

    return result;
  }, [
    localTransactions,
    searchTerm,
    filterType,
    filterStatus,
    filterPackageStatus,
    showAllTransactions,
  ]);

  // Handlers
  const handleEditClick = useCallback((transaction: TransactionItem) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.amount.toString());
  }, []);

  const handleEditVolumetricWeight = useCallback(
    (transaction: TransactionItem) => {
      setEditingVolumetricWeightId(transaction.id);
      setEditVolumetricWeight({
        value: transaction.volumetricWeight?.toString() || "",
        unit: (transaction.volumetricWeightUnit as "kg") || "kg",
      });
    },
    []
  );

  const handleSaveVolumetricWeight = useCallback(
    async (id: string) => {
      try {
        const weight = parseFloat(editVolumetricWeight.value);
        if (isNaN(weight) || weight <= 0) {
          toast.error("Please enter a valid weight");
          return;
        }

        const updates = {
          volumetricWeight: weight,
          volumetricWeightUnit: editVolumetricWeight.unit,
        };

        const result = await dispatch(
          updateTransactionFields({ id, updates })
        ).unwrap();

        setLocalTransactions((prev) =>
          prev.map((tx) =>
            tx.id === id
              ? {
                  ...tx,
                  volumetricWeight: result.volumetricWeight,
                  volumetricWeightUnit: result.volumetricWeightUnit as
                    | WeightUnit
                    | undefined,
                }
              : tx
          )
        );

        setEditingVolumetricWeightId(null);
        toast.success("Volumetric weight updated successfully");
      } catch (err) {
        console.error("Error updating volumetric weight:", err);
        toast.error("Failed to update volumetric weight");
      }
    },
    [dispatch, editVolumetricWeight]
  );

  const handleSaveEdit = useCallback(
    async (id: string) => {
      try {
        const parsedAmount = parseFloat(editAmount) || 0;
        const updates = { amount: parsedAmount, status: "pending" as const };

        const updatedTransaction = await dispatch(
          updateTransactionFields({ id, updates })
        ).unwrap();

        setLocalTransactions((prev) =>
          prev.map((tx) => {
            if (tx.id !== id) return tx;

            // Create a new transaction object with the correct types
            const updatedTx: TransactionItem = {
              ...tx,
              id: updatedTransaction._id || id,
              date: updatedTransaction.updatedAt?.toString() || tx.date,
              type: tx.type || "payment",
              customer:
                typeof updatedTransaction.userId === "string"
                  ? updatedTransaction.userId
                  : (updatedTransaction.userId as any)?.name ||
                    tx.customer ||
                    "Unknown",
              status:
                (updatedTransaction.status as
                  | "pending"
                  | "completed"
                  | "failed") || tx.status,
              amount: updatedTransaction.amount || tx.amount,
              // Handle packageId conversion
              ...(updatedTransaction.packageId && {
                packageId: (() => {
                  const pkg = updatedTransaction.packageId;
                  if (!pkg) return undefined;
                  if (typeof pkg === "string") return pkg;
                  // Convert Package to PackageItem
                  return {
                    _id: (pkg as any)._id || (pkg as any).id,
                    trackingId: (pkg as any).trackingId,
                    status: (pkg as any).status,
                    dimensions: (pkg as any).dimensions,
                  };
                })(),
              }),
            };

            return updatedTx;
          })
        );
        setEditingId(null);
        toast.success("Transaction updated successfully");
      } catch (err) {
        console.error("Failed to update transaction:", err);
        toast.error("Failed to update transaction");
      }
    },
    [dispatch, editAmount]
  );

  const handleUpdateDimensions = useCallback(
    async (id: string, dimensions: Dimensions) => {
      try {
        const updatedTransaction = await dispatch(
          updateTransactionFields({ id, updates: { dimensions } })
        ).unwrap();

        setLocalTransactions((prev: TransactionItem[]) =>
          prev.map((tx: TransactionItem) => {
            if (tx.id !== id) return tx;

            // Create a new transaction object with the correct types
            const updatedTx: TransactionItem = {
              ...tx,
              id: updatedTransaction._id || tx.id,
              date: updatedTransaction.updatedAt?.toString() || tx.date,
              type: tx.type || "payment",
              customer:
                typeof updatedTransaction.userId === "string"
                  ? updatedTransaction.userId
                  : (updatedTransaction.userId as any)?.name ||
                    tx.customer ||
                    "Unknown",
              status:
                (updatedTransaction.status as
                  | "pending"
                  | "completed"
                  | "failed") || tx.status,
              amount: updatedTransaction.amount || tx.amount,
              // Handle packageId conversion
              ...(updatedTransaction.packageId && {
                packageId: (() => {
                  const pkg = updatedTransaction.packageId;
                  if (!pkg) return undefined;
                  if (typeof pkg === "string") return pkg;
                  // Convert Package to PackageItem
                  return {
                    _id: (pkg as any)._id || (pkg as any).id,
                    trackingId: (pkg as any).trackingId,
                    status: (pkg as any).status,
                    dimensions: (pkg as any).dimensions,
                  };
                })(),
              }),
              // Update dimensions
              dimensions: updatedTransaction.dimensions || tx.dimensions,
            };

            return updatedTx;
          })
        );

        setEditingDimensionsId(null);
        toast.success("Dimensions updated successfully");
      } catch (err) {
        console.error("Error updating dimensions:", err);
        toast.error("Failed to update dimensions");
      }
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Manage transaction activities</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
            <div className="flex justify-between">
              <p>{error}</p>
              <button
                onClick={() => dispatch(fetchAllTransactions())}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border rounded-2xl shadow-lg">
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Search transactions..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <select
                  className="pl-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as typeof filterType)
                  }
                >
                  <option value="all">All Types</option>
                  <option value="payment">Payment</option>
                  <option value="refund">Refund</option>
                </select>
                <select
                  className="pl-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as typeof filterStatus)
                  }
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  className="pl-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                  value={filterPackageStatus}
                  onChange={(e) =>
                    setFilterPackageStatus(
                      e.target.value as typeof filterPackageStatus
                    )
                  }
                >
                  <option value="all">All Package Status</option>
                  <option value="in_transit_to_india">
                    In Transit → India
                  </option>
                </select>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showAllTransactions}
                    onChange={(e) => setShowAllTransactions(e.target.checked)}
                  />
                  <div className="relative w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  <span className="ml-3 text-sm text-gray-700">Show All</span>
                </label>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "Order ID",
                    "Customer",
                    "Amount",
                    "Status",
                    "Date",
                    "Dimensions",
                    "Volumetric Weight",
                    "Weight",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                      <span className="text-gray-600">Loading...</span>
                    </td>
                  </tr>
                ) : filteredTransactions.length ? (
                  filteredTransactions.map((txn, index) => (
                    <tr
                      key={txn.id}
                      className={`border-b hover:bg-blue-50 ${
                        index % 2 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded-lg">
                          {txn.orderId || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">{txn.customer || "—"}</td>
                      <td className="py-4 px-6">
                        {editingId === txn.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-24 px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                              min="0"
                              step="0.01"
                              autoFocus
                            />
                            <span className="text-xs text-gray-500">₹</span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <span
                              className={`font-semibold ${
                                txn.type === "refund"
                                  ? "text-red-600"
                                  : txn.amount === 0
                                  ? "text-gray-500 italic"
                                  : "text-gray-900"
                              }`}
                            >
                              {txn.type === "refund" ? "-" : ""}
                              {txn.amount === 0
                                ? "₹0.00"
                                : formatCurrency(txn.amount)}
                            </span>
                            <button
                              onClick={() => handleEditClick(txn)}
                              className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                              title="Edit amount"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            txn.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : txn.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {txn.status.charAt(0).toUpperCase() +
                            txn.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {formatDateTime(txn.date)}
                      </td>
                      <td className="py-4 px-6">
                        {editingDimensionsId === txn.id ? (
                          <EditDimensions
                            transactionId={txn.id}
                            dimensions={txn.dimensions}
                            onSave={handleUpdateDimensions}
                            onCancel={() => setEditingDimensionsId(null)}
                          />
                        ) : txn.dimensions ? (
                          <div className="flex gap-1">
                            <span>
                              {txn.dimensions.width}×{txn.dimensions.height}×
                              {txn.dimensions.length} {txn.dimensions.unit}
                            </span>
                            <button
                              onClick={() => setEditingDimensionsId(txn.id)}
                              className="text-gray-400 hover:text-blue-500"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingDimensionsId(txn.id)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Add
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {editingVolumetricWeightId === txn.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editVolumetricWeight.value}
                              onChange={(e) =>
                                setEditVolumetricWeight((prev) => ({
                                  ...prev,
                                  value: e.target.value,
                                }))
                              }
                              className="w-20 px-2 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                              min="0"
                              step="0.01"
                              autoFocus
                            />
                            <select
                              value={editVolumetricWeight.unit}
                              onChange={(e) => {
                                setEditVolumetricWeight((prev) => ({
                                  ...prev,
                                  unit: e.target.value as WeightUnit,
                                }));
                              }}
                              className="text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="kg">kg</option>
                              <option value="g">g</option>
                              <option value="lb">lb</option>
                              <option value="oz">oz</option>
                            </select>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  handleSaveVolumetricWeight(txn.id)
                                }
                                className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                                title="Save"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setEditingVolumetricWeightId(null)
                                }
                                className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>
                              {txn.volumetricWeight
                                ? `${txn.volumetricWeight} ${
                                    txn.volumetricWeightUnit || "kg"
                                  }`
                                : "N/A"}
                            </span>
                            <button
                              onClick={() => handleEditVolumetricWeight(txn)}
                              className="text-gray-400 hover:text-blue-500"
                              title="Edit volumetric weight"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {txn.weight
                          ? `${txn.weight} ${txn.weightUnit || "kg"}`
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        {editingId === txn.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(txn.id)}
                              className="p-2 rounded-full hover:bg-green-100 text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 rounded-full hover:bg-red-100 text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(txn)}
                              disabled={txn.status === "completed"}
                              className={`p-2 rounded-full ${
                                txn.status === "completed"
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "hover:bg-blue-100 text-blue-600"
                              }`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-900 text-lg">
                          {error ? "Failed to load" : "No transactions found"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {error ? "Try again later" : "Adjust search/filters"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{localTransactions.length}</span>{" "}
              transactions
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
