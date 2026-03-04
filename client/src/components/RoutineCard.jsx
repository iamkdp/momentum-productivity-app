import { useState } from 'react';
import { useRoutineStore } from '../store/routineStore';
import { useAuthStore } from '../store/authStore';
import { toast } from './Toast';
export default function RoutineCard({ routine }) {
    const { completeRoutine, deleteRoutine } = useRoutineStore();
    const { checkAuth } = useAuthStore();
    const [completing, setCompleting] = useState(false);
    const [flash, setFlash] = useState(null);
    const handleComplete = async () => {
        if (routine.completedToday) return;
        setCompleting(true);
        try {
            const { pointsEarned, streakBonus, newStreak } = await completeRoutine(routine._id);
            // await checkAuth();

            if (streakBonus > 0) {
                toast.show(`🔥 ${newStreak}-day streak! +${pointsEarned} pts bonus`, 'streak');
            } else {
                toast.show(`+${pointsEarned} pts — keep it up`, 'success');
            }
        } finally {
            setCompleting(false);
        }
    };

    const streak = routine.currentStreak;

    return (
        <div className={`relative flex items-center gap-3 rounded-xl px-4 py-3 border transition
      ${routine.completedToday
                ? 'bg-emerald-950/30 border-emerald-700/30'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
        >
            {/* Complete button */}
            <button
                onClick={handleComplete}
                disabled={routine.completedToday || completing}
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition
          ${routine.completedToday
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-zinc-600 hover:border-emerald-500'
                    }`}
            >
                {routine.completedToday && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${routine.completedToday ? 'text-zinc-400' : 'text-white'}`}>
                    {routine.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    {streak > 0 && (
                        <span className="text-xs text-orange-400 font-medium">
                            🔥 {streak} day{streak > 1 ? 's' : ''}
                        </span>
                    )}
                    {streak === 0 && (
                        <span className="text-xs text-zinc-600">Start your streak today</span>
                    )}
                    {routine.longestStreak > 0 && streak !== routine.longestStreak && (
                        <span className="text-xs text-zinc-600">
                            · best: {routine.longestStreak}
                        </span>
                    )}
                    {routine.completedToday && (
                        <span className="text-xs text-emerald-500">Done for today ✓</span>
                    )}
                </div>
            </div>

            {/* Flash message */}
            {flash && (
                <span className="absolute top-1.5 right-10 text-xs font-bold text-emerald-400 bg-zinc-950 px-2 py-1 rounded-full shadow animate-bounce whitespace-nowrap">
                    {flash}
                </span>
            )}

            {/* Delete */}
            <button
                onClick={() => deleteRoutine(routine._id)}
                className="text-zinc-700 hover:text-red-400 transition text-lg leading-none"
            >
                ×
            </button>
        </div>
    );
}