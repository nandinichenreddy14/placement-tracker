import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { CHART_PRIMARY_HEX, CHART_GRID_HEX, CHART_AXIS_HEX } from "@/lib/colors.js";

function TopicBarChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
        No problems logged yet.
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, sorted.length * 42)}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 0, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={CHART_GRID_HEX} />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 12, fill: CHART_AXIS_HEX }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="topic"
          width={100}
          tick={{ fontSize: 12, fill: "#1f2430" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#f1f2f6" }}
          contentStyle={{ borderRadius: 8, borderColor: CHART_GRID_HEX, fontSize: 13 }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} fill={CHART_PRIMARY_HEX} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TopicBarChart;
