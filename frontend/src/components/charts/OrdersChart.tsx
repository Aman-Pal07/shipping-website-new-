import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface OrdersChartProps {
  data: {
    name: string;
    waiting: number;
    in_transit: number;
    india: number;
    dispatch: number;
    delivered: number;
  }[];
  className?: string;
}

export function OrdersChart({ data, className }: OrdersChartProps) {
  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="waiting" fill="#facc15" name="Waiting" />
          <Bar dataKey="in_transit" fill="#3b82f6" name="In Transit" />
          <Bar dataKey="india" fill="#a855f7" name="India" />
          <Bar dataKey="dispatch" fill="#f97316" name="Dispatch" />
          <Bar dataKey="delivered" fill="#22c55e" name="Delivered" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
