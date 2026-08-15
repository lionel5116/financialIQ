import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { IncomeExpensePoint } from '../types';
import { formatCurrency } from '../utils/format';

const INCOME_COLOR = '#199e70'; // categorical slot 3 (aqua), dark-surface step
const EXPENSE_COLOR = '#3987e5'; // categorical slot 1 (blue), dark-surface step

interface IncomeExpenseChartProps {
  data: IncomeExpensePoint[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-500">No transactions yet.</p>;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barGap={2} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#334155' }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(v)
          }
          width={48}
        />
        <Tooltip
          cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
          formatter={(value: unknown) => formatCurrency(Number(value ?? 0))}
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
        <Legend wrapperStyle={{ fontSize: 13, color: '#94a3b8' }} />
        <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
