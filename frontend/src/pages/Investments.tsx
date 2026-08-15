import { useEffect, useState } from 'react';
import InvestmentFormModal from '../components/InvestmentFormModal';
import InvestmentsTable from '../components/InvestmentsTable';
import * as accountsApi from '../services/accounts';
import * as investmentsApi from '../services/investments';
import type { Account, Investment, InvestmentInput } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { exportToPdf } from '../utils/exportPdf';
import { ASSET_CLASS_LABELS, formatCurrency } from '../utils/format';

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Investment | undefined>(undefined);

  function load() {
    setLoading(true);
    Promise.all([investmentsApi.fetchInvestments(), accountsApi.fetchAccounts()])
      .then(([inv, acc]) => {
        setInvestments(inv);
        setAccounts(acc);
      })
      .catch(() => setError('Failed to load investments. Is the backend running?'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const investableAccounts = accounts.filter((a) => a.type === 'ira' || a.type === '401k' || a.type === 'brokerage');

  async function handleSubmit(input: Partial<InvestmentInput>) {
    if (editing) {
      await investmentsApi.updateInvestment(editing.id, input);
    } else {
      await investmentsApi.createInvestment(input);
    }
    load();
  }

  async function handleDelete(inv: Investment) {
    if (!confirm(`Delete holding "${inv.symbol}"?`)) return;
    await investmentsApi.deleteInvestment(inv.id);
    load();
  }

  function valueOf(inv: Investment) {
    return Number(inv.current_value ?? Number(inv.shares) * Number(inv.current_price));
  }

  function handleExportCsv() {
    exportToCsv(
      'investments',
      ['Symbol', 'Name', 'Account', 'Asset Class', 'Shares', 'Cost Basis', 'Price', 'Value'],
      investments.map((i) => [
        i.symbol,
        i.name,
        i.account_name || '',
        ASSET_CLASS_LABELS[i.asset_class],
        i.shares,
        Number(i.cost_basis).toFixed(2),
        Number(i.current_price).toFixed(2),
        valueOf(i).toFixed(2),
      ])
    );
  }

  function handleExportPdf() {
    exportToPdf(
      'investments',
      'Investment Portfolio',
      ['Symbol', 'Name', 'Account', 'Asset Class', 'Shares', 'Cost Basis', 'Price', 'Value'],
      investments.map((i) => [
        i.symbol,
        i.name,
        i.account_name || '',
        ASSET_CLASS_LABELS[i.asset_class],
        i.shares,
        formatCurrency(i.cost_basis),
        formatCurrency(i.current_price),
        formatCurrency(valueOf(i)),
      ])
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Investments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Holdings across your IRA, 401(k) and brokerage accounts.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            disabled={investments.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            disabled={investments.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Export PDF
          </button>
          <button
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
            disabled={investableAccounts.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Add Investment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {loading ? (
          <p className="text-sm text-gray-500">Loading investments...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <InvestmentsTable
            investments={investments}
            onEdit={(i) => {
              setEditing(i);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalOpen && (
        <InvestmentFormModal
          accounts={accounts}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
