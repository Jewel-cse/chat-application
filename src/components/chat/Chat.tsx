// components/Chat.tsx
import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); 
  const user = localStorage.getItem('username');
  const avatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'; 

  // Setup WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws/chat'); 
    setSocket(ws);

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data); 
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Handle sending a message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: user,
        timestamp: new Date().toLocaleTimeString(), // Timestamp for message
      };
      socket?.send(JSON.stringify(newMessage));
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex  flex-col h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
      {/* Chat Header */}
      <div className="bg-green-600 text-white p-4 text-center text-xl">
        Chat Application
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
            avatarUrl={avatarUrl} // Provide the user avatar URL
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-300 dark:bg-gray-800 dark:text-white">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg disabled:bg-gray-400"
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
