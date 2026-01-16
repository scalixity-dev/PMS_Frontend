import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { aiChatService } from '@/services/aiChat.service';
import type { ChatMessage } from '@/services/aiChat.service';
import AIChatInput from './components/AIChatInput';
import AIMessageBubble from './components/AIMessageBubble';
import { Sparkles, AlertCircle } from 'lucide-react';

interface DashboardContext {
  sidebarCollapsed: boolean;
}

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>('');

  const context = useOutletContext<DashboardContext>();
  const sidebarCollapsed = context?.sidebarCollapsed ?? false;
  const sidebarOpen = !sidebarCollapsed;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);
    setIsStreaming(true);
    streamingMessageRef.current = '';

    const assistantMessageId = `msg_${Date.now()}_assistant`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    await aiChatService.sendMessage(
      text.trim(),
      threadId,
      (chunk: string) => {
        streamingMessageRef.current += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamingMessageRef.current }
              : msg
          )
        );
      },
      (newThreadId: string) => {
        setThreadId(newThreadId);
        setIsStreaming(false);
        streamingMessageRef.current = '';
      },
      (err: Error) => {
        setError(err.message);
        setIsStreaming(false);
        setMessages(prev =>
          prev.filter(msg => msg.id !== assistantMessageId)
        );
        streamingMessageRef.current = '';
      }
    );
  }, [threadId, isStreaming]);

  return (
    <div
      className={`mx-auto h-[calc(100vh-theme(spacing.20))] bg-white flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarOpen ? 'max-w-7xl' : 'max-w-full'
      }`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#3D7475] to-[#819A78]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
              <p className="text-xs text-white/80">Ask me anything about your property management</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto px-6 py-6 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3D7475] to-[#819A78] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to AI Assistant</h3>
                <p className="text-sm text-gray-600 mb-6">
                  I'm here to help answer your questions about property management, leases, tenants, and more.
                </p>
                <div className="space-y-2 text-left">
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                    💡 Try asking: "What are the key features of lease management?"
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                    💡 Try asking: "How do I add a new tenant?"
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <AIMessageBubble key={message.id} message={message} />
              ))}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3D7475] to-[#819A78] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#3D7475] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#3D7475] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#3D7475] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {error && (
            <div className="mt-4 mx-auto max-w-2xl">
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>AI-powered responses may contain errors. Please verify important information.</span>
          </div>
        </div>

        <AIChatInput onSendMessage={handleSendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
};

export default AIChatPage;
