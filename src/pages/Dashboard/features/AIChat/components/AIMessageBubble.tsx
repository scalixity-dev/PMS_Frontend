import { memo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { ChatMessage } from '@/services/aiChat.service';
import aiAvatar from '@/assets/images/ai-avatar.svg';
import 'highlight.js/styles/github-dark.css';
import '@/styles/markdown.css';

interface AIMessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  
  const timeString = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    if (message.content) {
      console.log('[AIMessageBubble] Rendering message:', message.id, 'Content length:', message.content.length);
    }
  }, [message.content, message.id]);

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      {isUser ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium">{timeString}</span>
            <span className="text-[11px] font-semibold text-gray-700">You</span>
          </div>
          <div className="bg-[#3D7475] text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm leading-relaxed max-w-[75%] shadow-sm hover:shadow-md transition-all duration-300 cursor-default whitespace-pre-wrap animate-chat-bubble-in">
            {message.content}
          </div>
        </>
      ) : (
        <div className="flex items-start gap-3 w-full max-w-[85%]">
          <img src={aiAvatar} alt="AI" className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-700">AI Assistant</span>
              <span className="text-[10px] text-gray-400 font-medium">{timeString}</span>
            </div>
            <div
              className={`bg-[#EDF2F1] rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 leading-relaxed shadow-sm cursor-default transition-all duration-200 ${
                isStreaming ? 'animate-streaming-glow' : 'hover:shadow-md'
              }`}
            >
              {message.content ? (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        
                        if (isInline) {
                          return (
                            <code className="inline-code" {...props}>
                              {children}
                            </code>
                          );
                        }
                        
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children, ...props }: any) => (
                        <pre {...props}>
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="inline-block w-2 h-4 bg-[#3D7475] animate-cursor-blink ml-1 align-middle rounded-sm" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AIMessageBubble);
