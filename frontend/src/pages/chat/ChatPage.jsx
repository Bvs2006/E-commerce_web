import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const ChatPage = () => {
  const { user } = useAuth();
  const {
    chats,
    setChats,
    activeChat,
    selectChat,
    messages,
    sendMessage,
    setMessages
  } = useChat();
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/chats');
      if (response.data.success) {
        setChats(response.data.chats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    sendMessage(activeChat._id, newMessage);
    setNewMessage('');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', height: 'calc(100vh - 120px)' }}>
      <div className="card" style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        height: '100%',
        padding: 0,
        overflow: 'hidden',
        background: 'white'
      }}>
        {/* Chat Sidebar */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Messages</h2>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <p style={{ padding: '1rem', textAlign: 'center' }}>Loading...</p>
            ) : chats.length > 0 ? (
              chats.map(chat => {
                const otherParticipant = chat.participants.find(p => p._id !== user?._id);
                const isActive = activeChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => selectChat(chat)}
                    style={{
                      padding: '1rem 1.5rem',
                      cursor: 'pointer',
                      background: isActive ? '#f1f5f9' : 'transparent',
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={e => !isActive && (e.currentTarget.style.background = '#f8fafc')}
                    onMouseOut={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>
                      {otherParticipant?.shopName || otherParticipant?.name}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chat.lastMessage || 'Start a conversation'}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No conversations yet.
              </p>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '1rem 1.5rem',
                background: 'white',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ fontWeight: 'bold' }}>
                  {activeChat.participants.find(p => p._id !== user?._id)?.shopName ||
                    activeChat.participants.find(p => p._id !== user?._id)?.name}
                </div>
                {activeChat.productId && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Product: {activeChat.productId.name}
                  </div>
                )}
              </div>

              {/* Messages Container */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, i) => {
                  const isMine = msg.sender === user?._id || msg.sender?._id === user?._id;
                  return (
                    <div
                      key={i}
                      style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        textAlign: isMine ? 'right' : 'left'
                      }}
                    >
                      <div style={{
                        background: isMine ? 'var(--primary)' : 'white',
                        color: isMine ? 'white' : 'var(--text-main)',
                        padding: '0.6rem 1rem',
                        borderRadius: isMine ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        fontSize: '0.95rem'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    background: '#f8fafc'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: '2rem', padding: '0 1.5rem' }}
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
              <h3>Select a conversation to start chatting</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
