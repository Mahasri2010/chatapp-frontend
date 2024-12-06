import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './ChatLayout.css';
import Chat from './Chat'; // For contact list
import Groupchat from '../GroupChat/Groupchat'; // For group list
import ChatView from './ChatView'; // For showing selected contact or group chat

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const location = useLocation();

  const handleSelectContact = (contact) => {
    console.log('Selected Contact in ChatLayout:', contact);
    setSelectedContact(contact);
    // console.log(selectedContact,"selected contact")
    setSelectedGroup(null)
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedContact(null)
  };

  return (
    <div className="chat-layout">
      <div className='chat-content'>
        {/* Main content area */}
        <Routes>
          <Route path="chats" element={<Chat onSelectContact={handleSelectContact} />} />
  
          <Route path="groups" element={<Groupchat onSelectGroup={handleSelectGroup} />} />
        </Routes>
      </div>

      <div className='chat-view '>
        {/* Display chat view for selected contact or group */}
        {location.pathname.includes('chats') && !selectedContact }
        {location.pathname.includes('groups') && !selectedGroup && <div>Select a group to chat</div>}
        <ChatView contact={selectedContact} selectedGroup={selectedGroup} />
      </div>
    </div>
  );
};

export default ChatLayout;







