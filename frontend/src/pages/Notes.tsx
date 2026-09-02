import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as notesApi from '../services/notes';
import type { Note } from '../types';

export default function Notes() {
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Note | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      notesApi
        .searchNotes(query)
        .then(setNotes)
        .catch(() => setError('Failed to load notes. Is the backend running?'))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Notes</h1>
        <p className="text-sm text-slate-500 mt-0.5">Search saved notes by title.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="w-full bg-slate-800/60 border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="bg-slate-800/60 rounded-xl border border-white/5 p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading notes...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-slate-500">No notes found.</p>
        ) : notes.length === 1 ? (
          <NoteDetail note={notes[0]} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <button
                key={note._id}
                onClick={() => setActive(note)}
                className="text-left bg-slate-900/40 border border-white/5 rounded-lg p-4 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-white truncate">{note.Title}</h3>
                  {note.Category && (
                    <span className="shrink-0 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5">
                      {note.Category}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-400 line-clamp-3 whitespace-pre-line">{note.Note}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-4" onClick={() => setActive(null)}>
          <div
            className="bg-slate-800 border border-white/10 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-semibold text-white">{active.Title}</h3>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="text-slate-500 hover:text-slate-300 text-xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <NoteDetail note={active} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteDetail({ note }: { note: Note }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium text-white">{note.Title}</h3>
        {note.Category && (
          <span className="shrink-0 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5">
            {note.Category}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-300 whitespace-pre-line">{note.Note}</p>
    </div>
  );
}
