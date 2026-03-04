import express from 'express';
import { getTasks, createTask, completeTask, deleteTask, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/complete', completeTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;