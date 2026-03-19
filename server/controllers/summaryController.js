import Groq from 'groq-sdk';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

export const generateSummary = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: 'sessionId is required' });
        }

        const session = await Session.findOne({ _id: sessionId, userId: req.user.userId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const messages = await Message.find({ sessionId: session._id }).sort({ timestamp: 1 });

        if (messages.length < 4) {
            return res.status(400).json({ message: 'Need at least 4 messages to summarize' });
        }

        let conversationText = '';
        for (const msg of messages) {
            const roleName = msg.role === 'assistant' ? 'Assistant' : 'User';
            conversationText += `${roleName}: ${msg.content}\n`;
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'user',
                    content: `Summarize this conversation in 4-6 bullet points.\nBe concise. Capture key topics, decisions, and outcomes discussed:\n\n${conversationText}`,
                },
            ],
        });

        const summary = response.choices[0].message.content;
        res.status(200).json({ summary });

    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
