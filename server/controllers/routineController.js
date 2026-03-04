import Routine from '../models/Routine.js';
import User from '../models/User.js';
import DailyLog from '../models/DailyLog.js';

const ROUTINE_POINTS = 15;
const STREAK_BONUS_POINTS = 50;
const STREAK_BONUS_AT = 7;

// ─── Helpers ─────────────────────────────────────────────
const toDateString = (date) => date.toISOString().split('T')[0];

const getToday = () => {
    const now = new Date();
    return toDateString(now);
};

const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toDateString(d);
};

const isCompletedToday = (lastCompletedDate) => {
    if (!lastCompletedDate) return false;
    return toDateString(new Date(lastCompletedDate)) === getToday();
};

const isCompletedYesterday = (lastCompletedDate) => {
    if (!lastCompletedDate) return false;
    return toDateString(new Date(lastCompletedDate)) === getYesterday();
};

// ─── Attach today's status to each routine ───────────────
const attachTodayStatus = (routines) => {
    return routines.map(r => {
        const obj = r.toObject();
        obj.completedToday = isCompletedToday(r.lastCompletedDate);

        // streak is broken if last completion was before yesterday
        const streakBroken =
            r.lastCompletedDate &&
            !isCompletedToday(r.lastCompletedDate) &&
            !isCompletedYesterday(r.lastCompletedDate);

        obj.currentStreak = streakBroken ? 0 : r.streak;
        return obj;
    });
};

// ─── GET all routines ────────────────────────────────────
export const getRoutines = async (req, res) => {
    try {
        const routines = await Routine.find({ userId: req.userId })
            .sort({ createdAt: 1 });

        res.json({ routines: attachTodayStatus(routines) });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── CREATE routine ──────────────────────────────────────
export const createRoutine = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title?.trim())
            return res.status(400).json({ message: 'Title is required' });

        const routine = await Routine.create({
            userId: req.userId,
            title: title.trim()
        });

        const obj = routine.toObject();
        obj.completedToday = false;
        obj.currentStreak = 0;

        res.status(201).json({ routine: obj });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── COMPLETE routine ────────────────────────────────────
export const completeRoutine = async (req, res) => {
    try {
        const routine = await Routine.findOne({ _id: req.params.id, userId: req.userId });

        if (!routine)
            return res.status(404).json({ message: 'Routine not found' });

        if (isCompletedToday(routine.lastCompletedDate))
            return res.status(400).json({ message: 'Already completed today' });

        const wasYesterday = isCompletedYesterday(routine.lastCompletedDate);
        const newStreak = wasYesterday ? routine.streak + 1 : 1;
        const newLongest = Math.max(newStreak, routine.longestStreak);

        routine.streak = newStreak;
        routine.longestStreak = newLongest;
        routine.lastCompletedDate = new Date();
        await routine.save();

        let pointsEarned = ROUTINE_POINTS;
        let streakBonus = 0;

        if (newStreak > 0 && newStreak % STREAK_BONUS_AT === 0) {
            streakBonus = STREAK_BONUS_POINTS;
            pointsEarned += streakBonus;
        }

        // ← removed lastActivityDate from here
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $inc: { score: pointsEarned } },
            { returnDocument: 'after' }  // ← was { new: true }
        );

        // ← this now handles lastActivityDate correctly
        await updateUserStreak(req.userId);

        const today = getToday();
        await DailyLog.findOneAndUpdate(
            { userId: req.userId, date: today },
            { $inc: { routinesCompleted: 1, scoreEarned: pointsEarned } },
            { upsert: true, new: true }
        );

        const obj = routine.toObject();
        obj.completedToday = true;
        obj.currentStreak = newStreak;

        // get updated user for correct streak in response
        const updatedUser = await User.findById(req.userId).select('score currentStreak');

        res.json({
            routine: obj,
            pointsEarned,
            streakBonus,
            newStreak,
            newScore: updatedUser.score,
            globalStreak: updatedUser.currentStreak
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── Update user's global streak ─────────────────────────
const updateUserStreak = async (userId) => {
    const user = await User.findById(userId);
    const lastDate = user.lastActivityDate
        ? toDateString(new Date(user.lastActivityDate))
        : null;

    const today = getToday();
    const yesterday = getYesterday();

    // Already counted today — don't double increment
    if (lastDate === today) return;

    const newStreak = lastDate === yesterday
        ? user.currentStreak + 1
        : 1;

    const newLongest = Math.max(newStreak, user.longestStreak);

    await User.findByIdAndUpdate(userId, {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: new Date()
    }, { returnDocument: 'after' });
};

// ─── DELETE routine ──────────────────────────────────────
export const deleteRoutine = async (req, res) => {
    try {
        const routine = await Routine.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!routine)
            return res.status(404).json({ message: 'Routine not found' });

        res.json({ message: 'Routine deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};