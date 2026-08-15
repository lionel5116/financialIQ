import { useEffect, useState } from 'react';
import TransactionFormModal from '../components/TransactionFormModal';
import TransactionsTable from '../components/TransactionsTable';
import * as accountsApi from '../services/accounts';
import * as transactionsApi from '../services/transactions';
import type { Account, Transaction, TransactionInput } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { exportToPdf } from '../utils/exportPdf';
import { formatCurrency, formatDate, toTitleCase } from '../utils/format';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);

  function load() {
    setLoading(true);
    Promise.all([transactionsApi.fetchTransactions(), accountsApi.fetchAccounts()])
      .then(([tx, acc]) => {
        setTransactions(tx);
        setAccounts(acc);
      })
      .catch(() => setError('Failed to load transactions. Is the backend running?'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(input: Partial<TransactionInput>) {
    if (editing) {
      await transactionsApi.updateTransaction(editing.id, input);
    } else {
      await transactionsApi.createTransaction(input);
    }
    load();
  }

  async function handleDelete(tx: Transaction) {
    if (!confirm(`Delete transaction "${tx.description}"?`)) return;
    await transactionsApi.deleteTransaction(tx.id);
    load();
  }

  function handleExportCsv() {
    exportToCsv(
      'transactions',
      ['Date', 'Description', 'Account', 'Category', 'Amount'],
      transactions.map((t) => [t.date, t.description, t.account_name || '', toTitleCase(t.category), Number(t.amount).toFixed(2)])
    );
  }

  function handleExportPdf() {
    exportToPdf(
      'transactions',
      'Transactions',
      ['Date', 'Description', 'Account', 'Category', 'Amount'],
      transactions.map((t) => [
        formatDate(t.date),
        t.description,
        t.account_name || '',
        toTitleCase(t.category),
        formatCurrency(t.amount),
      ])
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daily income and expenses across your accounts.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            disabled={transactions.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            disabled={transactions.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Export PDF
          </button>
          <button
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
            disabled={accounts.length === 0}
            className="px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {loading ? (
          <p className="text-sm text-gray-500">Loading transactions...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <TransactionsTable
            transactions={transactions}
            onEdit={(t) => {
              setEditing(t);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalOpen && (
        <TransactionFormModal
          accounts={accounts}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
