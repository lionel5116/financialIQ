import { ACCOUNT_TYPE_LABELS } from '../utils/format';
import DonutChart from './DonutChart';

// Categorical palette slots (fixed order, dark-surface steps) — see dataviz skill reference palette.
// A separate fixed order from AllocationChart's asset-class colors since this is a distinct chart/legend.
const SERIES_COLORS: Record<string, string> = {
  checking: '#3987e5', // slot 1 blue
  savings: '#d95926', // slot 2 orange
  cash: '#199e70', // slot 3 aqua
  cd: '#c98500', // slot 4 yellow
  ira: '#d55181', // slot 5 magenta
  '401k': '#008300', // slot 6 green
  brokerage: '#9085e9', // slot 7 violet
  home_equity: '#e66767', // slot 8 red
};

interface AccountTypeChartProps {
  accountsByType: Record<string, number>;
}

export default function AccountTypeChart({ accountsByType }: AccountTypeChartProps) {
  const data = Object.entries(accountsByType)
    .filter(([, value]) => value > 0)
    .map(([type, value]) => ({
      name: ACCOUNT_TYPE_LABELS[type] || type,
      key: type,
      value,
    }));

  return (
    <DonutChart data={data} colorFor={(key) => SERIES_COLORS[key] || '#64748b'} emptyMessage="No accounts yet." />
  );
}
