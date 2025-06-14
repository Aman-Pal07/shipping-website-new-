import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UsersChartProps {
  data: {
    name: string;
    users: number;
    activeUsers: number;
  }[];
  className?: string;
}

export function UsersChart({ data, className }: UsersChartProps) {
  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
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
          <Line
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            name="Total Users"
          />
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#22c55e"
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
