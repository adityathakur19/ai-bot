import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversation, sendMessage, createConversation } from '../../services/chat';
import ChatMessage from './ChatMessage';
import VoiceInput from './VoiceInput';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInterface = () => {
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await getConversation(id);
        setConversation(data);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation');
        // Redirect to conversations list if conversation not found
        if (err.response?.status === 404) {
          navigate('/');
        }
      }
    };

    if (id) {
      fetchConversation();
    } else {
      // If no ID provided, create a new empty conversation
      const createNewConversation = async () => {
        try {
          const newConversation = await createConversation();
          navigate(`/chat/${newConversation._id}`);
        } catch (err) {
          console.error('Error creating conversation:', err);
          setError('Failed to create new conversation');
        }
      };
      createNewConversation();
    }
  }, [id, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      setLoading(true);
      const updatedConversation = await sendMessage(id, message);
      setConversation(updatedConversation);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (transcription) => {
    setMessage(transcription);
  };

  const toggleVoiceInput = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation && !error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Start a conversation about your health concerns.</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        {loading && (
          <div className="text-sm text-gray-500 mb-2">AI is typing...</div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button 
            type="button" 
            onClick={toggleVoiceInput} 
            className="p-2 text-gray-500 hover:text-primary-500 focus:outline-none"
          >
            {isVoiceEnabled ? (
              <MicOff size={20} className="text-red-500" />
            ) : (
              <Mic size={20} />
            )}
          </button>
          
          {isVoiceEnabled && (
            <VoiceInput onTranscription={handleVoiceInput} isEnabled={isVoiceEnabled} />
          )}
          
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about health concerns... (Shift+Enter for new line)"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none overflow-auto min-h-[40px] max-h-32"
            disabled={loading}
            rows={1}
            style={{ height: 'auto' }}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;