import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ASSET_CLASS_LABELS, formatCurrency } from '../utils/format';

// Categorical palette slots (fixed order, dark-surface steps) — see dataviz skill reference palette.
const SERIES_COLORS: Record<string, string> = {
  stock: '#3987e5', // slot 1 blue
  bond: '#d95926', // slot 2 orange
  etf: '#199e70', // slot 3 aqua
  mutual_fund: '#c98500', // slot 4 yellow
  cash: '#d55181', // slot 5 magenta
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
    return <p className="text-sm text-slate-500">No investment holdings yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={64}
          outerRadius={92}
          paddingAngle={2}
          stroke="#1e293b"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={SERIES_COLORS[entry.key] || '#64748b'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: unknown) => formatCurrency(Number(Array.isArray(value) ? value[0] : (value ?? 0)))}
          contentStyle={{
            fontSize: 13,
            borderRadius: 8,
            background: '#0f172a',
            borderColor: '#334155',
            color: '#e2e8f0',
          }}
          itemStyle={{ color: '#e2e8f0' }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 13, color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
