export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function toTitleCase(value: string): string {
  return value
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
  cash: 'Cash',
  cd: 'CD',
  ira: 'IRA',
  '401k': '401(k)',
  brokerage: 'Brokerage',
  home_equity: 'Home Equity',
};

export const ASSET_CLASS_LABELS: Record<string, string> = {
  stock: 'Stock',
  bond: 'Bond',
  etf: 'ETF',
  mutual_fund: 'Mutual Fund',
  cash: 'Cash',
};
