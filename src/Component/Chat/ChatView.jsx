import React, { useState, useEffect, useRef } from 'react';
import InputEmoji from 'react-input-emoji';
import io from 'socket.io-client'
import './ChatView.css';

// const socket = io('http://127.0.0.1:4001'); // Connect to the WebSocket server

const ChatView = ({ contact, authId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('');
  const [chatId, setChatId] = useState(null)
  const messageContainerRef = useRef(null)

  // Initialize socket connection
  const socket = useRef();


  useEffect(() => {
    // Connect to the socket server
    socket.current = io('http://localhost:4001');  // Make sure to match this with your server address

    // Join the room (or channel) specific to this chat
    if (chatId) {
      socket.current.emit('joinChat', chatId);
    }

    // Receive new messages from the server
    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for status updates from the backend
    socket.current.on('statusUpdate', (data) => {
      const { messageId, status } = data;

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      );
    })

    // Clean up the socket connection when component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, [chatId]);



  useEffect(() => {
    //Check if acontact is selected
    if (contact && authId) {
      // Check if a chat exists between the user and the contact
      axios.get(`http://127.0.0.1:4001/Chat/allchat/${authId}`)
        .then(response => {
          // Find the chat with this contact (check participants)
          const existingChat = response.data.find(chat =>
            chat.participants.includes(contact._id)
          );

          if (existingChat) {
            // If chat exists, set chatId
            setChatId(existingChat._id);
            return axios.get(`http://127.0.0.1:4001/messages/chat/${existingChat._id}`);
          } else {
            // If chat does not exist, create a new chat
            return axios.post('http://127.0.0.1:4001/Chat/newchat', {
              senderId: authId,
              receiverId: contact._id,
            });
          }
        })
        .then(response => {
          // If a new chat was created, set the chatId
          if (response.data._id) {
            setChatId(response.data._id);
          }
          // setMessages(response.data);

          // Fetch messages for the chat
          return axios.get(`http://127.0.0.1:4001/Message/specific/${chatId}`);
        })
        .then(response => {
          setMessages(response.data);  // Set the messages after fetching them
        })
        .catch(error => {
          console.error('Error creating or fetching chat:', error);
        });

      // Set the online status
      setOnlineStatus(contact.online ? 'Online' : `Last seen at ${contact.lastSeen}`);
    }
  }, [contact, authId]);

  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);


  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      chatId,
      senderId: authId,
      content: newMessage,
    };

    // Send the message to the backend
    // axios.post('http://127.0.0.1:4001/Message/send', message)
    //   .then(response => {
    //     setMessages([...messages, response.data]);  // Add the new message to the messages list
    //     setNewMessage('');  // Clear the message input field
    //   })
    //   .catch(error => {
    //     console.error('Error sending message:', error);
    //   });
    // Emit the message to the server via socket
    socket.current.emit('sendMessage', messageData);

    // Optimistically update the UI
    setMessages([...messages, messageData]);
    setNewMessage('');

    // Send the message to backend for persistence
    axios.post('http://127.0.0.1:4001/Message/send', messageData)
      .catch(error => console.error('Error sending message:', error));
  };


  const renderStatus = (status) => {
    if (status === 'sent') {
      return (
        <span className="message-status">
          ✓ {/*  {timestamp} */}
        </span>
      );
    } else if (status === 'deliveres') {
      return (
        <span className="message-status">
          ✓✓ {/*  {timestamp} */}
        </span>
      );
    } else if (status === 'read') {
      return (
        <span className="message-status">✓✓ (seen)</span>
      )
    }
    return null;
  };


  return (
    <div className="chat-view">
      {contact ? (
        <>
          <div className="chat-header">
            <img src={contact.profilePicture} alt="Profile" className="profile-pic" />
            <div>
              <span className="contact-name">{contact.name}</span>
              <span className="online-status">{onlineStatus}</span>
            </div>
            <button className="three-dot-menu">⋮</button>
          </div>

          <div className="messages" ref='messageContainerRef'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === authId ? 'sent' : 'received'}`}
              >
                <span>{msg.content}</span>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleDateString()}</span>
                {renderStatus(msg.status)}
              </div>
            ))}
          </div>

          <div className="message-input">
            <button className="attach-btn">📎</button>
            <InputEmoji
              value={newMessage}
              onChange={setNewMessage}
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={handleSendMessage}>Send</button>
          </div>
        </>
      ) : (
        <p>Select a contact to start chatting</p>
      )}
    </div>
  );
};

export default ChatView;


