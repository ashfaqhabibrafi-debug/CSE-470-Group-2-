import React, { useState, useEffect } from 'react';
import { getMessages, markMessageAsRead } from '../../services/messageApi';
import './MessageList.css';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getMessages();
      let allMessages = response.data || [];
      
      // Filter messages
      if (filter === 'unread') {
        allMessages = allMessages.filter(msg => !msg.isRead);
      } else if (filter === 'read') {
        allMessages = allMessages.filter(msg => msg.isRead);
      }
      
      // Sort by date (newest first)
      allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (!message.isRead) {
      try {
        await markMessageAsRead(message._id);
        // Update message in list
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === message._id ? { ...msg, isRead: true } : msg
          )
        );
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} unread</span>
        )}
      </div>

      <div className="messages-filter">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <p>No messages found.</p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="btn-primary">
              View All Messages
            </button>
          )}
        </div>
      ) : (
        <div className="messages-content">
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message-item ${!message.isRead ? 'unread' : ''} ${selectedMessage?._id === message._id ? 'selected' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="message-header">
                  <div className="message-sender">
                    {message.sender?.profilePicture ? (
                      <img
                        src={message.sender.profilePicture}
                        alt={message.sender.name}
                        className="sender-avatar"
                      />
                    ) : (
                      <div className="sender-avatar-placeholder">
                        {message.sender?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="sender-info">
                      <h3>{message.sender?.name || 'System'}</h3>
                      <span className="sender-email">{message.sender?.email || 'system@disastermanagement.com'}</span>
                    </div>
                  </div>
                  <div className="message-meta">
                    <span className="message-date">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                    {!message.isRead && <span className="unread-dot"></span>}
                  </div>
                </div>
                <p className="message-preview">
                  {message.content.length > 100
                    ? `${message.content.substring(0, 100)}...`
                    : message.content}
                </p>
              </div>
            ))}
          </div>

          {selectedMessage && (
            <div className="message-detail">
              <button
                className="close-detail"
                onClick={() => setSelectedMessage(null)}
              >
                ×
              </button>
              <div className="detail-header">
                <div className="detail-sender">
                  {selectedMessage.sender?.profilePicture ? (
                    <img
                      src={selectedMessage.sender.profilePicture}
                      alt={selectedMessage.sender.name}
                      className="detail-avatar"
                    />
                  ) : (
                    <div className="detail-avatar-placeholder">
                      {selectedMessage.sender?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h2>{selectedMessage.sender?.name || 'System'}</h2>
                    <p className="detail-email">{selectedMessage.sender?.email || 'system@disastermanagement.com'}</p>
                  </div>
                </div>
                <span className="detail-date">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="detail-content">
                <p>{selectedMessage.content}</p>
              </div>
              {selectedMessage.helpRequest && (
                <div className="detail-footer">
                  <p>
                    Related to help request: <strong>{selectedMessage.helpRequest?.title || 'N/A'}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageList;

