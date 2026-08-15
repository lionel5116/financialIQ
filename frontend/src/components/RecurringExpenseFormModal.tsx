import { useState } from 'react';
import type { Account, RecurringExpense, RecurringExpenseInput } from '../types';
import { TRANSACTION_CATEGORIES } from '../utils/format';
import Modal from './Modal';

const FIELD_CLASS =
  'w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500';
const LABEL_CLASS = 'block text-sm font-medium text-slate-300 mb-1';

interface RecurringExpenseFormModalProps {
  accounts: Account[];
  initial?: RecurringExpense;
  onClose: () => void;
  onSubmit: (input: Partial<RecurringExpenseInput>) => Promise<void>;
}

export default function RecurringExpenseFormModal({
  accounts,
  initial,
  onClose,
  onSubmit,
}: RecurringExpenseFormModalProps) {
  const [accountId, setAccountId] = useState(String(initial?.account_id ?? accounts[0]?.id ?? ''));
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'other');
  const [amount, setAmount] = useState(String(initial?.amount ?? ''));
  const [dayOfMonth, setDayOfMonth] = useState(String(initial?.day_of_month ?? '1'));
  const [active, setActive] = useState(initial?.active ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        account_id: Number(accountId),
        name,
        category,
        amount: Number(amount),
        day_of_month: Number(dayOfMonth),
        active,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={initial ? 'Edit Recurring Expense' : 'Add Recurring Expense'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="re-name" className={LABEL_CLASS}>
            Name
          </label>
          <input
            id="re-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. XFINITY"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="re-account" className={LABEL_CLASS}>
            Account
          </label>
          <select
            id="re-account"
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className={FIELD_CLASS}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="re-category" className={LABEL_CLASS}>
              Category
            </label>
            <select
              id="re-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={FIELD_CLASS}
            >
              {TRANSACTION_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="re-day" className={LABEL_CLASS}>
              Day of Month
            </label>
            <input
              id="re-day"
              type="number"
              min={1}
              max={31}
              required
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
        </div>
        <div>
          <label htmlFor="re-amount" className={LABEL_CLASS}>
            Amount
          </label>
          <input
            id="re-amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-white/10 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
          />
          Active
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || accounts.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {initial ? 'Save' : 'Add Recurring Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
