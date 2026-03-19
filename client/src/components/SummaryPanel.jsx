import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SummaryPanel = ({ isOpen, onClose, isSummarizing, summary, error }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[300px] h-full flex flex-col shrink-0 z-10 box-border right-0 absolute md:relative shadow-2xl md:shadow-none"
            style={{
                background: '#0a0a0f',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                    <h3 className="text-[15px] font-medium"
                        style={{
                            background: 'linear-gradient(135deg, #a78bfa, #c4b5fd)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Summary
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 cursor-pointer text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-[14px]">
                {isSummarizing ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/50">
                        <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed]" />
                        <p className="text-[13px]">Generating summary...</p>
                    </div>
                ) : error ? (
                    <p className="text-red-400/90 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>
                ) : summary ? (
                    <div className="text-white/80">
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                ul: ({ node, ...props }) => <ul className="space-y-3" {...props} />,
                                li: ({ node, ...props }) => (
                                    <li className="flex gap-2.5 items-start">
                                        <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[#7c3aed]" />
                                        <span className="leading-[1.8]" {...props} />
                                    </li>
                                ),
                                strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />
                            }}
                        >
                            {summary}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center justify-center h-full text-white/40 gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white/20" />
                        </div>
                        <p className="text-[13px]">Click summarize to get key insights from your conversation.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SummaryPanel;
