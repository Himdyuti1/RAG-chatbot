import { useState } from 'react';
import Sidebar from './components/Sidebar';
import PDFUploader from './components/PDFUploader';
import ChatInterface from './components/ChatInterface';
import { FiChevronRight } from 'react-icons/fi';

const App = () => {
    // Function to generate a unique 7-character alphanumeric ID
    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2, 9);
    };

    // Initial state for chats with a unique ID
    const initial_id=generateUniqueId()
    const [chats, setChats] = useState([
        { id: initial_id, name: "Chat 1", isUploader: true },
    ]);
    const [activeChatId, setActiveChatId] = useState(chats[0].id); // Set the first chat's ID as active
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [chatMessages,setChatMessages]=useState({
        [initial_id]:[]
    })

    // Function to add a new chat
    const addNewChat = () => {
        const newChatId = generateUniqueId(); // Generate a unique ID
        setChats([
            ...chats,
            { id: newChatId, name: `Chat ${chats.length+1}`, isUploader: true },
        ]);
        setChatMessages(prevChatMessages=>({
            ...prevChatMessages,
            [newChatId]:[]
        }))
        setActiveChatId(newChatId); // Set the newly created chat as active
    };

    // Function to handle chat navigation
    const handleNavigate = (id) => {
        setActiveChatId(id);
    };

    return (
        <div className="flex h-screen relative">
            {/* Sidebar */}
            {isSidebarVisible && (
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    onNavigate={handleNavigate}
                    onNewChat={addNewChat}
                    toggleSidebar={() => setIsSidebarVisible(false)}
                />
            )}

            {/* Button to show the sidebar when hidden */}
            {!isSidebarVisible && (
                <button
                    onClick={() => setIsSidebarVisible(true)}
                    className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-10"
                >
                    <FiChevronRight size={24} />
                </button>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {chats.find((chat) => chat.id === activeChatId)?.isUploader ? (
                    <PDFUploader
                        chatId={activeChatId}
                        chats={chats}
                        setChats={setChats}
                    />
                ) : (
                    <ChatInterface 
                        chatId={activeChatId}
                        chatMessages={chatMessages}
                        setChatMessages={setChatMessages}
                    />
                )}
            </main>
        </div>
    );
};

export default App;