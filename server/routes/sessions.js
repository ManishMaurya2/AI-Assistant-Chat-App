import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
    getAllSessions,
    createSession,
    deleteSession,
    getMessages,
} from '../controllers/sessionsController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAllSessions);
router.post('/', createSession);
router.delete('/:id', deleteSession);
router.get('/:id/messages', getMessages);

export default router;
