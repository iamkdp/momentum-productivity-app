import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    tasksCompleted: { type: Number, default: 0 },
    routinesCompleted: { type: Number, default: 0 },
    scoreEarned: { type: Number, default: 0 }
}, { timestamps: true });

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);