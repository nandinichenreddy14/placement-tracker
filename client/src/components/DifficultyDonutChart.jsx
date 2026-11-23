import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DIFFICULTY_HEX, DIFFICULTY_ORDER } from "@/lib/colors.js";

function DifficultyDonutChart({ data }) {
  const rows = DIFFICULTY_ORDER.map((difficulty) => ({
    difficulty,
    count: data.find((row) => row.difficulty === difficulty)?.count ?? 0,
  }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
        No problems logged yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={rows}
            dataKey="count"
            nameKey="difficulty"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={2}
            stroke="var(--card)"
          >
            {rows.map((row) => (
              <Cell key={row.difficulty} fill={DIFFICULTY_HEX[row.difficulty]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} problems`, name]}
            contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-9 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{total}</span>
        <span className="text-xs text-muted-foreground">Total</span>
      </div>
    </div>
  );
}

export default DifficultyDonutChart;
