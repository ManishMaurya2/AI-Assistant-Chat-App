import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', sendMessage);

export default router;
