import Session from '../models/Session.js';
import Message from '../models/Message.js';

export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createSession = async (req, res) => {
    try {
        const session = new Session({ userId: req.user.userId });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        await Message.deleteMany({ sessionId: session._id });
        await Session.deleteOne({ _id: session._id });

        res.status(200).json({ message: 'Session deleted' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const messages = await Message.find({ sessionId: session._id }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
