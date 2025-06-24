import { useState, useEffect } from "react";
import { Search, ChevronDown, Eye, Truck } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { usePackageStatus } from "../../hooks/usePackageStatus";

// Sample order data
const sampleOrders = [
  {
    id: "ORD-5142",
    trackingId: "TRK-78945612",
    description: "Electronics & Accessories",
    status: "in_transit",
    date: "2025-05-24",
    amount: 4200,
    origin: "United States",
    destination: "Mumbai, India",
  },
  {
    id: "ORD-5141",
    trackingId: "TRK-78945611",
    description: "Clothing Items",
    status: "waiting",
    date: "2025-05-23",
    amount: 1850,
    origin: "China",
    destination: "Delhi, India",
  },
  {
    id: "ORD-5140",
    trackingId: "TRK-78945610",
    description: "Books & Stationery",
    status: "india",
    date: "2025-05-22",
    amount: 3600,
    origin: "United Kingdom",
    destination: "Bangalore, India",
  },
  {
    id: "ORD-5139",
    trackingId: "TRK-78945609",
    description: "Home Decor",
    status: "delivered",
    date: "2025-05-21",
    amount: 5100,
    origin: "Germany",
    destination: "Chennai, India",
  },
  {
    id: "ORD-5138",
    trackingId: "TRK-78945608",
    description: "Kitchen Appliances",
    status: "dispatch",
    date: "2025-05-20",
    amount: 2750,
    origin: "Japan",
    destination: "Hyderabad, India",
  },
  {
    id: "ORD-5137",
    trackingId: "TRK-78945607",
    description: "Beauty Products",
    status: "delivered",
    date: "2025-05-19",
    amount: 1950,
    origin: "South Korea",
    destination: "Pune, India",
  },
  {
    id: "ORD-5136",
    trackingId: "TRK-78945606",
    description: "Sports Equipment",
    status: "cancelled",
    date: "2025-05-18",
    amount: 3200,
    origin: "Australia",
    destination: "Kolkata, India",
  },
];

export default function Orders() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status");

  const [orders] = useState(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(statusFilter || "all");
  const { getStatusColor, getStatusLabel } = usePackageStatus();

  useEffect(() => {
    if (statusFilter) {
      setFilterStatus(statusFilter);
    }
  }, [statusFilter]);

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className=" border border-border rounded-lg shadow-sm mb-8">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search orders by ID, tracking number, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting</option>
              <option value="in_transit">In Transit</option>
              <option value="india">Arrived in India</option>
              <option value="dispatch">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Origin</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 font-medium">
                      <div>{order.id}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.trackingId}
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatDate(order.date)}</td>
                    <td className="py-3 px-4">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="py-3 px-4">{order.origin}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/user/track?id=${order.trackingId}`}
                          className="p-1 hover:bg-muted rounded-md"
                          title="Track Package"
                        >
                          <Truck className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/user/orders/${order.id}`}
                          className="p-1 hover:bg-muted rounded-md"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-input rounded-md  hover:bg-muted disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-input rounded-md  hover:bg-muted">
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Need to place a new order?
        </h2>
        <p className="text-muted-foreground mb-4">
          Get competitive rates on international shipping with our easy-to-use
          platform.
        </p>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          Create New Order
        </button>
      </div>
    </div>
  );
}
