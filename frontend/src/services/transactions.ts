import { api } from './api';
import type { Transaction, TransactionInput } from '../types';

export async function fetchTransactions(accountId?: number): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>('/transactions', {
    params: accountId ? { accountId } : undefined,
  });
  return data;
}

export async function createTransaction(input: Partial<TransactionInput>): Promise<Transaction> {
  const { data } = await api.post<Transaction>('/transactions', input);
  return data;
}

export async function updateTransaction(id: number, input: Partial<TransactionInput>): Promise<Transaction> {
  const { data } = await api.put<Transaction>(`/transactions/${id}`, input);
  return data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
