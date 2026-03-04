import Task from '../models/tasks.js';
import User from '../models/User.js';
import DailyLog from '../models/DailyLog.js';
import Routine from '../models/Routine.js';
// ─── Scoring constants ───────────────────────────────────
const POINTS = {
    normal: 10,
    important: 25,
    missedDeadline: -10
};

// ─── Apply deadline penalties (called on every GET) ──────
const applyDeadlinePenalties = async (userId) => {
    const now = new Date();

    const overdueTasks = await Task.find({
        userId,
        isCompleted: false,
        penaltyApplied: false,
        deadline: { $lt: now, $ne: null }
    });

    if (overdueTasks.length === 0) return;

    const penaltyTotal = overdueTasks.length * POINTS.missedDeadline;

    await Task.updateMany(
        { _id: { $in: overdueTasks.map(t => t._id) } },
        { penaltyApplied: true }
    );

    await User.findByIdAndUpdate(userId, {
        $inc: { score: penaltyTotal }
    });
};

// ─── GET all tasks ───────────────────────────────────────
export const getTasks = async (req, res) => {
    try {
        await applyDeadlinePenalties(req.userId);

        const tasks = await Task.find({ userId: req.userId })
            .sort({ isImportant: -1, createdAt: -1 });

        res.json({ tasks });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── CREATE task ─────────────────────────────────────────
export const createTask = async (req, res) => {
    try {
        const { title, isImportant, deadline } = req.body;

        if (!title?.trim())
            return res.status(400).json({ message: 'Title is required' });

        const task = await Task.create({
            userId: req.userId,
            title: title.trim(),
            isImportant: isImportant || false,
            deadline: deadline || null
        });

        res.status(201).json({ task });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── COMPLETE task ───────────────────────────────────────
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task)
      return res.status(404).json({ message: 'Task not found' });

    if (task.isCompleted)
      return res.status(400).json({ message: 'Task already completed' });

    task.isCompleted = true;
    task.completedAt = new Date();
    await task.save();

    const pointsEarned = task.isImportant ? POINTS.important : POINTS.normal;

    await User.findByIdAndUpdate(
      req.userId,
      { $inc: { score: pointsEarned } }
    );

    await updateUserStreak(req.userId);

    const today = new Date().toISOString().split('T')[0];
    await DailyLog.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $inc: { tasksCompleted: 1, scoreEarned: pointsEarned } },
      { upsert: true }
    );

    // ← fetch final user state AFTER streak update
    const updatedUser = await User.findById(req.userId).select('score currentStreak longestStreak');

    res.json({
      task,
      pointsEarned,
      newScore: updatedUser.score,
      currentStreak: updatedUser.currentStreak  // ← send streak in response
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── DELETE task ─────────────────────────────────────────
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!task)
            return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── EDIT task ───────────────────────────────────────────
export const updateTask = async (req, res) => {
    try {
        const { title, isImportant, deadline } = req.body;
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

        if (!task)
            return res.status(404).json({ message: 'Task not found' });

        if (task.isCompleted)
            return res.status(400).json({ message: 'Cannot edit a completed task' });

        if (title) task.title = title.trim();
        if (typeof isImportant === 'boolean') task.isImportant = isImportant;
        if (deadline !== undefined) task.deadline = deadline || null;

        await task.save();
        res.json({ task });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const toDateString = (date) => date.toISOString().split('T')[0];

const getToday = () => toDateString(new Date());

const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toDateString(d);
};

const updateUserStreak = async (userId) => {
    const user = await User.findById(userId);
    const lastDate = user.lastActivityDate
        ? toDateString(new Date(user.lastActivityDate))
        : null;

    const today = getToday();
    const yesterday = getYesterday();

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