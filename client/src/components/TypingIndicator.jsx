import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const TypingIndicator = ({ streamingText }) => {
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
            <div className="flex flex-col items-start max-w-[72%]">
                <div
                    className="px-4 py-3 text-[14px] text-white/90 w-full"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '18px 18px 18px 4px',
                        lineHeight: '1.7',
                    }}
                >
                    {streamingText ? (
                        <div className="markdown-body">
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                                    code: ({ node, inline, ...props }) =>
                                        inline ?
                                            <code className="bg-black/30 px-1.5 py-0.5 rounded text-[13px] text-[#c4b5fd]" {...props} /> :
                                            <div className="bg-[#0a0a0f] rounded-lg p-3 overflow-x-auto my-3 border border-white/10"><code className="text-[13px] text-white/80 whitespace-pre" {...props} /></div>,
                                    pre: ({ node, ...props }) => <pre className="m-0" {...props} />
                                }}
                            >
                                {streamingText}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 h-[20px] px-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut"
                                    }}
                                    className="w-[7px] h-[7px] rounded-full"
                                    style={{ background: '#7c3aed' }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TypingIndicator;
