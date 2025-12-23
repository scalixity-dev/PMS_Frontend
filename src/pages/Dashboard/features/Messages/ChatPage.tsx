import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { type Chat, type Message, CURRENT_USER_ID } from './types';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const INITIAL_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Ayesha Noor',
    role: 'Tenant',
    status: 'Active Now',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Ayesha',
    lastMessage: 'Thanks for offering to help...',
    time: '04:24 AM',
    isPinned: true,
    messages: [
      { id: 'm1', senderId: 'user1', senderName: 'Ayesha', text: 'Lorem cjsdcj dcsd ss j jsd ss fsbf s', time: '12:42 PM' },
      { id: 'm2', senderId: CURRENT_USER_ID, senderName: 'Me', text: "That's wonderful! Thank you so much. nasnscnsnkc ka c kscscjsbcbcbc bbc jjssccj k czscr.", time: '01:12 PM', reactions: ['1 👍'] },
      { id: 'm3', senderId: 'user1', senderName: 'Ayesha', text: 'Of course! I havendkcnscc cssdsdcsddcn bcjzcc jbj jcjcv jzx cv n', time: '01:42 PM' },
      { id: 'm4', senderId: CURRENT_USER_ID, senderName: 'Me', text: 'How about tomorrow around 2 PM? I can provide the shopping list and payment for groceries.', time: '01:57 PM' },
      { id: 'm5', senderId: 'user1', senderName: 'Ayesha', text: 'Perfect! That works for me. Should we arrange payment for the help as well?', time: '02:12 PM' },
      { id: 'm6', senderId: CURRENT_USER_ID, senderName: 'Me', text: 'Thanks for offering to help! When would be a good time?', time: '02:27 PM' },
    ]
  },
  {
    id: '2',
    name: 'Sam Curren',
    role: 'Owner',
    status: 'Seen 2m ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    lastMessage: 'Perfect! The payment...',
    time: '04:24 AM',
    messages: [
      { id: 'm7', senderId: 'user2', senderName: 'Sam', text: "Hey, did you check the latest transaction?", time: '09:00 AM' },
      { id: 'm8', senderId: CURRENT_USER_ID, senderName: 'Me', text: "Not yet, let me check and get back to you.", time: '09:05 AM' },
      { id: 'm9', senderId: 'user2', senderName: 'Sam', text: "Perfect! The payment is already initiated.", time: '09:10 AM' },
    ]
  },
  {
    id: '3',
    name: 'Sana Javed',
    role: 'Agent',
    status: 'Away',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sana',
    lastMessage: 'I can start tomorrow...',
    time: '04:24 AM',
    isPinned: false,
    messages: [
      { id: 'm10', senderId: 'user3', senderName: 'Sana', text: "I've reviewed the lease agreement.", time: '10:00 AM' },
      { id: 'm11', senderId: 'user3', senderName: 'Sana', text: "I can start tomorrow morning with the site visit.", time: '10:02 AM' },
      { id: 'm12', senderId: CURRENT_USER_ID, senderName: 'Me', text: "That sounds great, let's meet at 10 AM.", time: '10:15 AM' },
    ]
  }
];

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = useMemo(() =>
    chats.find(c => c.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );

  const filteredChats = useMemo(() =>
    chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [chats, searchQuery]
  );

  const sortedChats = useMemo(() =>
    [...filteredChats].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    }),
    [filteredChats]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages, scrollToBottom]);

  const handleSendMessage = useCallback((text: string, file: File | null) => {
    let finalMessageText = text;
    if (file) {
      finalMessageText = text
        ? `${text}\n📎 Attached file: ${file.name}`
        : `📎 Attached file: ${file.name}`;

      // Note: In a real production app, we would upload the file to a server here
      // console.log('Uploading file:', file.name, 'Size:', file.size);
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      senderName: 'Me',
      text: finalMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: finalMessageText,
          time: newMessage.time
        };
      }
      return chat;
    }));
  }, [activeChatId]);

  const handleDeleteChat = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete the chat with ${activeChat.name}?`)) {
      setChats(prevChats => {
        const remainingChats = prevChats.filter(chat => chat.id !== activeChatId);
        if (remainingChats.length > 0) {
          setActiveChatId(remainingChats[0].id);
        }
        return remainingChats;
      });
    }
  }, [activeChat.name, activeChatId]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const togglePinChat = useCallback((e: React.SyntheticEvent, chatId: string) => {
    e.stopPropagation();
    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  }, []);

  return (
    <div className="w-full h-full bg-white flex overflow-hidden print:h-auto print:block">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          aside, nav, header, .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
          body { background: white !important; }
        }
      `}} />

      <ChatSidebar
        chats={sortedChats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onTogglePin={togglePinChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            <ChatHeader
              activeChat={activeChat}
              onPrint={handlePrint}
              onDelete={handleDeleteChat}
            />

            <MessageList
              activeChat={activeChat}
              messagesEndRef={messagesEndRef}
            />

            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatPage;
