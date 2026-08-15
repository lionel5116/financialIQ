import { ASSET_CLASS_LABELS } from '../utils/format';
import DonutChart from './DonutChart';

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

  return (
    <DonutChart
      data={data}
      colorFor={(key) => SERIES_COLORS[key] || '#64748b'}
      emptyMessage="No investment holdings yet."
    />
  );
}
