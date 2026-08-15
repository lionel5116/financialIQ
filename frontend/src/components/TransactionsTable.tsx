import type { Transaction } from '../types';
import { formatCurrency, formatDate, toTitleCase } from '../utils/format';

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">No transactions yet. Add one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-white/5">
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Description</th>
            <th className="py-2 pr-4 font-medium">Account</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium text-right">Amount</th>
            <th className="py-2 pl-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const amount = Number(tx.amount);
            return (
              <tr key={tx.id} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 pr-4 text-slate-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="py-2.5 pr-4 font-medium text-white">{tx.description}</td>
                <td className="py-2.5 pr-4 text-slate-400">{tx.account_name}</td>
                <td className="py-2.5 pr-4 text-slate-400">{toTitleCase(tx.category)}</td>
                <td className={`py-2.5 pr-4 text-right font-medium tabular-nums ${amount < 0 ? 'text-white' : 'text-emerald-400'}`}>
                  {formatCurrency(amount)}
                </td>
                <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(tx)} className="text-emerald-400 hover:underline mr-3">
                    Edit
                  </button>
                  <button onClick={() => onDelete(tx)} className="text-rose-400 hover:underline">
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
