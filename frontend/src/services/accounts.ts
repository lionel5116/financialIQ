import { api } from './api';
import type { Account, AccountInput } from '../types';

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await api.get<Account[]>('/accounts');
  return data;
}

export async function createAccount(input: Partial<AccountInput>): Promise<Account> {
  const { data } = await api.post<Account>('/accounts', input);
  return data;
}

export async function updateAccount(id: number, input: Partial<AccountInput>): Promise<Account> {
  const { data } = await api.put<Account>(`/accounts/${id}`, input);
  return data;
}

export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`/accounts/${id}`);
}
