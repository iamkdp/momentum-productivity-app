import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';

export default function TaskCard({ task }) {
  const { completeTask, deleteTask } = useTaskStore();
  const { user, checkAuth } = useAuthStore();
  const [completing, setCompleting] = useState(false);
  const [pointsFlash, setPointsFlash] = useState(null);

  const isOverdue = !task.isCompleted && task.deadline && new Date(task.deadline) < new Date();

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const pts = await completeTask(task._id);
      // await checkAuth(); // refresh score in header
      setPointsFlash(`+${pts}`);
      setTimeout(() => setPointsFlash(null), 2000);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className={`relative flex items-start gap-3 bg-zinc-900 border rounded-xl px-4 py-3 transition
      ${task.isCompleted ? 'border-zinc-800 opacity-50' : isOverdue ? 'border-red-500/40' : task.isImportant ? 'border-violet-500/40' : 'border-zinc-800'}
    `}>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={task.isCompleted || completing}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition
          ${task.isCompleted ? 'bg-violet-600 border-violet-600' : 'border-zinc-600 hover:border-violet-500'}
        `}
      >
        {task.isCompleted && (
          <svg className="w-3 h-3 text-white m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.isCompleted ? 'line-through text-zinc-500' : 'text-white'}`}>
          {task.title}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.isImportant && !task.isCompleted && (
            <span className="text-xs text-violet-400 font-medium">⭐ Important</span>
          )}
          {task.deadline && (
            <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-zinc-500'}`}>
              {isOverdue ? '⚠ Overdue · ' : '⏰ '}
              {new Date(task.deadline).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          )}
          {task.isCompleted && (
            <span className="text-xs text-zinc-500">
              Done · {task.isImportant ? '+25 pts' : '+10 pts'}
            </span>
          )}
        </div>
      </div>

      {/* Points flash */}
      {pointsFlash && (
        <span className="absolute top-2 right-10 text-sm font-bold text-emerald-400 animate-bounce">
          {pointsFlash}
        </span>
      )}

      {/* Delete */}
      {task && (
        <button
          onClick={() => deleteTask(task._id)}
          className="text-zinc-600 hover:text-red-400 transition text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}