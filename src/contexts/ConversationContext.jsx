// client/src/contexts/ConversationContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getConversations } from '../services/chat';

export const ConversationContext = createContext();

export const useConversations = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasEmptyConversation, setHasEmptyConversation] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      const empty = data.some(conv => 
        !conv.messages || conv.messages.length === 0
      );
      setHasEmptyConversation(empty);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const updateConversation = (updatedConv) => {
    setConversations(prevConvs => 
      prevConvs.map(conv => 
        conv._id === updatedConv._id ? updatedConv : conv
      )
    );
    
    if (updatedConv.messages && updatedConv.messages.length > 0) {
      checkForEmptyConversations();
    }
  };

  const addConversation = (newConv) => {
    setConversations(prevConvs => [newConv, ...prevConvs]);
    setHasEmptyConversation(true);
  };

  const removeConversation = (convId) => {
    setConversations(prevConvs => 
      prevConvs.filter(conv => conv._id !== convId)
    );
    checkForEmptyConversations();
  };

  const checkForEmptyConversations = () => {
    const empty = conversations.some(conv => 
      !conv.messages || conv.messages.length === 0
    );
    setHasEmptyConversation(empty);
  };

  return (
    <ConversationContext.Provider value={{
      conversations,
      loading,
      error,
      hasEmptyConversation,
      fetchConversations,
      updateConversation,
      addConversation,
      removeConversation
    }}>
      {children}
    </ConversationContext.Provider>
  );
};