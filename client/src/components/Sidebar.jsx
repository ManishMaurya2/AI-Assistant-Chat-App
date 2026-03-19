import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { X } from 'lucide-react'; // needed for close button

const Sidebar = ({
    sessions,
    activeSessionId,
    onSelectSession,
    onCreateSession,
    onDeleteSession,
    isOpen,
    onClose,
}) => {
    const { user, logout } = useAuth();

    return (
        <div
            className={`w-[260px] h-full flex flex-col shrink-0 absolute md:relative z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{
                background: '#0a0a0f',
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <div className="p-5 flex justify-between items-center">
                <div>
                    <h1
                        className="text-xl font-bold tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #a78bfa, #3b82f6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        AI Assistant
                    </h1>
                    <p className="text-xs text-white/40 mt-1">Powered by Claude</p>
                </div>
                <button 
                    onClick={onClose} 
                    className="md:hidden p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(124,58,237,0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateSession}
                className="mx-3 mb-3 flex items-center justify-center gap-2 p-2.5 rounded-[10px] text-[#a78bfa] transition-colors cursor-pointer"
                style={{
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                }}
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Chat</span>
            </motion.button>

            <div className="flex-1 overflow-y-auto">
                <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-4 pt-3 pb-1.5">
                    Recent Chats
                </h2>
                <div className="px-2">
                    <AnimatePresence>
                        {sessions.map((session) => (
                            <motion.div
                                key={session._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                                className="group relative"
                            >
                                <div
                                    onClick={() => onSelectSession(session._id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-lg cursor-pointer transition-all ${activeSessionId === session._id
                                            ? 'text-white'
                                            : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                                        }`}
                                    style={
                                        activeSessionId === session._id
                                            ? {
                                                background: 'rgba(124,58,237,0.2)',
                                                borderLeft: '2px solid #7c3aed',
                                            }
                                            : {}
                                    }
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0" />
                                    <span className="text-sm truncate pr-6">{session.title}</span>
                                </div>
                                {/* Delete button appears on hover */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSession(session._id);
                                    }}
                                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/30 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all rounded-md"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div
                className="p-4 flex items-center gap-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-white/40 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    title="Sign out"
                    className="text-white/40 cursor-pointer hover:text-white transition-colors p-1"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
