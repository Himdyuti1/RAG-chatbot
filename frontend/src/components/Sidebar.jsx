/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';

const Sidebar = ({ chats, activeChatId, onNavigate, onNewChat, toggleSidebar }) => {
    return (
        <div className="w-64 h-full bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <span className="text-lg font-bold">Chats</span>
                <button
                    onClick={toggleSidebar}
                    className="text-white hover:text-gray-400 focus:outline-none"
                >
                    <FiChevronLeft size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* New Chat Button */}
                <button
                    onClick={onNewChat}
                    className="w-full px-4 py-2 text-left bg-gray-800 rounded hover:bg-gray-700"
                >
                    + New Chat
                </button>

                {/* Chats List */}
                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => onNavigate(chat.id)}
                        className={`block w-full px-4 py-2 text-left ${
                            activeChatId === chat.id
                                ? "bg-gray-700"
                                : "hover:bg-gray-700"
                        } transition`}
                    >
                        {chat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;