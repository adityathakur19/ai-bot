// client/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ChatInterface from './components/Chat/ChatInterface';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { MessageCircle, PlusCircle } from 'lucide-react';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const WelcomeScreen = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`h-full flex flex-col items-center justify-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
      <div className={`rounded-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-6`}>
        <MessageCircle size={52} className={`${darkMode ? 'text-blue-400' : 'text-primary-500'}`} />
      </div>
      <h2 className={`text-2xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
        Health AI Assistant
      </h2>
      <p className="mb-6 text-center max-w-md">
        Your personal health companion. Get answers to medical questions, track symptoms, and receive personalized wellness advice.
      </p>
      <button className={`flex items-center px-5 py-3 rounded-lg transition-all duration-200 ${
        darkMode 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}>
        <PlusCircle size={20} className="mr-2" />
        <span>Start New Conversation</span>
      </button>
    </div>
  );
};

const ChatLayout = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`flex h-screen flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/:id" element={<ChatInterface />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat/*" element={
        <PrivateRoute>
          <ChatLayout />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;