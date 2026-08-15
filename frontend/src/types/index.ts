export type AccountType = 'checking' | 'savings' | 'cd' | 'ira' | '401k' | 'brokerage';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  institution: string | null;
  balance: number | string;
  interest_rate: number | string | null;
  maturity_date: string | null;
  created_at: string;
  updated_at: string;
}

export type AccountInput = Omit<Account, 'id' | 'created_at' | 'updated_at'>;

export interface Transaction {
  id: number;
  account_id: number;
  account_name?: string;
  date: string;
  description: string;
  category: string;
  amount: number | string;
  created_at: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'created_at' | 'account_name'>;

export type AssetClass = 'stock' | 'bond' | 'etf' | 'mutual_fund' | 'cash';

export interface Investment {
  id: number;
  account_id: number;
  account_name?: string;
  symbol: string;
  name: string;
  asset_class: AssetClass;
  shares: number | string;
  cost_basis: number | string;
  current_price: number | string;
  current_value?: number | string;
  created_at: string;
  updated_at: string;
}

export type InvestmentInput = Omit<Investment, 'id' | 'created_at' | 'updated_at' | 'account_name' | 'current_value'>;

export interface DashboardSummary {
  netWorth: number;
  accountsByType: Record<string, number>;
  investmentsTotal: number;
  allocationByAssetClass: Record<string, number>;
  monthToDateSpend: number;
}
