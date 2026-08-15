import { api } from './api';
import type { Investment, InvestmentInput } from '../types';

export async function fetchInvestments(accountId?: number): Promise<Investment[]> {
  const { data } = await api.get<Investment[]>('/investments', {
    params: accountId ? { accountId } : undefined,
  });
  return data;
}

export async function createInvestment(input: Partial<InvestmentInput>): Promise<Investment> {
  const { data } = await api.post<Investment>('/investments', input);
  return data;
}

export async function updateInvestment(id: number, input: Partial<InvestmentInput>): Promise<Investment> {
  const { data } = await api.put<Investment>(`/investments/${id}`, input);
  return data;
}

export async function deleteInvestment(id: number): Promise<void> {
  await api.delete(`/investments/${id}`);
}
