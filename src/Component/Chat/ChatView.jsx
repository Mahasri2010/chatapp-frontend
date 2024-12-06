import React, { useState, useEffect, useRef } from 'react';
import InputEmoji from 'react-input-emoji';
import axios from 'axios';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import './ChatView.css';

const ChatView = ({ contact }) => {

    // State Variables
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineStatus, setOnlineStatus] = useState('');
    const [chatId, setChatId] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedNumber, setEditedNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isClearingChat, setIsClearingChat] = useState(false);
    const authId = localStorage.getItem('authId')
    const profileId = localStorage.getItem('profileId')

    const messageContainerRef = useRef(null);
    const dropdownRef = useRef(null);


    // Update state when contact prop changes
    useEffect(() => {
        if (contact) {
            console.log(contact, "contact")
            setOnlineStatus(contact.online ? 'Online' : `Last seen at ${contact.lastSeen}`);
            setEditedName(contact.name || '');
            setEditedNumber(contact.number || '');
            fetchChatAndMessages(); // Fetch chat and messages when contact is available
        }
    }, [contact]);

    // Fetch or create chat and messages
    const fetchChatAndMessages = async () => {
        try {
            if (!contact || !authId) {
                console.error('Missing contact or authId');
                return;
            }

            const receiverProfileId = contact.profileId
            console.log(receiverProfileId, "Receiver ProfileId")
            // Fetch specific chat between authId and contact.profileId using the /specific/:senderId/:receiverId API
            const chatResponse = await axios.get(`http://127.0.0.1:4001/Chat/specific/${profileId}/${receiverProfileId}`);
            console.log('Chat response data:', chatResponse.data);

            if (chatResponse.data) {
                // Chat already exists, so we will set the chat ID and fetch messages
                const existingChat = chatResponse.data;
                console.log(existingChat.chatId, "existing chat")
                setChatId(existingChat.chatId); // Set the existing chat ID

                // Fetch all messages for this chat
                const messagesResponse = await axios.get(`http://127.0.0.1:4001/Chat/Message/specific/${existingChat.chatId}`);
                if (messagesResponse.data) {
                    setMessages(messagesResponse.data); // Set the fetched messages
                    console.log(messagesResponse.data, "messages")
                    console.log(messagesResponse.data,"msgsenderId")
                } else {
                    console.error('No messages found for this chat');
                    setMessages([]); // If no messages, set to empty array
                }
            } else {
                console.log('No existing chat found. Creating a new chat...');

                // If no chat exists, create a new one
                const newChatResponse = await axios.post('http://127.0.0.1:4001/Chat/newchat', {
                    senderId: profileId, // Using authId as senderId
                    receiverId: contact.profileId, // Using contact's profileId as receiverId
                });

                if (newChatResponse.data && newChatResponse.data._id) {
                    console.log('New chat created with ID:', newChatResponse.data._id);
                    setChatId(newChatResponse.data._id); // Set the new chat ID
                    setMessages([]); // New chat will have no messages initially
                } else {
                    console.error('New chat creation failed');
                }
            }
        } catch (error) {
            console.error('Error fetching or creating chat:', error);
        }
    };


    // Handle sending a message
    // const handleSendMessage = () => {
    //   if (!newMessage.trim()) return

    //   const messageData = {
    //     chatId,
    //     senderId: profileId,
    //     receiverId:contact.profileId,
    //     content: newMessage,
    //   };
    //   console.log(messageData, "Message")
    //   axios
    //     .post('http://127.0.0.1:4001/Chat/Message/send', messageData)
    //     .then((response) => {
    //       console.log('Message Sent Successfully:', response.data);
    //       setMessages([...messages, response.data]);
    //       setNewMessage('');
    //     })
    //     .catch((error) => console.error('Error sending message:', error));
    // };
    // Fetch Chat and Message
    // const fetchChatAndMessages = async () => {
    //   try {
    //     if (contact && authId) {
    //       // Fetch all chats for the current user
    //       const receiverProfileId = contact.profileId
    //       const chatResponse = await axios.get(`http://127.0.0.1:4001/Chat/specific/${profileId}/${receiverProfileId}`);
    //       console.log(chatResponse.data, "ChatResponse.data");

    //       // Find the existing chat between the current user and the contact
    //       const existingChat = chatResponse.data.find((chat) =>
    //         chat.participants.includes(contact._id)
    //       );

    //       if (existingChat) {
    //         // If chat exists, set the chatId and fetch messages
    //         console.log('Existing Chat Found:', existingChat);
    //         setChatId(existingChat._id);  // Set the chatId for sending messages
    //         console.log(existingChat._id, "Existing Chat ID");

    //         // Fetch all messages for this chat
    //         const messagesResponse = await axios.get(
    //           `http://127.0.0.1:4001/Chat/Message/specific/${existingChat._id}`
    //         );
    //         setMessages(messagesResponse.data || []);
    //       } else {
    //         // If no existing chat, create a new one
    //         console.log('No existing chat. Creating a new one...');

    //         const newChatResponse = await axios.post('http://127.0.0.1:4001/Chat/newchat', {
    //           senderId: profileId,
    //           receiverId: contact.profileId,
    //         });
    //         console.log('New Chat Created:', newChatResponse.data);
    //         setMessages([]); // New chat will have no messages initially
    //         if (newChatResponse.data._id) {
    //           setChatId(newChatResponse.data._id);  // Set the new chatId
    //           console.log(newChatResponse.data._id, "New Chat ID");
    //         } else {
    //           console.error("New chat creation failed.");
    //         }
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error fetching or creating chat:', error);
    //   }
    // };



    const handleSendMessage = async () => {
        try {

            if (chatId && newMessage.trim()) {
                // Send the message using the existing chatId

                const messageResponse = await axios.post('http://127.0.0.1:4001/Chat/Message/send', {
                    chatId,  // Use the chatId from state
                    senderId: profileId,  // Current user's ID
                    receiverId: contact.profileId,  // Contact's profileId
                    // timestamp: new Date().toISOString(),
                    content: newMessage,
                });

                // Add the new message to the state (optional)
                setMessages((prevMessages) => [...prevMessages, messageResponse.data]);
                setNewMessage('')

                console.log('Message sent:', messageResponse.data);
            } else {
                console.error('No chatId available or empty message content');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };



    // Scroll messages to the bottom when new messages are added
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Mark messages as read
    // const markMessagesAsRead = () => {

    //   const unreadMessages = messages.filter((msg) => msg.status === 'delivered');
    //   unreadMessages.forEach((msg) => {
    //     axios
    //       .patch(`http://127.0.0.1:4001/Chat/Message/status/${msg._id}`, { status: 'read' })
    //       .then((response) => {
    //         setMessages((prevMessages) =>
    //           prevMessages.map((m) =>
    //             m._id === response.data._id ? { ...m, status: response.data.status } : m
    //           )
    //         );
    //       })
    //       .catch((error) => console.error('Error updating message status:', error));
    //   });
    // };
    const markMessagesAsRead = async () => {
        // console.log("markMessagesAsRead function triggered.");

        const unreadMessages = messages.filter((msg) => msg.status === 'delivered');
        // console.log("Unread messages to update:", unreadMessages);

        if (unreadMessages.length === 0) {
            // console.log("No unread messages to mark as read.");
            return;
        }

        try {
            // Send PATCH request for each unread message
            const updatedMessages = await Promise.all(
                unreadMessages.map((msg) => {
                    // console.log(`Sending PATCH request for messageId: ${msg._id}`)
                    axios.patch(`http://127.0.0.1:4001/Chat/Message/status/${msg._id}`, { status: 'read' })
                    console.log(`Response from API for ${msg._id}:`, response.data);
                    return response; // Return the response for further processing
                })
            );

            // Update state with updated message statuses
            setMessages((prevMessages) =>
                prevMessages.map((m) => {
                    const updatedMessage = updatedMessages.find(
                        (updated) => updated.data._id === m._id
                    );
                    if (updatedMessage) {
                        // console.log(`Updating status for message ${m._id}:`, updatedMessage.data.status);
                        return { ...m, status: updatedMessage.data.status };
                    }
                    return m;
                })
            );
            console.log("Messages successfully marked as read:", updatedMessages);
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    useEffect(() => {
        markMessagesAsRead();
    }, [messages]);



    const fetchMoreMessages = async () => {
        const response = await axios.get(
            `http://127.0.0.1:4001/Chat/Message/specific/${chatId}?skip=${messages.length}&limit=20`
        );
        setMessages((prevMessages) => [...response.data, ...prevMessages]);
    };


    // Dropdown actions
    const handleViewContact = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const handleEditContact = () => setIsEditModalVisible(true);
    const handleCloseEditModal = () => setIsEditModalVisible(false);

    const handleSaveContact = () => {
        const updatedContact = { name: editedName, number: editedNumber };
        axios
            .put(`http://127.0.0.1:4001/Contact/update/${contact._id}`, updatedContact)
            .then(() => {
                alert('Contact updated successfully!');
                setIsEditModalVisible(false);
            })
            .catch((error) => {
                const message =
                    error.response?.data?.message || 'An unexpected error occurred. Please try again.';
                setErrorMessage(message);
            });
    };

    const handleClearChat = () => {
        if (window.confirm('Are you sure you want to clear this chat?')) {
            setIsClearingChat(true);
            axios
                .delete(`http://127.0.0.1:4001/Chat/clear/${chatId}`)
                .then(() => setMessages([]))
                .catch((error) => console.error('Error clearing chat:', error));
        }
    };

    const handleBlockUser = () => {
        if (window.confirm(`Are you sure you want to block ${contact.contact_name}?`)) {
            axios
                .post('http://127.0.0.1:4001/Contact/block', { contactId: contact._id })
                .then(() => {
                    alert(`${contact.name} has been blocked.`);
                    setOnlineStatus('Blocked');
                    setMessages([]);
                })
                .catch((error) => console.error('Error blocking user:', error));
        }
    };

    const handleUnblockUser = () => {
        if (window.confirm(`Are you sure you want to unblock ${contact.name}?`)) {
            axios
                .post('http://127.0.0.1:4001/Contact/unblock', { contactId: contact._id })
                .then(() => {
                    alert(`${contact.name} has been unblocked.`);
                    setOnlineStatus(contact.online ? 'Online' : `Last seen at ${contact.lastSeen}`);
                })
                .catch((error) => console.error('Error unblocking user:', error));
        }
    };

    const toggleDropdown = () => {

        // setIsDropdownVisible((prevState) => !prevState);
        setIsDropdownVisible(!isDropdownVisible)
        console.log("Toggling dropdown visibility", !isDropdownVisible);
    }
    // useEffect(() => {
    //   console.log("Dropdown visibility changed:", isDropdownVisible); // Logs whenever state changes
    // }, [isDropdownVisible]);


    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current || !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Render message status
    const renderStatus = (status) => {
        console.log(status, "status")
        if (status === 'sent') return <span className="message-status">✓</span>;
        if (status === 'delivered') return <span className="message-status">✓✓</span>;
        if (status === 'read') return <span className="message-status">✓✓ (seen)</span>;
        return null;
    };

    // Function to format last seen like WhatsApp
    const formatLastSeen = (timestamp) => {

        if (!timestamp || isNaN(new Date(timestamp).getTime())) {
            return "Last seen unknown"; // Handle invalid or missing timestamps
        }

        const date = new Date(timestamp);
        const now = new Date();

        const timeDifference = now - date;
        // If it's within the last 24 hours, show 'Last seen today at [time]'
        if (timeDifference < 24 * 60 * 60 * 1000) {
            return `Last seen today at ${format(date, 'hh:mm a')}`;
        }

        // If it's more than 24 hours ago, show 'Last seen on [X days ago]'
        if (timeDifference < 48 * 60 * 60 * 1000) {
            return `Last seen yesterday at ${format(date, 'hh:mm a')}`;
        }

        // Show the exact date and time for older messages
        return `Last seen on ${format(date, 'MMM dd, yyyy')} at ${format(date, 'hh:mm a')}`;
    };
    // console.log(messages.senderId._id, profileId)
    // console.log(messages.senderId._id === profileId ? 'true' : 'false', "sent/received")
    return (
        <div className="chat-view">
            {contact ? (
                <>
                    <div style={{ margin: 0, padding: 0, position: 'relative' }} >
                        <div className="chat-header">
                            {/* Profile Picture */}
                            <div>
                                <img
                                    src={contact.profilePicture}
                                    alt="Profile"
                                    className="profile-picture rounded-circle"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="contact-info" >
                                <p className="contact-name" >
                                    {contact.contact_name}
                                </p>

                                {/* Render Online or Blocked Status */}
                                {onlineStatus === 'Blocked' ? (
                                    <p className="blocked-message" style={{ color: 'red' }}>
                                        You have blocked this contact. Messages cannot be sent or received.
                                    </p>
                                ) : (
                                    <p className="online-status">
                                        {contact.online ? 'Online' : formatLastSeen(contact.lastSeen)}
                                    </p>
                                )}
                            </div>

                            {/* Three Dot Menu */}
                            <div>
                                <button
                                    // onClick={toggleDropdown}
                                    onClick={toggleDropdown}
                                    className="three-dot-menu"
                                >
                                    ⋮
                                </button>
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownVisible && (
                            <div className="dropdown-menu"
                                style={{
                                    position: 'absolute',   // Make sure it's positioned relative to the parent
                                    top: '40px',            // Adjust the top position to appear below the button
                                    right: '0',             // Align it to the right side
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    width: '150px',
                                    zIndex: 1000, // Ensure it's above other elements
                                }}
                            >
                                <button onClick={handleViewContact}>View Contact</button>
                                <button onClick={handleEditContact}>Edit Contact</button>
                                <button onClick={handleClearChat}>Clear Chat</button>
                                <button onClick={contact.blocked ? handleUnblockUser : handleBlockUser}>
                                    {contact.blocked ? 'Unblock' : 'Block'} Contact
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="messages-container" ref={messageContainerRef}>
                        {/* If the user is blocked, show blocked message */}
                        {onlineStatus === 'Blocked' ? (
                            <p className="blocked-message">You have blocked this contact. Messages cannot be sent or received.</p>
                        ) : (
                            messages.length > 0 ? (
                                messages.map((message) => (
                                    <div key={message._id} className={`message ${message.senderId === profileId ? 'sent' : 'received'}`}>
                                        <p>{message.content}</p>
                                        <div className="message-status-container">{renderStatus(message.status)}</div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', bottom: '0' }}>No messages yet.</p> // Message when no messages are present
                            )
                        )}
                    </div>

                    <div className="input-container" style={{ position: 'relative' }}>
                        <InputEmoji
                            value={newMessage}
                            onChange={setNewMessage}
                            onEnter={handleSendMessage}
                            cleanOnEnter
                            placeholder="Type a message"
                        />
                    </div>
                </>
            ) : (
                <div className=' d-flex justify-content-center align-items-center vh-100' /*style={{flexDirection:'row'}}*/ >Loading contact details...</div> // Fallback for loading state
            )
            }

            {/* Edit Contact Modal */}
            {
                isEditModalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Edit Contact</h2>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Name"
                            />
                            <input
                                type="text"
                                value={editedNumber}
                                onChange={(e) => setEditedNumber(e.target.value)}
                                placeholder="Phone Number"
                            />
                            <button onClick={handleSaveContact}>Save</button>
                            <button onClick={handleCloseEditModal}>Cancel</button>
                        </div>
                    </div>
                )
            }

            {/* Confirmation Modals */}
            {
                isClearingChat && (
                    <div className="loading-modal">
                        <div className="loading-spinner">Clearing chat...</div>
                    </div>
                )
            }
        </div >
    );
}

export default ChatView;