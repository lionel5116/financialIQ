import { useEffect, useState } from 'react';
import AccountFormModal from '../components/AccountFormModal';
import AccountsTable from '../components/AccountsTable';
import * as accountsApi from '../services/accounts';
import type { Account, AccountInput } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { exportToPdf } from '../utils/exportPdf';
import { ACCOUNT_TYPE_LABELS, formatCurrency } from '../utils/format';

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Account | undefined>(undefined);

  function load() {
    setLoading(true);
    accountsApi
      .fetchAccounts()
      .then(setAccounts)
      .catch(() => setError('Failed to load accounts. Is the backend running?'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(input: Partial<AccountInput>) {
    if (editing) {
      await accountsApi.updateAccount(editing.id, input);
    } else {
      await accountsApi.createAccount(input);
    }
    load();
  }

  async function handleDelete(account: Account) {
    if (!confirm(`Delete "${account.name}"? This also removes its transactions and investments.`)) return;
    await accountsApi.deleteAccount(account.id);
    load();
  }

  function handleExportCsv() {
    exportToCsv(
      'accounts',
      ['Name', 'Type', 'Institution', 'Rate (%)', 'Maturity Date', 'Balance'],
      accounts.map((a) => [
        a.name,
        ACCOUNT_TYPE_LABELS[a.type],
        a.institution || '',
        a.interest_rate ?? '',
        a.maturity_date || '',
        Number(a.balance).toFixed(2),
      ])
    );
  }

  function handleExportPdf() {
    exportToPdf(
      'accounts',
      'Accounts',
      ['Name', 'Type', 'Institution', 'Rate (%)', 'Maturity Date', 'Balance'],
      accounts.map((a) => [
        a.name,
        ACCOUNT_TYPE_LABELS[a.type],
        a.institution || '',
        a.interest_rate ?? '',
        a.maturity_date || '',
        formatCurrency(a.balance),
      ])
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Bank accounts, CDs, IRAs, 401(k) and brokerage accounts.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            disabled={accounts.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            disabled={accounts.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50"
          >
            Export PDF
          </button>
          <button
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
            className="px-3 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Add Account
          </button>
        </div>
      </div>

      <div className="bg-slate-800/60 rounded-xl border border-white/5 p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading accounts...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : (
          <AccountsTable
            accounts={accounts}
            onEdit={(a) => {
              setEditing(a);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalOpen && (
        <AccountFormModal initial={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
