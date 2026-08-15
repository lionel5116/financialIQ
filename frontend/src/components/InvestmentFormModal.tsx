import { useState } from 'react';
import type { Account, AssetClass, Investment, InvestmentInput } from '../types';
import { ASSET_CLASS_LABELS } from '../utils/format';
import Modal from './Modal';

const ASSET_CLASSES: AssetClass[] = ['stock', 'bond', 'etf', 'mutual_fund', 'cash'];
const FIELD_CLASS =
  'w-full rounded-md border border-white/10 bg-slate-900 text-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500';
const LABEL_CLASS = 'block text-sm font-medium text-slate-300 mb-1';

interface InvestmentFormModalProps {
  accounts: Account[];
  initial?: Investment;
  onClose: () => void;
  onSubmit: (input: Partial<InvestmentInput>) => Promise<void>;
}

export default function InvestmentFormModal({ accounts, initial, onClose, onSubmit }: InvestmentFormModalProps) {
  const investableAccounts = accounts.filter((a) => a.type === 'ira' || a.type === '401k' || a.type === 'brokerage');
  const [accountId, setAccountId] = useState(String(initial?.account_id ?? investableAccounts[0]?.id ?? ''));
  const [symbol, setSymbol] = useState(initial?.symbol ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [assetClass, setAssetClass] = useState<AssetClass>(initial?.asset_class ?? 'stock');
  const [shares, setShares] = useState(String(initial?.shares ?? ''));
  const [costBasis, setCostBasis] = useState(String(initial?.cost_basis ?? ''));
  const [currentPrice, setCurrentPrice] = useState(String(initial?.current_price ?? ''));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        account_id: Number(accountId),
        symbol,
        name,
        asset_class: assetClass,
        shares: Number(shares),
        cost_basis: Number(costBasis),
        current_price: Number(currentPrice),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={initial ? 'Edit Investment' : 'Add Investment'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="inv-account" className={LABEL_CLASS}>
            Account
          </label>
          <select
            id="inv-account"
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className={FIELD_CLASS}
          >
            {investableAccounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="inv-symbol" className={LABEL_CLASS}>
              Symbol
            </label>
            <input
              id="inv-symbol"
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="inv-asset-class" className={LABEL_CLASS}>
              Asset Class
            </label>
            <select
              id="inv-asset-class"
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value as AssetClass)}
              className={FIELD_CLASS}
            >
              {ASSET_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {ASSET_CLASS_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="inv-name" className={LABEL_CLASS}>
            Name
          </label>
          <input id="inv-name" required value={name} onChange={(e) => setName(e.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="inv-shares" className={LABEL_CLASS}>
              Shares
            </label>
            <input
              id="inv-shares"
              type="number"
              step="0.0001"
              required
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="inv-cost-basis" className={LABEL_CLASS}>
              Cost Basis
            </label>
            <input
              id="inv-cost-basis"
              type="number"
              step="0.01"
              required
              value={costBasis}
              onChange={(e) => setCostBasis(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="inv-price" className={LABEL_CLASS}>
              Price
            </label>
            <input
              id="inv-price"
              type="number"
              step="0.01"
              required
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
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
            disabled={submitting || investableAccounts.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {initial ? 'Save' : 'Add Investment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
