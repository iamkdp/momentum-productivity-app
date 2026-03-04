import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    isImportant: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    penaltyApplied: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);