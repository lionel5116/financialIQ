import { CreditCard, Landmark, PiggyBank, Repeat, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import AccountsOverviewList from '../components/AccountsOverviewList';
import AccountTypeChart from '../components/AccountTypeChart';
import AllocationChart from '../components/AllocationChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import InvestmentsOverviewTable from '../components/InvestmentsOverviewTable';
import StatCard from '../components/StatCard';
import * as accountsApi from '../services/accounts';
import { fetchDashboardSummary } from '../services/dashboard';
import * as investmentsApi from '../services/investments';
import type { Account, DashboardSummary, Investment } from '../types';
import { formatCurrency } from '../utils/format';

const PANEL_CLASS = 'bg-slate-800/60 rounded-xl border border-white/5 p-5';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchDashboardSummary(), accountsApi.fetchAccounts(), investmentsApi.fetchInvestments()])
      .then(([s, a, i]) => {
        setSummary(s);
        setAccounts(a);
        setInvestments(i);
      })
      .catch(() => setError('Failed to load dashboard data. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-sm text-rose-400">{error}</p>;
  if (!summary) return null;

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Dashboard</p>
          <h1 className="text-2xl font-semibold text-white mt-1">Welcome back</h1>
        </div>
        <p className="text-sm text-slate-500">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Net Worth" value={formatCurrency(summary.netWorth)} icon={Landmark} accent="emerald" />
        <StatCard label="Total Assets" value={formatCurrency(summary.totalAssets)} icon={TrendingUp} accent="sky" />
        <StatCard label="Total Cash" value={formatCurrency(summary.totalCash)} icon={PiggyBank} accent="violet" />
        <StatCard label="Expenses This Month" value={formatCurrency(summary.monthToDateSpend)} icon={CreditCard} accent="amber" />
        <StatCard label="Recurring / Month" value={formatCurrency(summary.recurringMonthlyTotal)} icon={Repeat} accent="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className={`${PANEL_CLASS} lg:col-span-3`}>
          <h2 className="text-sm font-semibold text-white mb-4">Asset Allocation Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">By Asset Class</p>
              <AllocationChart allocation={summary.allocationByAssetClass} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">By Account Type</p>
              <AccountTypeChart accountsByType={summary.accountsByType} />
            </div>
          </div>
        </div>

        <div className={`${PANEL_CLASS} lg:col-span-2`}>
          <h2 className="text-sm font-semibold text-white mb-1">Accounts Overview</h2>
          <AccountsOverviewList accounts={accounts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className={`${PANEL_CLASS} lg:col-span-2`}>
          <h2 className="text-sm font-semibold text-white mb-4">Investment Portfolio Summary</h2>
          <InvestmentsOverviewTable investments={investments} />
        </div>

        <div className={`${PANEL_CLASS} lg:col-span-3`}>
          <h2 className="text-sm font-semibold text-white mb-4">Expense &amp; Income Trend</h2>
          <IncomeExpenseChart data={summary.incomeExpenseTrend} />
        </div>
      </div>
    </div>
  );
}
