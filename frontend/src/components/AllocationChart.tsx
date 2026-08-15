import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ASSET_CLASS_LABELS, formatCurrency } from '../utils/format';

// Categorical palette slots (fixed order) — see dataviz skill reference palette.
const SERIES_COLORS: Record<string, string> = {
  stock: '#2a78d6', // slot 1 blue
  bond: '#eb6834', // slot 2 orange
  etf: '#1baf7a', // slot 3 aqua
  mutual_fund: '#eda100', // slot 4 yellow
  cash: '#e87ba4', // slot 5 magenta
};

interface AllocationChartProps {
  allocation: Record<string, number>;
}

export default function AllocationChart({ allocation }: AllocationChartProps) {
  const data = Object.entries(allocation)
    .filter(([, value]) => value > 0)
    .map(([assetClass, value]) => ({
      name: ASSET_CLASS_LABELS[assetClass] || assetClass,
      key: assetClass,
      value,
    }));

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No investment holdings yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={2}
          stroke="#fcfcfb"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={SERIES_COLORS[entry.key] || '#898781'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: unknown) => formatCurrency(Number(Array.isArray(value) ? value[0] : (value ?? 0)))}
          contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#e1e0d9' }}
        />
        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 13, color: '#52514e' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
