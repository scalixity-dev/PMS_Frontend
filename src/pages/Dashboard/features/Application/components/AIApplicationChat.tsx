import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  type: 'property' | 'unit';
  propertyId: string;
  unitId?: string;
  propertyType: string;
}

interface AIApplicationChatProps {
  isOpen: boolean;
  onClose: () => void;
  onFormDataReceived: (formData: any) => void;
}

const AIApplicationChat: React.FC<AIApplicationChatProps> = ({ isOpen, onClose, onFormDataReceived }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you create a rental application. You can describe the applicant and property in plain English, and I'll help fill out the form.\n\nGo ahead and tell me about the application!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingFormData, setPendingFormData] = useState<any | null>(null);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [showProperties, setShowProperties] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !conversationId && availableProperties.length === 0) {
      const fetchProperties = async () => {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
          const response = await fetch(`${API_BASE_URL}/ai/application-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              message: 'initialize',
              conversationId: null
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.conversationId) {
              setConversationId(data.conversationId);
            }
            if (data.availableProperties && data.availableProperties.length > 0) {
              setAvailableProperties(data.availableProperties);
              setShowProperties(true);
            }
          }
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      };
      fetchProperties();
    }
  }, [isOpen]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = messageToSend;
    const isInitialization = userMessage === 'initialize';
    
    if (!customMessage) {
      setInput('');
    }
    
    if (!isInitialization) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }
    setShowProperties(false);
    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE_URL}/ai/application-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
        if (data.availableProperties && data.availableProperties.length > 0) {
          setAvailableProperties(data.availableProperties);
          setShowProperties(true);
        }
      }

      if (userMessage !== 'initialize') {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message 
        }]);
      }

      if (data.formData && data.isComplete) {
        setPendingFormData(data.formData);
        setShowProperties(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Perfect! I've collected all the details you provided. Click 'Add to Form' below to fill out the form, then you can review and make any changes before saving. 🎉"
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or fill out the form manually."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          content: "Hi! I'm here to help you create a rental application. You can describe the applicant and property in plain English, and I'll help fill out the form.\n\nGo ahead and tell me about the application!"
        }]);
        setConversationId(null);
        setPendingFormData(null);
        setAvailableProperties([]);
        setShowProperties(false);
      }, 300);
    }
  };

  const handlePropertySelect = (property: Property) => {
    const propertyMessage = `I want to apply for ${property.name}`;
    setShowProperties(false);
    handleSend(propertyMessage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">AI Application Assistant</h2>
              <p className="text-teal-100 text-xs">Describe your application naturally</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
              {index === 0 && showProperties && availableProperties.length > 0 && (
                <div className="mt-3 mb-4">
                  <p className="text-xs text-gray-500 mb-2 px-2">Available Properties:</p>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {availableProperties.map((property) => (
                      <button
                        key={property.id}
                        onClick={() => handlePropertySelect(property)}
                        className="text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-teal-500 hover:bg-teal-50 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {property.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {property.address}
                            </p>
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded">
                              {property.type === 'unit' ? 'Unit' : 'Property'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <p className="text-sm text-gray-600">Thinking...</p>
              </div>
            </div>
          )}

          {pendingFormData && !isLoading && (
            <div className="flex justify-start">
              <div className="bg-teal-50 border-2 border-teal-500 rounded-2xl px-4 py-3 flex flex-col gap-3 max-w-[80%]">
                <p className="text-sm text-gray-800 font-medium">Ready to add to form!</p>
                <button
                  onClick={handleConfirmAdd}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Add to Form
                </button>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your application..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIApplicationChat;
