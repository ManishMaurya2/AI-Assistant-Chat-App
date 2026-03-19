import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const timeStr = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    if (isUser) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-end mb-6"
            >
                <div className="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
                    <div
                        className="px-4 py-3 text-[14px] text-white"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            borderRadius: '18px 18px 4px 18px',
                        }}
                    >
                        {message.content}
                    </div>
                    <span className="text-[10px] text-white/50 mt-1.5 mr-1">{timeStr}</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start gap-4 mb-6"
        >
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-[11px] font-semibold text-[#a78bfa] border border-white/10 mt-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#7c3aed]/20" />
                <span className="relative z-10">AI</span>
            </div>
            <div className="flex flex-col items-start max-w-[85%] md:max-w-[75%] overflow-hidden">
                <div
                    className="px-4 py-3 text-[14px] text-[rgba(255,255,255,0.87)] markdown-body w-full overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '18px 18px 18px 4px',
                        lineHeight: '1.7',
                    }}
                >
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                            a: ({ node, ...props }) => <a className="text-[#a78bfa] hover:underline" {...props} />,
                            code: ({ node, inline, ...props }) =>
                                inline ?
                                    <code className="bg-black/30 px-1.5 py-0.5 rounded text-[13px] text-[#c4b5fd]" {...props} /> :
                                    <div className="bg-[#0a0a0f] rounded-lg p-3 overflow-x-auto my-3 border border-white/10"><code className="text-[13px] text-white/80 whitespace-pre" {...props} /></div>,
                            pre: ({ node, ...props }) => <pre className="m-0" {...props} />
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
                <span className="text-[10px] text-white/40 mt-1.5 ml-1">{timeStr}</span>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
