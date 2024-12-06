import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './chat.css';
import useradd from '../Images/useradd.png';
import placeholder from '../Images/placeholder.png'
import InputEmoji from 'react-input-emoji';


const Chat = ({ onSelectContact }) => {

  const [contacts, setContacts] = useState([]);
  // let [contactsObj,setContactsById]=useState[{}]
  const [message, setMessage] = useState({})
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [con_name, setConName] = useState('')
  const [con_number, setConNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  const authId = localStorage.getItem('authId');
  const profileId = localStorage.getItem('profileId')

  // Fetch contacts from the backend when the component mounts
  useEffect(() => {

    if (authId) {
      axios.get(`http://127.0.0.1:4001/Contact/contacts/${authId}`)
        .then(response => {
          console.log(response.data, "Contacts")
          const receiverProfileId = response.data.profileId
          // console.log(receiverProfileId, "----")
          setContacts(response.data)
          // setContactsById(contactsObj); 

          // response.data.forEach(contact => {

        })
        .catch(error => console.error('Error fetching contacts:', error));

    }
  }, []);

  useEffect(() => {
    if (Array.isArray(contacts) && contacts.length > 0) {
      contacts.forEach(contact => {

        const receiverProfileId = contact.profileId;  // Get profileId for each contact
        console.log(receiverProfileId, "receiverProfileId");

        // Fetch chat with the specific contact
        if (receiverProfileId) {
          axios.get(`http://127.0.0.1:4001/Chat/specific/${profileId}/${receiverProfileId}`)
            .then(response => {
              console.log(response.data, "ChatLastMessage");
              console.log(response.data.lastMessage.content, "lastMsg")
              setMessage(response.data);
            })
            .catch(error => console.error('Error fetching chat:', error));
        }
      })
    }
  },[])


  // Ensure contacts is an array before calling filter


  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact =>
    contact.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleStartChat = (contactId) => {

    axios.patch(`http://127.0.0.1:4001/Contact/accept/${contactId}`)
      .then((response) => {
        console.log('Chat started successfully:', response.data);

        // Find the updated contact by ID
        const updatedContact = contacts.find(contact => contact._id === contactId);

        if (updatedContact) {
          console.log('Selected Contact:', updatedContact);
          onSelectContact(updatedContact, authId)
          // Call the parent function to select the contact
        } else {
          console.warn('onSelectContact function is not defined.');
          console.warn('Contact not found after update.');
        }
      })
      .catch((error) => {
        console.error('Error starting chat:', error);
      });
  };

  const handleShowModal = () => {

    setConName(""); // Clear the name field
    setConNumber(""); // Clear the number field
    setSuccessMessage(""); // Clear any previous success message
    setErrorMessage(""); // Clear any previous error message
    setShowModal(true)
  };


  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handleSaveContact = event => {
    event.preventDefault()

    // clear previous message
    setSuccessMessage('')
    setErrorMessage('')

    if (!con_name || !con_number) {
      setErrorMessage('Name and phone number are required');
      return;
    }

    const authId = localStorage.getItem('authId')


    const data = {
      authId: authId,
      contact_name: con_name,
      contact_number: con_number
    }
    console.log(data, "Contact Data")
    axios.post('http://127.0.0.1:4001/Contact/add/', data)
      .then(response => {
        console.log(response.data)

        setSuccessMessage("Contact saved successfully!");
        setContacts((prevContacts) => [...prevContacts, response.data]); // Update contact list

        // Close the modal after a delay
        setTimeout(() => {
          handleCloseModal();
          setSuccessMessage(""); // Reset success message after closing modal
        }, 2000);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          // If there's an error response from the server, display it
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      })
  }


  return (
    <div className="chatlist-container" style={{ marginLeft: '75px', padding: '10px' }}>
      <h2>Chats</h2>

      {/* Search bar and add contact/group icons */}
      <div className="chatlist-header d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search Contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <img src={useradd}
          alt="Add Contact"
          className="add-contact-icon"
          style={{ width: '22px', height: '22px', filter: 'invert(100%)' }}
          onClick={handleShowModal} />

      </div>

      {/* Contact List */}
      <div className="contact-list">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="contact-item"
              onClick={(e) => {
                e.stopPropagation();
                if (contact.isRegistered) {
                  onSelectContact(contact._id)
                }
              }} //only select registered contacts
              style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ddd', cursor: 'pointer' }}
            >
              {/* Profile Picture in a Rounded Circle */}
              <img
                src={contact.profilePicture || placeholder}
                alt={`${contact.contact_name}'s profile`}
                className="profile-picture rounded-circle"
                style={{ width: '50px', height: '50px', marginRight: '15px' }}
              />

              {/* Contact Details */}
              <div className="contact-details" style={{ flex: 1 }}>

                <h4 className="contact-name" style={{ margin: '0 0 5px 0' }} >{contact.contact_name}</h4>

                {contact.isRegistered ? (
                  message.lastMessage ? (
                    <p className="last-message" style={{ margin: 0, color: '#888' }}>{message.lastMessage.content}</p>
                  ) : (
                    <button
                      className="start-chat-button"
                      onClick={(e) => { e.stopPropagation(); handleStartChat(contact._id) }}
                      style={{ backgroundColor: 'blueviolet', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Start Chat
                    </button>
                  )
                ) : (
                  // <button className="invite-button">Invite</button>
                  <h4 style={{ color: 'blueviolet' }}>Invite</h4>
                )}

              </div>
            </div>
          ))
        ) : (
          <p>No contacts found</p>
        )}
      </div>


      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{
          background: 'rgba(0,0,0,0.5)', marginTop: '0px', marginLeft: '10px'
        }}>
          <div className="modal-dialog" role="document" style={{ borderColor: '#6a11cb', borderRadius: '10px', borderWidth: '2px', borderStyle: 'solid' }} >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Contact</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Display success message if present */}
                {successMessage && <p className="success-message">{successMessage}</p>}

                {/* Display error message if present */}
                {errorMessage && <p className="error-message text-danger text-center">{errorMessage}</p>}

                <form>
                  <div className='mb-3' >
                    <label htmlFor="">Name</label>
                    <InputEmoji
                      type="text"
                      className='infield'
                      value={con_name}
                      placeholder='Enter your Name'
                      onChange={setConName}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor="">Phone Number</label>
                    <input
                      type="number"
                      className='infield'
                      placeholder='+91 9876543210'
                      style={{ borderRadius: '50px' }}
                      value={con_number}
                      onChange={e => setConNumber(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSaveContact}>
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;

