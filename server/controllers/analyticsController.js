import DailyLog from '../models/DailyLog.js';
import Task from '../models/tasks.js';
import Routine from '../models/Routine.js';
import User from '../models/User.js';

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.userId;

        // ── Last 14 days of logs ──────────────────────────────
        const logs = await DailyLog.find({ userId })
            .sort({ date: -1 })
            .limit(14)
            .lean();

        // Fill in missing days with zeros so the chart is continuous
        const filledLogs = fillMissingDays(logs, 14);

        // ── All-time task stats ───────────────────────────────
        const totalTasks = await Task.countDocuments({ userId });
        const completedTasks = await Task.countDocuments({ userId, isCompleted: true });

        // ── Routine stats ────────────────────────────────────
        const routines = await Routine.find({ userId }).lean();
        const bestStreak = routines.reduce((max, r) => Math.max(max, r.longestStreak), 0);

        // ── User score + streak ──────────────────────────────
        const user = await User.findById(userId).select('score currentStreak longestStreak').lean();

        // ── Weekly completion rate ───────────────────────────
        const last7 = filledLogs.slice(0, 7);
        const totalRoutinesLast7 = last7.reduce((sum, d) => sum + d.routinesCompleted, 0);
        const maxPossibleLast7 = routines.length * 7;
        const weeklyRate = maxPossibleLast7 > 0
            ? Math.round((totalRoutinesLast7 / maxPossibleLast7) * 100)
            : 0;

        res.json({
            logs: filledLogs.reverse(), // chronological for chart
            stats: {
                totalTasks,
                completedTasks,
                taskCompletionRate: totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0,
                bestRoutineStreak: bestStreak,
                weeklyRoutineRate: weeklyRate,
                totalScore: user.score,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ── Fill gaps with empty days ─────────────────────────────
const fillMissingDays = (logs, days) => {
    const logMap = {};
    logs.forEach(l => { logMap[l.date] = l; });

    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        result.push(logMap[dateStr] || {
            date: dateStr,
            tasksCompleted: 0,
            routinesCompleted: 0,
            scoreEarned: 0
        });
    }
    return result;
};