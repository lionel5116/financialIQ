import type { Investment } from '../types';
import { formatCurrency } from '../utils/format';

interface InvestmentsOverviewTableProps {
  investments: Investment[];
}

export default function InvestmentsOverviewTable({ investments }: InvestmentsOverviewTableProps) {
  if (investments.length === 0) {
    return <p className="text-sm text-slate-500">No investment holdings yet.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-white/5">
            <th className="py-2 px-1 font-medium">Symbol</th>
            <th className="py-2 px-1 font-medium">Name</th>
            <th className="py-2 px-1 font-medium text-right">Value</th>
            <th className="py-2 px-1 font-medium text-right">Change</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => {
            const value = Number(inv.current_value ?? Number(inv.shares) * Number(inv.current_price));
            const costBasis = Number(inv.cost_basis);
            const gainPct = costBasis > 0 ? ((value - costBasis) / costBasis) * 100 : 0;
            return (
              <tr key={inv.id} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 px-1 font-medium text-white">{inv.symbol}</td>
                <td className="py-2.5 px-1 text-slate-400 truncate max-w-[110px]">{inv.name}</td>
                <td className="py-2.5 px-1 text-right tabular-nums font-medium text-white">{formatCurrency(value)}</td>
                <td className={`py-2.5 px-1 text-right tabular-nums ${gainPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {gainPct >= 0 ? '+' : ''}
                  {gainPct.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
