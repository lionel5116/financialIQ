import type { Account } from '../types';
import { ACCOUNT_TYPE_LABELS, formatCurrency, formatDate } from '../utils/format';

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export default function AccountsTable({ accounts, onEdit, onDelete }: AccountsTableProps) {
  if (accounts.length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center">No accounts yet. Add one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Institution</th>
            <th className="py-2 pr-4 font-medium">Rate</th>
            <th className="py-2 pr-4 font-medium">Maturity</th>
            <th className="py-2 pr-4 font-medium text-right">Balance</th>
            <th className="py-2 pl-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b border-gray-100 last:border-0">
              <td className="py-2.5 pr-4 font-medium text-gray-900">{account.name}</td>
              <td className="py-2.5 pr-4 text-gray-600">{ACCOUNT_TYPE_LABELS[account.type]}</td>
              <td className="py-2.5 pr-4 text-gray-600">{account.institution || '—'}</td>
              <td className="py-2.5 pr-4 text-gray-600">
                {account.interest_rate ? `${Number(account.interest_rate).toFixed(2)}%` : '—'}
              </td>
              <td className="py-2.5 pr-4 text-gray-600">{account.maturity_date ? formatDate(account.maturity_date) : '—'}</td>
              <td className="py-2.5 pr-4 text-right font-medium tabular-nums text-gray-900">
                {formatCurrency(account.balance)}
              </td>
              <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                <button onClick={() => onEdit(account)} className="text-primary-600 hover:underline mr-3">
                  Edit
                </button>
                <button onClick={() => onDelete(account)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
