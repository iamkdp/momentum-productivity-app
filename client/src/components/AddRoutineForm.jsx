import { useState } from 'react';
import { useRoutineStore } from '../store/routineStore';

export default function AddRoutineForm() {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRoutine } = useRoutineStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await addRoutine(title);
            setTitle('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a daily routine..."
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition"
            />
            <button
                type="submit"
                disabled={loading || !title.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
                Add
            </button>
        </form>
    );
}