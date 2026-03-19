import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            setIsLoadingSessions(true);
            try {
                const res = await api.get('/sessions');
                setSessions(res.data);
            } catch (err) {
                console.error('Failed to load sessions:', err);
            } finally {
                setIsLoadingSessions(false);
            }
        };
        fetchSessions();
    }, []);

    const createSession = async () => {
        try {
            const res = await api.post('/sessions');
            const newSession = res.data;
            setSessions((prev) => [newSession, ...prev]);
            setActiveSessionId(newSession._id);
            return newSession;
        } catch (err) {
            console.error('Failed to create session:', err);
            throw err;
        }
    };

    const deleteSession = async (id) => {
        try {
            await api.delete(`/sessions/${id}`);
            setSessions((prev) => prev.filter((s) => s._id !== id));
            if (activeSessionId === id) {
                setActiveSessionId(null);
            }
        } catch (err) {
            console.error('Failed to delete session:', err);
            throw err;
        }
    };

    const updateSessionTitle = (id, title) => {
        setSessions((prev) =>
            prev.map((s) => (s._id === id ? { ...s, title } : s))
        );
    };

    return {
        sessions,
        activeSessionId,
        setActiveSessionId,
        isLoadingSessions,
        createSession,
        deleteSession,
        updateSessionTitle,
    };
};
