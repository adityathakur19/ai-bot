// client/src/components/Layout/Sidebar.jsx 
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import ConversationList from '../Chat/ConversationList';
import { MessageSquare, X } from 'lucide-react';

const Sidebar = ({ toggleSidebar }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <aside className={`w-72 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-full transition-transform duration-300 transform md:translate-x-0`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <MessageSquare size={18} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className="font-semibold">Recent Conversations</h2>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </aside>
  );
};

export default Sidebar;
