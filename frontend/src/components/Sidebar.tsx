import { LayoutDashboard, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-slate-950 border-r border-white/5 flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Logo className="h-7 w-auto" />
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map(({ to, label, end, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
