import type { Transaction } from '../types';
import { formatCurrency, formatDate, toTitleCase } from '../utils/format';

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center">No transactions yet. Add one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
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
              <tr key={tx.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2.5 pr-4 text-gray-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="py-2.5 pr-4 font-medium text-gray-900">{tx.description}</td>
                <td className="py-2.5 pr-4 text-gray-600">{tx.account_name}</td>
                <td className="py-2.5 pr-4 text-gray-600">{toTitleCase(tx.category)}</td>
                <td className={`py-2.5 pr-4 text-right font-medium tabular-nums ${amount < 0 ? 'text-gray-900' : 'text-green-700'}`}>
                  {formatCurrency(amount)}
                </td>
                <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(tx)} className="text-primary-600 hover:underline mr-3">
                    Edit
                  </button>
                  <button onClick={() => onDelete(tx)} className="text-red-600 hover:underline">
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
