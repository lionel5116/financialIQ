import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/format';

interface DonutChartProps {
  data: { key: string; name: string; value: number }[];
  colorFor: (key: string) => string;
  emptyMessage: string;
}

export default function DonutChart({ data, colorFor, emptyMessage }: DonutChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={84}
          paddingAngle={2}
          stroke="#1e293b"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={colorFor(entry.key)} />
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
