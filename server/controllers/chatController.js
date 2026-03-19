import Groq from 'groq-sdk';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
    let headersSent = false;
    try {
        const { sessionId, messages } = req.body;

        if (!sessionId || !messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: 'sessionId and messages are required' });
        }

        const session = await Session.findOne({ _id: sessionId, userId: req.user.userId });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        headersSent = true;

        const stream = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: messages,
            stream: true,
        });

        let fullAssistantReply = '';

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
                fullAssistantReply += text;
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();

        // Save user message
        const lastUserMessage = messages[messages.length - 1];
        const userMsg = new Message({
            sessionId,
            userId: req.user.userId,
            role: 'user',
            content: lastUserMessage.content,
        });
        await userMsg.save();

        // Save assistant message
        const asstMsg = new Message({
            sessionId,
            userId: req.user.userId,
            role: 'assistant',
            content: fullAssistantReply,
        });
        await asstMsg.save();

        // Update session title and timestamp
        const firstUserMessage = messages[0];
        if (session.title === 'New Chat' && firstUserMessage) {
            session.title = firstUserMessage.content.substring(0, 50);
        }
        session.updatedAt = Date.now();
        await session.save();

    } catch (error) {
        console.error('Chat error:', error);
        if (!headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
            res.end();
        }
    }
};
