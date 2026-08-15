import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: 'emerald' | 'sky' | 'violet' | 'amber';
}

const ACCENT_CLASSES: Record<StatCardProps['accent'], string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  sky: 'bg-sky-500/10 text-sky-400',
  violet: 'bg-violet-500/10 text-violet-400',
  amber: 'bg-amber-500/10 text-amber-400',
};

export default function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="bg-slate-800/60 rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${ACCENT_CLASSES[accent]}`}>
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </div>
      <p className="text-2xl font-semibold text-white mt-3 tabular-nums">{value}</p>
    </div>
  );
}
