import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';

export default function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const { addTask } = useTaskStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await addTask(title, isImportant, deadline || null);
      setTitle('');
      setIsImportant(false);
      setDeadline('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="accent-violet-500"
          />
          <span className="text-zinc-400 text-sm">Important</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-sm">Deadline:</span>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition"
          />
        </div>
      </div>
    </form>
  );
}