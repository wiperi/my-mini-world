'use client';

import React from 'react';
import { IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAppStore } from '../store/appStore';
import { chatBot } from '../util/chatBot';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  isComplete?: boolean;
}

const SideChatbox: React.FC = () => {
  const { 
    isExpanded, 
    messages, 
    inputMessage,
    setIsExpanded,
    addMessage,
    updateLastMessage,
    setMessageComplete,
    setInputMessage,
    sendMessage
  } = useAppStore();

  const toggleChatbox = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setInputMessage('');
      await sendMessage(inputMessage);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-screen bg-[#252931] shadow-lg transition-all duration-300 flex flex-col ${
      isExpanded ? 'w-96' : 'w-12'
    }`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center bg-[#87ceeb] ${isExpanded ? 'justify-between' : 'justify-center'} p-4`}>
        {isExpanded && (
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
        )}
        <IconButton
          onClick={toggleChatbox}
          className={`${isExpanded ? 'text-white hover:bg-blue-700' : 'text-blue-600 hover:bg-gray-100'}`}
          size="small"
        >
          {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>

      {/* Chat container */}
      {isExpanded && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages container - make it scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-slate-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >

                    {message.content}
                    {!message.isUser && !message.isComplete && (
                      <span className="inline-block ml-2 animate-pulse">▋</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input form - keep it fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-slate-800">
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                  placeholder="Input your message..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#87ceeb] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideChatbox;
