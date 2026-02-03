import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (text: string, files?: File[]) => void;
    disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (message.trim() || attachedFiles.length > 0) {
            onSendMessage(message.trim(), attachedFiles);
            setMessage('');
            setAttachedFiles([]);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachedFiles((prev) => [...prev, ...files]);
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="bg-white border-t border-gray-200 px-4 py-2.5">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                        >
                            <ImageIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700 max-w-[150px] truncate">{file.name}</span>
                            <span className="text-gray-500 text-xs">({formatFileSize(file.size)})</span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="flex items-end gap-3">
                {/* Attachment Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title="Attach file"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Text Input */}
                <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-[#3A6D6C] focus-within:ring-2 focus-within:ring-[#3A6D6C]/20 transition-all">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyPress={handleKeyPress}
                        disabled={disabled}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-base md:text-sm disabled:opacity-50 disabled:cursor-not-allowed max-h-[120px]"
                    />
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
                    className="p-3 bg-[#3A6D6C] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-[#3A6D6C]/20"
                    title="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 mt-2 px-1">
                Press Enter to send, Shift + Enter for new line
            </p>
        </div>
    );
};

export default ChatInput;
