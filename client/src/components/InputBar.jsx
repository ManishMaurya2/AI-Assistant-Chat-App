import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';

const InputBar = ({ onSend, isLoading }) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
        }
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (value.trim() && !isLoading) {
            onSend(value.trim());
            setValue('');
        }
    };

    return (
        <div
            className="p-4 md:px-5 pb-6"
            style={{
                background: '#0f0f13',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <div className="max-w-4xl mx-auto">
                <div className="relative group flex items-end gap-2.5 p-3 rounded-2xl transition-colors duration-200 focus-within:border-[#7c3aed]/50"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message AI Assistant..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-[14px] resize-none overflow-y-auto leading-relaxed py-0.5 px-1 placeholder-white/25"
                        style={{
                            minHeight: '24px',
                            maxHeight: '120px',
                        }}
                    />
                    <motion.button
                        onClick={handleSend}
                        disabled={!value.trim() || isLoading}
                        whileHover={!(!value.trim() || isLoading) ? { scale: 1.05 } : {}}
                        whileTap={!(!value.trim() || isLoading) ? { scale: 0.95 } : {}}
                        className="w-9 h-9 cursor-pointer shrink-0 rounded-[10px] flex items-center justify-center transition-colors shadow-sm disabled:cursor-not-allowed"
                        style={
                            !value.trim() || isLoading
                                ? { background: 'rgba(255,255,255,0.08)' }
                                : { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }
                        }
                    >
                        <SendHorizontal className={`w-4 h-4 ${!value.trim() || isLoading ? 'text-white/30' : 'text-white'}`} />
                    </motion.button>
                </div>
                <p className="text-center text-[11px] text-white/30 mt-3">
                    AI Assistant can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
};

export default InputBar;
