/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import instance from "../axios";

const ChatInterface = ({ chatId,chatMessages,setChatMessages }) => {
    const [message, setMessage] = useState(""); // User's input message
    // const [messages, setMessages] = useState([]); // List of messages in the chat
    const [loading, setLoading] = useState(false); // For handling loading state
    const [error, setError] = useState(null); // For error handling
    const messagesEndRef = useRef(null); // Ref for the end of the chat container

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom whenever messages update
    }, [chatMessages[chatId]]);

    const handleSend = async () => {
        if (!message.trim()) return;

        setChatMessages(prevChatMessages=>({
            ...prevChatMessages,
            [chatId]:[
                ...prevChatMessages[chatId],
                { text: message, sender: "user" }
            ]
        }))

        setLoading(true); // Start loading indicator
        setMessage(""); // Clear input field

        try {
            // Call backend API for processing the message
            const response = await instance.post("/chat", {
                question: message,
                collection_name: chatId,
            });
            setChatMessages(prevChatMessages=>({
                ...prevChatMessages,
                [chatId]:[
                    ...prevChatMessages[chatId],
                    {
                        text: response.data.response, // AI's response
                        sender: "assistant",
                    }
                ]
            }))
        } catch (error) {
            setError("An error occurred while processing your message.");
            console.error(error);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                    {/* Render chat messages */}
                    {chatMessages[chatId].map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`p-2 max-w-[90%] ${
                                    msg.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                                style={{
                                    borderRadius: "12px",
                                    wordWrap: "break-word",
                                }}
                            >
                                {msg.sender === "assistant" ? (
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}
                    {/* Scroll to bottom */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="flex items-center p-4 bg-gray-100">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-l-lg"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>

            {error && (
                <div className="text-red-500 text-center mt-2">{error}</div>
            )}
        </div>
    );
};

export default ChatInterface;