import { useEffect, useState } from 'react';
import AllocationChart from '../components/AllocationChart';
import StatCard from '../components/StatCard';
import { fetchDashboardSummary } from '../services/dashboard';
import type { DashboardSummary } from '../types';
import { ACCOUNT_TYPE_LABELS, formatCurrency } from '../utils/format';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setError('Failed to load dashboard data. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your full financial picture at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Net Worth" value={formatCurrency(summary.netWorth)} />
        <StatCard label="Investments" value={formatCurrency(summary.investmentsTotal)} />
        <StatCard label="Spend This Month" value={formatCurrency(summary.monthToDateSpend)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Investment Allocation</h2>
          <AllocationChart allocation={summary.allocationByAssetClass} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Balances by Account Type</h2>
          <ul className="divide-y divide-gray-100">
            {Object.entries(summary.accountsByType).map(([type, balance]) => (
              <li key={type} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-gray-600">{ACCOUNT_TYPE_LABELS[type] || type}</span>
                <span className="font-medium tabular-nums text-gray-900">{formatCurrency(balance)}</span>
              </li>
            ))}
            {Object.keys(summary.accountsByType).length === 0 && (
              <li className="text-sm text-gray-500 py-2.5">No accounts yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
