import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, AlertCircle } from 'lucide-react';
import { aiChatService } from '@/services/aiChat.service';
import type { ChatMessage } from '@/services/aiChat.service';
import { authService } from '@/services/auth.service';
import AIChatInput from '@/pages/Dashboard/features/AIChat/components/AIChatInput';
import AIMessageBubble from '@/pages/Dashboard/features/AIChat/components/AIMessageBubble';

const AIChatButton: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<string>('');
  const isCheckingAuthRef = useRef<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      isCheckingAuthRef.current = true;
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(true);
        setUserEmail(user.email);
      } catch {
        setIsAuthenticated(false);
        setUserEmail(undefined);
      } finally {
        isCheckingAuthRef.current = false;
      }
    };
    checkAuth();
  }, [location.pathname]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isStreaming, isOpen, scrollToBottom]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    if (isCheckingAuthRef.current) {
      await new Promise<void>((resolve) => {
        const maxWait = 3000;
        const startTime = Date.now();
        const checkReady = () => {
          if (!isCheckingAuthRef.current || Date.now() - startTime > maxWait) {
            resolve();
          } else {
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
      });
    }

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

    const useN8n = true;
    const currentThreadId = threadId || aiChatService.generateThreadId();
    
    if (!threadId) {
      setThreadId(currentThreadId);
    }
    
    await aiChatService.sendMessage(
      text.trim(),
      currentThreadId,
      (chunk: string) => {
        streamingMessageRef.current += chunk;
        const contentToShow = streamingMessageRef.current;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: contentToShow }
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
      },
      useN8n,
      userEmail
    );
  }, [threadId, isStreaming, isAuthenticated, userEmail]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#3D7475] to-[#819A78] text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        aria-label="Open AI Chat"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md h-full flex flex-col bg-white shadow-2xl transform translate-x-0 transition-transform duration-300 ease-out">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#3D7475] to-[#819A78] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                  <p className="text-xs text-white/80">Ask me anything about property management</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Minimize chat"
                >
                  <span className="text-white text-lg leading-none">−</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col overflow-y-auto px-6 py-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3D7475] to-[#819A78] flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">AI Assistant</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        I am a helpful assistant. If you have any questions related to PMS application feel free to ask.
                      </p>
                      <div className="space-y-2 text-left">
                        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                          💡 Try asking: "What are the key features of lease management?"
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                          💡 Try asking: "How do I add a new tenant?"
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                          💡 Try asking: "What is SmartTenantAI?"
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {messages.map((message, index) => {
                      const isLastAssistant =
                        message.role === 'assistant' && index === messages.length - 1;
                      return (
                        <AIMessageBubble
                          key={message.id}
                          message={message}
                          isStreaming={isStreaming && isLastAssistant}
                        />
                      );
                    })}
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
        </>
      )}
    </>
  );
};

export default AIChatButton;
