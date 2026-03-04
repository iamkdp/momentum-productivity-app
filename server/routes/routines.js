import express from 'express';
import {
  getRoutines,
  createRoutine,
  completeRoutine,
  deleteRoutine
} from '../controllers/routineController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getRoutines);
router.post('/', createRoutine);
router.patch('/:id/complete', completeRoutine);
router.delete('/:id', deleteRoutine);

export default router;