
// client/src/services/chat.js
import api from './api';

export const getConversations = async () => {
  const res = await api.get('/chat');
  return res.data;
};

export const getConversation = async (id) => {
  const res = await api.get(`/chat/${id}`);
  return res.data;
};

export const createConversation = async (title = 'New Conversation') => {
  const res = await api.post('/chat', { title });
  return res.data;
};


export const sendMessage = async (conversationId, message) => {
  const res = await api.post(`/chat/${conversationId}/message`, { message });
  return res.data;
};

export const deleteConversation = async (id) => {
  await api.delete(`/chat/${id}`);
};