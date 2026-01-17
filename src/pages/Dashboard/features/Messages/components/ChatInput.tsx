import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { Smile, Paperclip, Send, Mic, Trash2 } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (text: string, file: File | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [inputText, setInputText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Focus input when moving between chats or on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Handle click outside emoji picker and Escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowEmojiPicker(false);
                textareaRef.current?.focus();
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [showEmojiPicker]);

    const handleSendMessage = useCallback(() => {
        if (!inputText.trim() && !pendingFile) return;
        onSendMessage(inputText, pendingFile);
        setInputText('');
        setPendingFile(null);
        setShowEmojiPicker(false);
        // Maintain focus after sending
        setTimeout(() => textareaRef.current?.focus(), 0);
    }, [inputText, pendingFile, onSendMessage]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                alert('File size exceeds 10MB limit.');
                return;
            }
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                alert('Invalid file type. Only images, PDFs, and Word documents are allowed.');
                return;
            }
            setPendingFile(file);
        }
        // Reset input value so same file can be selected again if removed
        e.target.value = '';
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputText(prev => prev + emojiData.emoji);
        textareaRef.current?.focus();
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [inputText]);

    return (
        <div className="px-6 pb-2 pt-2 relative print:hidden">
            {pendingFile && (
                <div className="absolute bottom-24 left-8 bg-[#EDF2F1] border border-[#A7D8C9] rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <Paperclip className="w-4 h-4 text-[#3D7068]" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 truncate max-w-[150px]">{pendingFile.name}</span>
                        <span className="text-[10px] text-gray-500">Ready to send</span>
                    </div>
                    <button
                        onClick={() => setPendingFile(null)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-24 right-8 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
                >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        autoFocusSearch={false}
                        theme={Theme.LIGHT}
                        width={320}
                        height={400}
                        lazyLoadEmojis={true}
                        searchPlaceHolder="Search emoji..."
                    />
                </div>
            )}

            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus-within:border-gray-300 transition-all duration-300">
                <button className="text-gray-400 hover:text-[#3D7068] hover:scale-110 active:scale-95 transition-all duration-200">
                    <Mic className="w-4 h-4" />
                </button>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write messages..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs text-gray-800 placeholder-gray-400 py-2 resize-none max-h-[120px] custom-scrollbar"
                />

                <div className="flex items-center gap-2 md:gap-3 text-gray-400">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="hover:text-[#3D7068] hover:scale-110 active:scale-95 transition-all duration-200"
                        title="Attach File"
                    >
                        <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`transition-all duration-200 hover:scale-110 active:scale-95 ${showEmojiPicker ? 'text-[#3D7068]' : 'hover:text-[#3D7068]'}`}
                        title="Add Emoji"
                    >
                        <Smile className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() && !pendingFile}
                        className="bg-[#3D7068] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#2F5952] hover:scale-105 active:scale-90 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-[14px] h-[14px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ChatInput);
