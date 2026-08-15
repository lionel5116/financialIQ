import type { Investment } from '../types';
import { ASSET_CLASS_LABELS, formatCurrency } from '../utils/format';

interface InvestmentsTableProps {
  investments: Investment[];
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
}

export default function InvestmentsTable({ investments, onEdit, onDelete }: InvestmentsTableProps) {
  if (investments.length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center">No investment holdings yet. Add one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-2 pr-4 font-medium">Symbol</th>
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Account</th>
            <th className="py-2 pr-4 font-medium">Asset Class</th>
            <th className="py-2 pr-4 font-medium text-right">Shares</th>
            <th className="py-2 pr-4 font-medium text-right">Cost Basis</th>
            <th className="py-2 pr-4 font-medium text-right">Price</th>
            <th className="py-2 pr-4 font-medium text-right">Value</th>
            <th className="py-2 pr-4 font-medium text-right">Gain/Loss</th>
            <th className="py-2 pl-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => {
            const value = Number(inv.current_value ?? Number(inv.shares) * Number(inv.current_price));
            const gain = value - Number(inv.cost_basis);
            return (
              <tr key={inv.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-gray-900">{inv.symbol}</td>
                <td className="py-2.5 pr-4 text-gray-600">{inv.name}</td>
                <td className="py-2.5 pr-4 text-gray-600">{inv.account_name}</td>
                <td className="py-2.5 pr-4 text-gray-600">{ASSET_CLASS_LABELS[inv.asset_class]}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-gray-600">{Number(inv.shares).toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-gray-600">{formatCurrency(inv.cost_basis)}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-gray-600">{formatCurrency(inv.current_price)}</td>
                <td className="py-2.5 pr-4 text-right font-medium tabular-nums text-gray-900">{formatCurrency(value)}</td>
                <td className={`py-2.5 pr-4 text-right tabular-nums ${gain >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {gain >= 0 ? '+' : ''}
                  {formatCurrency(gain)}
                </td>
                <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(inv)} className="text-primary-600 hover:underline mr-3">
                    Edit
                  </button>
                  <button onClick={() => onDelete(inv)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
