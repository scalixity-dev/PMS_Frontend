import { memo } from 'react';
import type { ChatMessage } from '@/services/aiChat.service';
import aiAvatar from '@/assets/images/ai-avatar.svg';

interface AIMessageBubbleProps {
  message: ChatMessage;
}

const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const timeString = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-2`}>
      {isUser ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium">{timeString}</span>
            <span className="text-[11px] font-semibold text-gray-700">You</span>
          </div>
          <div className="bg-[#3D7475] text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm leading-relaxed max-w-[75%] shadow-sm hover:shadow-md transition-shadow cursor-default whitespace-pre-wrap">
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
            <div className="bg-[#EDF2F1] rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 leading-relaxed shadow-sm hover:shadow-md transition-shadow cursor-default whitespace-pre-wrap">
              {message.content}
              {!message.content && (
                <span className="inline-block w-2 h-4 bg-[#3D7475] animate-pulse ml-1" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AIMessageBubble);
