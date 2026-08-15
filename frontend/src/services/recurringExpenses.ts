import { api } from './api';
import type { RecurringExpense, RecurringExpenseInput, Transaction } from '../types';

export async function fetchRecurringExpenses(): Promise<RecurringExpense[]> {
  const { data } = await api.get<RecurringExpense[]>('/recurring-expenses');
  return data;
}

export async function createRecurringExpense(input: Partial<RecurringExpenseInput>): Promise<RecurringExpense> {
  const { data } = await api.post<RecurringExpense>('/recurring-expenses', input);
  return data;
}

export async function updateRecurringExpense(
  id: number,
  input: Partial<RecurringExpenseInput>
): Promise<RecurringExpense> {
  const { data } = await api.put<RecurringExpense>(`/recurring-expenses/${id}`, input);
  return data;
}

export async function deleteRecurringExpense(id: number): Promise<void> {
  await api.delete(`/recurring-expenses/${id}`);
}

export async function logRecurringExpense(id: number): Promise<Transaction> {
  const { data } = await api.post<Transaction>(`/recurring-expenses/${id}/log`);
  return data;
}

export async function logAllDueRecurringExpenses(): Promise<{ created: number; transactions: Transaction[] }> {
  const { data } = await api.post<{ created: number; transactions: Transaction[] }>('/recurring-expenses/log-all');
  return data;
}
