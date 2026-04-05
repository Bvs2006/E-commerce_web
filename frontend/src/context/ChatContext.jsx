import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const activeChatRef = useRef(null);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    // Initialize socket connection
    useEffect(() => {
        if (user && token) {
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
            const newSocket = io(socketUrl, {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
                newSocket.emit('join', user._id || user.id);
            });

            newSocket.on('newMessage', (data) => {
                const { chatId, message } = data;
                if (activeChatRef.current && activeChatRef.current._id === chatId) {
                    setMessages(prev => [...prev, message]);
                } else {
                    // Update chat list last message
                    setChats(prev => prev.map(chat =>
                        chat._id === chatId
                            ? { ...chat, lastMessage: message.text, lastMessageTime: message.timestamp }
                            : chat
                    ));
                    // Add notification
                    setNotifications(prev => [...prev, { chatId, message }]);
                }
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user, token]);

    const selectChat = (chat) => {
        setActiveChat(chat);
        setMessages(chat.messages || []);
        if (socket) {
            socket.emit('joinChat', chat._id);
        }
    };

    const sendMessage = useCallback((chatId, text) => {
        if (socket && user) {
            socket.emit('sendMessage', {
                chatId,
                text,
                senderId: user._id || user.id
            });
        }
    }, [socket, user]);

    return (
        <ChatContext.Provider value={{
            socket,
            chats,
            setChats,
            activeChat,
            setActiveChat,
            messages,
            setMessages,
            selectChat,
            sendMessage,
            notifications,
            setNotifications
        }}>
            {children}
        </ChatContext.Provider>
    );
};
