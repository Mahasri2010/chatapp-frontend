import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Groupchat.css';
import grp from '../Images/grp.png';

const Groupchat = ({onSelectContact}) => {
 
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contacts from the backend when the component mounts
  // useEffect(() => {
  //   axios.get('http://127.0.0.1:4001/contact/')
  //     .then(response => setContacts(response.data))
  //     .catch(error => console.error('Error fetching contacts:', error));
  // }, []);




  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chatlist-container" style={{ marginLeft: '75px', padding: '10px' }}>
      <h2>Groups</h2>

      {/* Search bar and add contact/group icons */}
      <div className="chatlist-header d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search Contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/addmember">
          <img src={grp} alt="New Group " className="add-contact-icon" style={{ width: '20px', height: '20px', filter: 'invert(100%)' }} />
        </Link>
      </div>

      {/* Contact list */}
      <div className="chatlist-content">
        <ul className="list-unstyled">
          {filteredContacts.map((contact) => (
            <li
              key={contact.id}
              className="chat-item"
              onClick={() => onSelectContact(contact)} // Pass selected contact to parent
            >
              {contact.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default Groupchat