import { useEffect, useState } from 'react';
import RecurringExpenseFormModal from '../components/RecurringExpenseFormModal';
import RecurringExpensesTable from '../components/RecurringExpensesTable';
import * as accountsApi from '../services/accounts';
import * as recurringApi from '../services/recurringExpenses';
import type { Account, RecurringExpense, RecurringExpenseInput } from '../types';
import { formatCurrency } from '../utils/format';

export default function RecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringExpense | undefined>(undefined);
  const [loggingAll, setLoggingAll] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([recurringApi.fetchRecurringExpenses(), accountsApi.fetchAccounts()])
      .then(([re, acc]) => {
        setRecurringExpenses(re);
        setAccounts(acc);
      })
      .catch(() => setError('Failed to load recurring expenses. Is the backend running?'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const monthlyTotal = recurringExpenses.filter((re) => re.active).reduce((sum, re) => sum + Number(re.amount), 0);
  const dueCount = recurringExpenses.filter((re) => re.active && !re.logged_this_month).length;

  async function handleSubmit(input: Partial<RecurringExpenseInput>) {
    if (editing) {
      await recurringApi.updateRecurringExpense(editing.id, input);
    } else {
      await recurringApi.createRecurringExpense(input);
    }
    load();
  }

  async function handleDelete(re: RecurringExpense) {
    if (!confirm(`Delete recurring expense "${re.name}"? This does not remove transactions already logged from it.`)) return;
    await recurringApi.deleteRecurringExpense(re.id);
    load();
  }

  async function handleLog(re: RecurringExpense) {
    try {
      await recurringApi.logRecurringExpense(re.id);
      load();
    } catch {
      alert('Failed to log this expense — it may already be logged for this month.');
    }
  }

  async function handleLogAll() {
    setLoggingAll(true);
    try {
      const result = await recurringApi.logAllDueRecurringExpenses();
      load();
      if (result.created === 0) {
        alert('Everything is already logged for this month.');
      }
    } finally {
      setLoggingAll(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Recurring Expenses</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monthly bills — {formatCurrency(monthlyTotal)}/mo, {dueCount} not yet logged this month.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLogAll}
            disabled={loggingAll || dueCount === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50"
          >
            Log All Due
          </button>
          <button
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
            disabled={accounts.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            Add Recurring Expense
          </button>
        </div>
      </div>

      <div className="bg-slate-800/60 rounded-xl border border-white/5 p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading recurring expenses...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : (
          <RecurringExpensesTable
            recurringExpenses={recurringExpenses}
            onEdit={(re) => {
              setEditing(re);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
            onLog={handleLog}
          />
        )}
      </div>

      {modalOpen && (
        <RecurringExpenseFormModal
          accounts={accounts}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
