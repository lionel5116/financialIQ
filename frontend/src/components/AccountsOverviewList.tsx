import { Banknote, Coins, Home, Landmark, PiggyBank, Wallet } from 'lucide-react';
import type { Account, AccountType } from '../types';
import { formatCurrency } from '../utils/format';

const TYPE_ICON: Record<AccountType, typeof Wallet> = {
  checking: Wallet,
  savings: PiggyBank,
  cash: Coins,
  cd: Banknote,
  ira: Landmark,
  '401k': Landmark,
  brokerage: Landmark,
  home_equity: Home,
};

const TYPE_ACCENT: Record<AccountType, string> = {
  checking: 'bg-sky-500/10 text-sky-400',
  savings: 'bg-emerald-500/10 text-emerald-400',
  cash: 'bg-lime-500/10 text-lime-400',
  cd: 'bg-amber-500/10 text-amber-400',
  ira: 'bg-violet-500/10 text-violet-400',
  '401k': 'bg-pink-500/10 text-pink-400',
  brokerage: 'bg-cyan-500/10 text-cyan-400',
  home_equity: 'bg-indigo-500/10 text-indigo-400',
};

interface AccountsOverviewListProps {
  accounts: Account[];
}

export default function AccountsOverviewList({ accounts }: AccountsOverviewListProps) {
  if (accounts.length === 0) {
    return <p className="text-sm text-slate-500">No accounts yet.</p>;
  }

  return (
    <ul className="divide-y divide-white/5">
      {accounts.map((account) => {
        const Icon = TYPE_ICON[account.type];
        return (
          <li key={account.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`inline-flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${TYPE_ACCENT[account.type]}`}>
                <Icon size={16} strokeWidth={2.25} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{account.name}</p>
                <p className="text-xs text-slate-500 truncate">{account.institution || '—'}</p>
              </div>
            </div>
            <span className="text-sm font-medium tabular-nums text-white shrink-0 ml-3">
              {formatCurrency(account.balance)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
