import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import InputBar from '../components/InputBar';
import SummaryPanel from '../components/SummaryPanel';
import { useSessions } from '../hooks/useSessions';
import { useChat } from '../hooks/useChat';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ChatPage = () => {
    const {
        sessions,
        activeSessionId,
        setActiveSessionId,
        createSession,
        deleteSession,
        updateSessionTitle,
    } = useSessions();

    const {
        messages,
        isLoading,
        streamingText,
        loadMessages,
        sendMessage,
        clearMessages,
    } = useChat();

    const [showSummary, setShowSummary] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText]);

    const handleSelectSession = (id) => {
        if (activeSessionId === id) return;
        setActiveSessionId(id);
        clearMessages();
        loadMessages(id);
        setShowSummary(false);
        setSummary('');
    };

    const handleNewChat = async () => {
        try {
            await createSession();
            clearMessages();
            setShowSummary(false);
            setSummary('');
        } catch (e) {
            toast.error('Failed to create new chat');
        }
    };

    const handleDeleteSession = async (id) => {
        try {
            await deleteSession(id);
            if (activeSessionId === id) {
                clearMessages();
            }
        } catch (e) {
            toast.error('Failed to delete chat');
        }
    };

    const handleSendMessage = async (input) => {
        let currentSessionId = activeSessionId;
        if (!currentSessionId) {
            try {
                const newSession = await createSession();
                currentSessionId = newSession._id;
            } catch (e) {
                toast.error('Failed to create session to start chatting');
                return;
            }
        }

        const unformattedMessages = messages.map(m => ({ role: m.role, content: m.content }));
        unformattedMessages.push({ role: 'user', content: input });

        // Optimistic push inside hook
        await sendMessage(currentSessionId, unformattedMessages, input);

        // After first message, update session title locally
        if (messages.length === 0) {
            updateSessionTitle(currentSessionId, input.substring(0, 50));
        }
    };

    const handleSummarize = async () => {
        setShowSummary(!showSummary);
        if (showSummary) return; // if already open and just toggling close

        setIsSummarizing(true);
        setSummaryError('');
        try {
            const res = await api.post('/summary', { sessionId: activeSessionId });
            setSummary(res.data.summary);
        } catch (err) {
            setSummaryError(err.response?.data?.message || 'Failed to generate summary');
        } finally {
            setIsSummarizing(false);
        }
    };

    const activeSession = sessions.find((s) => s._id === activeSessionId);

    return (
        <div className="flex h-screen w-full bg-[#0f0f13] overflow-hidden">
            <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onCreateSession={handleNewChat}
                onDeleteSession={handleDeleteSession}
            />

            <div className="flex-1 flex flex-col h-full min-w-0 relative">
                {/* Top Header */}
                <div
                    className="h-14 shrink-0 flex items-center justify-between px-6 z-10 backdrop-blur-md"
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <span className="text-[14px] font-medium text-white/80 truncate pr-4">
                        {activeSession?.title || 'Select a chat'}
                    </span>

                    {activeSessionId && messages.length >= 4 && (
                        <button
                            onClick={handleSummarize}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#7c3aed]/30 hover:bg-[#7c3aed]/10 text-[#a78bfa] text-[13px] font-medium transition-colors cursor-pointer"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Summarize
                        </button>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 relative scroll-smooth flex flex-col">
                    <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-end">
                        {!activeSessionId || messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                                <div
                                    className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(124,58,237,0.4)]"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h2>
                                <p className="text-white/40 mb-8 max-w-sm text-center">
                                    Start a conversation by typing below, or try one of these suggestions.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {['Explain quantum computing simply', 'Write a creative short story', 'Help me debug my code'].map((text, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(text)}
                                            className="cursor-pointer px-4 py-2 rounded-full border border-white/10 hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/10 text-white/70 text-sm transition-all shadow-sm"
                                            style={{ background: 'rgba(255,255,255,0.02)' }}
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="pb-4">
                                {messages.map((message) => (
                                    <MessageBubble key={message._id} message={message} />
                                ))}
                                {(isLoading || streamingText) && (
                                    <TypingIndicator streamingText={streamingText} />
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                <InputBar onSend={handleSendMessage} isLoading={isLoading} />
            </div>

            <AnimatePresence>
                {showSummary && (
                    <SummaryPanel
                        isOpen={showSummary}
                        onClose={() => setShowSummary(false)}
                        isSummarizing={isSummarizing}
                        summary={summary}
                        error={summaryError}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatPage;
