import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send } from 'lucide-react';

interface AIChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

const AIChatInput: React.FC<AIChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText);
    setInputText('');
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [inputText, disabled, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  return (
    <div className="px-6 pb-6 pt-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus-within:border-[#3D7475] transition-all duration-300">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 placeholder-gray-400 py-1 resize-none max-h-[120px] custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || disabled}
          className="bg-[#3D7475] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#2F5952] hover:scale-105 active:scale-90 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default memo(AIChatInput);
