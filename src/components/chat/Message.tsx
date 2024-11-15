// components/Message.tsx
import React from 'react';

interface MessageProps {
    text: string;
    sender: string;
    timestamp: string;
    avatarUrl: string;
}

const Message: React.FC<MessageProps> = ({ text, sender, timestamp, avatarUrl }) => {
    const me = localStorage.getItem('username'); 
    const isSelf = sender === me;
    return (
        <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} items-start space-x-3`}>
            {/* Avatar */}
            {!isSelf && (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
            )}
            <div >

                <div className={`max-w-xs px-2 py-1 rounded-lg text-white ${isSelf ? 'bg-blue-500' : 'bg-gray-400'}`}>
                    {/* Message Text */}
                    <p>{text}</p>
                </div>
                <div className="text-xs text-gray-300 mt-1 flex items-center justify-between">
                    <span>{timestamp}</span>
                    <span className='font-semibold px-2'>{sender}</span>
                </div>
            </div>
            {isSelf && (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
            )}
        </div>
    );
};

export default Message;
