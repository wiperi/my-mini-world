'use client';

import { useState, useRef, useEffect } from 'react';
import { IoMdChatbubbles } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭聊天框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理消息发送
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // 添加用户消息
    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    setInputText('');

    // 这里可以添加AI响应逻辑
    // 示例响应
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "这是AI的回复", isUser: false }]);
    }, 1000);
  };

  return (
    <div ref={chatBoxRef} className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col"
          >
            {/* 聊天框头部 */}
            <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
              <h3>AI 助手</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="输入消息..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  发送
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          >
            <IoMdChatbubbles size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
