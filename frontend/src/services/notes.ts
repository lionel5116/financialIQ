import { api } from './api';
import type { Note } from '../types';

export async function searchNotes(title: string): Promise<Note[]> {
  const { data } = await api.get<Note[]>('/notes', {
    params: title.trim() ? { title: title.trim() } : undefined,
  });
  return data;
}
