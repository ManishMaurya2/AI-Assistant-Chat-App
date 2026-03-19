import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../utils/api';
import { getToken } from '../utils/auth';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');

    const loadMessages = async (sessionId) => {
        try {
            const res = await api.get(`/sessions/${sessionId}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const sendMessage = async (sessionId, messagesHistory, userInput) => {
        const userMessage = {
            _id: uuidv4(),
            role: 'user',
            content: userInput,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setStreamingText('');

        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    sessionId,
                    messages: messagesHistory,
                }),
            });

            if (!response.ok) {
                throw new Error('Chat API failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;
            let assistantReply = '';

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.replace('data: ', '').trim();
                            if (dataStr === '[DONE]') {
                                done = true;
                                break;
                            }
                            if (dataStr) {
                                try {
                                    const parsed = JSON.parse(dataStr);
                                    if (parsed.text) {
                                        assistantReply += parsed.text;
                                        setStreamingText(assistantReply);
                                    } else if (parsed.error) {
                                        console.error('Stream error:', parsed.error);
                                    }
                                } catch (e) {
                                    // Some chunks may be split across frames, so handle graceful parsing fails
                                    console.error('Failed to parse SSE line:', dataStr);
                                }
                            }
                        }
                    }
                }
            }

            const assistantMessage = {
                _id: uuidv4(),
                role: 'assistant',
                content: assistantReply,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setStreamingText('');
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        streamingText,
        loadMessages,
        sendMessage,
        clearMessages,
    };
};
