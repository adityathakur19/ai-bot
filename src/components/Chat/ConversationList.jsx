// client/src/components/Chat/ConversationList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getConversations, createConversation, deleteConversation, getConversation } from '../../services/chat';
import { format } from 'date-fns';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import ConfirmationDialog from '../common/ConfirmationDialog';

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null
  });
  const navigate = useNavigate();
  const { id: currentConversationId } = useParams();

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
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

  // Create a new conversation (only if no empty conversations exist)
  const handleNewConversation = async () => {
    try {
      // First check if there are any empty conversations already
      const existingEmptyConversation = conversations.find(conv => conv.messageCount === 0);
      
      if (existingEmptyConversation) {
        setError('Please use your existing empty conversation first');
        setTimeout(() => setError(null), 3000);
        navigate(`/chat/${existingEmptyConversation._id}`);
        return;
      }
      
      // If current conversation is empty, don't create a new one
      if (currentConversationId) {
        try {
          const currentConversation = await getConversation(currentConversationId);
          if (currentConversation && currentConversation.messages && currentConversation.messages.length === 0) {
            setError('Please add messages to your current conversation first');
            setTimeout(() => setError(null), 3000);
            return;
          }
        } catch (err) {
          console.error('Error checking current conversation:', err);
          // If we can't check the current conversation, proceed with creating a new one
        }
      }
      
      // All checks passed, create a new conversation
      const newConversation = await createConversation();
      await fetchConversations(); // Refresh the conversations list
      navigate(`/chat/${newConversation._id}`);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create new conversation');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Open confirmation dialog
  const openDeleteConfirmation = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      id: id
    });
  };

  // Close confirmation dialog
  const closeDeleteConfirmation = () => {
    setConfirmDialog({
      isOpen: false,
      id: null
    });
  };

  // Delete a conversation
  const confirmDeleteConversation = async () => {
    try {
      await deleteConversation(confirmDialog.id);
      
      // Refresh the conversations list
      await fetchConversations();
      
      // If we deleted the current conversation, navigate to the first available one
      if (confirmDialog.id === currentConversationId) {
        if (conversations.length > 1) {
          // Find the first conversation that's not the one we just deleted
          const nextConversation = conversations.find(conv => conv._id !== confirmDialog.id);
          if (nextConversation) {
            navigate(`/chat/${nextConversation._id}`);
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      }
      
      closeDeleteConfirmation();
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
      setTimeout(() => setError(null), 3000);
      closeDeleteConfirmation();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>New Health Chat</span>
        </button>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          <ul className="space-y-1 px-2">
            {conversations.map(conversation => (
              <li key={conversation._id}>
                <Link 
                  to={`/chat/${conversation._id}`}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 ${
                    currentConversationId === conversation._id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center overflow-hidden">
                    <MessageSquare size={16} className="text-primary-500 mr-3 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-sm truncate">
                        {conversation.messageCount > 0 ? conversation.firstMessage : 'New Conversation'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {format(new Date(conversation.updatedAt), 'MMM d, yyyy')}
                        {conversation.messageCount === 0 && ' • Empty'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => openDeleteConfirmation(e, conversation._id)}
                    className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDeleteConversation}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </div>
  );
};

export default ConversationList;