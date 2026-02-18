import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Check } from 'lucide-react';
import aiAvatar from '@/assets/images/ai-avatar.svg';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIPropertyChatProps {
  isOpen: boolean;
  onClose: () => void;
  onFormDataReceived: (formData: any) => void;
}

const PRIMARY = '#3A6D6C';
const GRADIENT_FROM = '#3D7475';
const GRADIENT_TO = '#819A78';
const ASSISTANT_BG = '#EDF2F1';

const AIPropertyChat: React.FC<AIPropertyChatProps> = ({ isOpen, onClose, onFormDataReceived }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you create your property listing. Describe your property in plain English and I'll fill out the form for you.\n\nFor example: \"I have a 3-bedroom house in New York with 2 bathrooms, built in 2015, 1500 sq ft, with a garage and central AC. The rent is $2500 per month.\"",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingFormData, setPendingFormData] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${API_BASE_URL}/ai/property-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage, conversationId }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }]);

      if (data.formData && data.isComplete) {
        setPendingFormData(data.formData);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Perfect! I've collected all the details. Click **Add to Form** below to fill out the form — you can review and edit before saving. 🎉",
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or fill out the form manually.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirmAdd = () => {
    if (pendingFormData) {
      onFormDataReceived(pendingFormData);
      setTimeout(() => {
        onClose();
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm here to help you create your property listing. Describe your property in plain English and I'll fill out the form for you.\n\nFor example: \"I have a 3-bedroom house in New York with 2 bathrooms, built in 2015, 1500 sq ft, with a garage and central AC. The rent is $2500 per month.\"",
          timestamp: new Date(),
        }]);
        setConversationId(null);
        setPendingFormData(null);
      }, 300);
    }
  };



  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', fontFamily: 'Urbanist, sans-serif' }}
    >
      <div
        className="w-full max-w-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden bg-white"
        style={{ borderRadius: '1.5rem', maxHeight: '88vh' }}
      >
        {/* ── Header ── */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: PRIMARY }}
        >
          <div className="flex items-center gap-3">
            <img
              src={aiAvatar}
              alt="AI Assistant"
              className="w-10 h-10 rounded-full flex-shrink-0"
              style={{ border: '2px solid rgba(255,255,255,0.3)' }}
            />
            <div>
              <h2 className="text-white font-semibold text-lg leading-tight">AI Property Assistant</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Describe your property naturally</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-all p-2 rounded-full"
            style={{ color: 'rgba(255,255,255,0.8)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 min-h-0 custom-scrollbar" style={{ backgroundColor: '#f9fafb' }}>
          {messages.map((message, index) => {
            const isUser = message.role === 'user';
            return (
              <div key={index} className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isUser && (
                    <img
                      src={aiAvatar}
                      alt="AI"
                      className="w-6 h-6 rounded-full flex-shrink-0"
                    />
                  )}
                  <span className="text-[11px] font-semibold text-gray-600">{isUser ? 'You' : 'AI Assistant'}</span>
                </div>

                {/* Bubble */}
                <div
                  className="max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap"
                  style={
                    isUser
                      ? {
                        backgroundColor: PRIMARY,
                        color: 'white',
                        borderRadius: '1.25rem',
                        borderTopRightRadius: '4px',
                      }
                      : {
                        backgroundColor: ASSISTANT_BG,
                        color: '#1f2937',
                        borderRadius: '1.25rem',
                        borderTopLeftRadius: '4px',
                      }
                  }
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex flex-col gap-1 items-start">
              <div className="flex items-center gap-2 px-1">
                <img src={aiAvatar} alt="AI" className="w-6 h-6 rounded-full flex-shrink-0" />
                <span className="text-[11px] font-semibold text-gray-600">AI Assistant</span>
              </div>
              <div
                className="px-4 py-3 flex items-center gap-1.5 shadow-sm"
                style={{ backgroundColor: ASSISTANT_BG, borderRadius: '1.25rem', borderTopLeftRadius: '4px' }}
              >
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY, animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY, animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY, animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Add to Form CTA */}
          {pendingFormData && !isLoading && (
            <div className="flex justify-start">
              <button
                onClick={handleConfirmAdd}
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white shadow-md transition-all"
                style={{ background: `linear-gradient(to right, ${GRADIENT_FROM}, ${GRADIENT_TO})` }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
              >
                <Check className="w-4 h-4" />
                Add to Form
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Disclaimer ── */}
        <div className="px-5 pt-2 pb-1 flex-shrink-0 bg-white">
          <p className="text-[10px] text-gray-400 text-center">
            AI responses may not be 100% accurate. Please review before saving.
          </p>
        </div>

        {/* ── Input ── */}
        <div className="px-5 pb-5 pt-2 flex-shrink-0 bg-white">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
            style={{
              border: '1.5px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
            onFocusCapture={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = PRIMARY;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(61,116,117,0.12)`;
            }}
            onBlurCapture={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your property... (Enter to send)"
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 resize-none custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed leading-normal"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO})`, boxShadow: '0 2px 8px rgba(61,116,117,0.35)' }}
              onMouseEnter={e => {
                if (!(!input.trim() || isLoading)) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 px-1">Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default AIPropertyChat;
