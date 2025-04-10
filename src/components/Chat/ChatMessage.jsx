// client/src/components/Chat/ChatMessage.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        flex items-start space-x-2 max-w-3xl
        ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}
      `}>
        <div className={`
          flex items-center justify-center 
          rounded-full h-8 w-8 mt-1
          ${isUser ? 'bg-primary-100' : 'bg-green-100'}
        `}>
          {isUser ? (
            <User size={16} className="text-primary-600" />
          ) : (
            <Bot size={16} className="text-green-600" />
          )}
        </div>
        
        <div className={`
          rounded-lg px-4 py-2 shadow
          ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}
        `}>
          <div className="prose">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          <div className={`
            text-xs mt-1 
            ${isUser ? 'text-blue-700' : 'text-gray-500'}
          `}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;