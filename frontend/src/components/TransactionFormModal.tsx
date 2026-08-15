import { useState } from 'react';
import type { Account, Transaction, TransactionInput } from '../types';
import { TRANSACTION_CATEGORIES } from '../utils/format';
import Modal from './Modal';

const FIELD_CLASS =
  'w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500';
const LABEL_CLASS = 'block text-sm font-medium text-slate-300 mb-1';

interface TransactionFormModalProps {
  accounts: Account[];
  initial?: Transaction;
  onClose: () => void;
  onSubmit: (input: Partial<TransactionInput>) => Promise<void>;
}

export default function TransactionFormModal({ accounts, initial, onClose, onSubmit }: TransactionFormModalProps) {
  const [accountId, setAccountId] = useState(String(initial?.account_id ?? accounts[0]?.id ?? ''));
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'other');
  const [amount, setAmount] = useState(String(initial?.amount ?? ''));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        account_id: Number(accountId),
        date,
        description,
        category,
        amount: Number(amount),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={initial ? 'Edit Transaction' : 'Add Transaction'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="tx-account" className={LABEL_CLASS}>
            Account
          </label>
          <select
            id="tx-account"
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
        <div>
          <label htmlFor="tx-date" className={LABEL_CLASS}>
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="tx-description" className={LABEL_CLASS}>
            Description
          </label>
          <input
            id="tx-description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="tx-category" className={LABEL_CLASS}>
            Category
          </label>
          <select id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)} className={FIELD_CLASS}>
            {TRANSACTION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tx-amount" className={LABEL_CLASS}>
            Amount <span className="text-slate-500">(negative for expenses)</span>
          </label>
          <input
            id="tx-amount"
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
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
            {initial ? 'Save' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
