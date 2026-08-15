import type { RecurringExpense } from '../types';
import { formatCurrency, toTitleCase } from '../utils/format';

interface RecurringExpensesTableProps {
  recurringExpenses: RecurringExpense[];
  onEdit: (recurring: RecurringExpense) => void;
  onDelete: (recurring: RecurringExpense) => void;
  onLog: (recurring: RecurringExpense) => void;
}

function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export default function RecurringExpensesTable({
  recurringExpenses,
  onEdit,
  onDelete,
  onLog,
}: RecurringExpensesTableProps) {
  if (recurringExpenses.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">No recurring expenses yet. Add one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-white/5">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Account</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Due</th>
            <th className="py-2 pr-4 font-medium text-right">Amount</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pl-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recurringExpenses.map((re) => (
            <tr key={re.id} className="border-b border-white/5 last:border-0">
              <td className="py-2.5 pr-4 font-medium text-white">{re.name}</td>
              <td className="py-2.5 pr-4 text-slate-400">{re.account_name}</td>
              <td className="py-2.5 pr-4 text-slate-400">{toTitleCase(re.category)}</td>
              <td className="py-2.5 pr-4 text-slate-400">{ordinal(re.day_of_month)}</td>
              <td className="py-2.5 pr-4 text-right font-medium tabular-nums text-white">{formatCurrency(re.amount)}</td>
              <td className="py-2.5 pr-4">
                {!re.active ? (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400">Paused</span>
                ) : re.logged_this_month ? (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    Logged
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Due</span>
                )}
              </td>
              <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                {re.active && !re.logged_this_month && (
                  <button onClick={() => onLog(re)} className="text-emerald-400 hover:underline mr-3">
                    Log
                  </button>
                )}
                <button onClick={() => onEdit(re)} className="text-sky-400 hover:underline mr-3">
                  Edit
                </button>
                <button onClick={() => onDelete(re)} className="text-rose-400 hover:underline">
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
