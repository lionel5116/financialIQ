import { useState } from 'react';
import type { Account, AccountInput, AccountType } from '../types';
import { ACCOUNT_TYPE_LABELS } from '../utils/format';
import Modal from './Modal';

const ACCOUNT_TYPES: AccountType[] = ['checking', 'savings', 'cd', 'ira', '401k', 'brokerage'];
const FIELD_CLASS =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';

interface AccountFormModalProps {
  initial?: Account;
  onClose: () => void;
  onSubmit: (input: Partial<AccountInput>) => Promise<void>;
}

export default function AccountFormModal({ initial, onClose, onSubmit }: AccountFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<AccountType>(initial?.type ?? 'checking');
  const [institution, setInstitution] = useState(initial?.institution ?? '');
  const [balance, setBalance] = useState(String(initial?.balance ?? ''));
  const [interestRate, setInterestRate] = useState(String(initial?.interest_rate ?? ''));
  const [maturityDate, setMaturityDate] = useState(initial?.maturity_date ?? '');
  const [submitting, setSubmitting] = useState(false);

  const showRate = type === 'savings' || type === 'cd';
  const showMaturity = type === 'cd';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        type,
        institution: institution || null,
        balance: balance === '' ? 0 : Number(balance),
        interest_rate: showRate && interestRate !== '' ? Number(interestRate) : null,
        maturity_date: showMaturity && maturityDate !== '' ? maturityDate : null,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={initial ? 'Edit Account' : 'Add Account'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="account-name" className={LABEL_CLASS}>
            Name
          </label>
          <input
            id="account-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="account-type" className={LABEL_CLASS}>
            Type
          </label>
          <select
            id="account-type"
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            className={FIELD_CLASS}
          >
            {ACCOUNT_TYPES.map((t) => (
              <option key={t} value={t}>
                {ACCOUNT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="account-institution" className={LABEL_CLASS}>
            Institution
          </label>
          <input
            id="account-institution"
            value={institution ?? ''}
            onChange={(e) => setInstitution(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="account-balance" className={LABEL_CLASS}>
            Balance
          </label>
          <input
            id="account-balance"
            type="number"
            step="0.01"
            required
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        {showRate && (
          <div>
            <label htmlFor="account-rate" className={LABEL_CLASS}>
              Interest Rate (%)
            </label>
            <input
              id="account-rate"
              type="number"
              step="0.001"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
        )}
        {showMaturity && (
          <div>
            <label htmlFor="account-maturity" className={LABEL_CLASS}>
              Maturity Date
            </label>
            <input
              id="account-maturity"
              type="date"
              value={maturityDate ?? ''}
              onChange={(e) => setMaturityDate(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {initial ? 'Save' : 'Add Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
