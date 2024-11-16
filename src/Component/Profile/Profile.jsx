import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import InputEmoji from 'react-input-emoji';
import placeholder from '../Images/placeholder.png'



const Profile = ({ setView }) => {
  const navigate = useNavigate();

  const authId = localStorage.getItem('authId')
  const [base64String, setBase64String] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('Hey there! i am using MernChat');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  const handleImageChanges = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;
      setBase64String(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = () => {
    document.getElementById('file-input').click();
  };


  // const Submit = async (event) => {
  //   event.preventDefault();

  //   // clear previous message
  //   setSuccessMessage('')
  //   setErrorMessage('')

  //   const profileData = {
  //     profilePicture: base64String,
  //     name: name,
  //     about: about,
  //     phone: phone,
  //     authId: authId
  //   };

  //   if (!name.trim() || !phone.trim()) {
  //     alert('Please fill out all required fields.');
  //     return;
  //   }


  //   axios.post('http://127.0.0.1:4001/Profile/add', profileData)
  //     .then((response) => {
  //       console.log(response.data.profile); // The profile data sent from the backend

  //       const { isRegistered } = response.data.profile; // Assuming backend returns isRegistered in response

  //       // If the profile is registered, proceed with status update and navigation
  //       if (isRegistered) {
  //         axios.patch(`http://127.0.0.1:4001/Profile/status/${response.data.profile._id}`, {
  //           online: true,
  //           lastSeen: null
  //         })

  //           // Update status and last seen after profile setup
  //           // axios.patch(`http://127.0.0.1:4001/Profile/status/${response.data.profile._id}`, {
  //           //   online: true,
  //           //   lastSeen: null
  //           // })
  //           .then(() => {

  //             setSuccessMessage('Contact saved  successfully!');
  //             setTimeout(() => {
  //               navigate('/app/chats');
  //               setView(true);
  //             }, 2000);
  //           })
  //           .catch((error) => {
  //             console.error('Error updating status:', error);
  //             setErrorMessage('Profile saved, but there was an issue updating online status.');
  //           });
  //       })
  //     .catch((error) => {
  //       console.error('Error saving profile:', error);
  //       setErrorMessage('There was an error saving your profile. Please try again.');
  //     });
  // };


  // navigate('/app/chats'); // Redirect to chat after successful operation
  // setView(true)

  const Submit = async (event) => {
    event.preventDefault();
  
    // clear previous message
    setSuccessMessage('');
    setErrorMessage('');

      // Ensure `authId` is not null
      if (!authId) {
        setErrorMessage("User ID is missing. Please check your login status.");
        return;
    }
  
    const profileData = {
      profilePicture: base64String,
      name: name,
      about: about,
      phone: phone,
      authId: authId,
      isRegistered: true  // Explicitly set this field to true
    };
  
    if (!name.trim() || !phone.trim()) {
      alert('Please fill out all required fields.');
      return;
    }
  
    axios.post('http://127.0.0.1:4001/Profile/add', profileData)
      .then((response) => {
        console.log(response.data.profile,"Profile"); // The profile data sent from the backend
        localStorage.setItem('profileId',response.data.profile._id)
  
        const { isRegistered } = response.data.profile; // Assuming backend returns isRegistered in response
  
        // If the profile is registered, proceed with status update and navigation
        if (isRegistered) {
          axios.patch(`http://127.0.0.1:4001/Profile/status/${response.data.profile._id}`, {
            online: true,
            lastSeen: null
          })
            .then(() => {
              setSuccessMessage('Profile saved successfully!');
              setTimeout(() => {
                navigate('/app/chats');
                setView(true);
              }, 2000);
            })
            .catch((error) => {
              console.error('Error updating status:', error);
              setErrorMessage('Profile saved, but there was an issue updating online status.');
            });
        } else {
          setErrorMessage('Profile is not registered. Please complete registration.');
        }
      })
      .catch ((error)=>{
        if (error.response && error.response.status === 409) {
            setErrorMessage("Profile already exists for this user.");
            // window.location.href = `/Profile/update/${authId}`
        } else {
            setErrorMessage("An error occurred while creating the profile.");
        }
      })
  };
  


  useEffect(() => {

    if (authId) {

      axios.get(`http://127.0.0.1:4001/Auth/get/${authId}`)
        .then((response) => {
          console.log("user Data", response.data); // The auth data returned from the backend
        })
        .catch(error => {
          console.error('Error fetching user:', error.response ? error.response.data : error.message);
        });
    }

  }, [authId])


  return (


    <div className='profile d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4 shadow picwid'>

        {successMessage && <p className="success-message">{successMessage}</p>}

        <h3 className='text-center'>Profile Setup</h3>

        {/* Display success and error messages */}

        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

        <div className='mb-3 mt-3 text-center'>
          <div className='profile-pic-container'>
            {base64String ? (
              <img src={base64String} alt="Profile" className='profile-pic' />
            ) : (
              <img src={placeholder} alt="Profile" className='profile-pic' /> // Placeholder image
            )}
          </div>
          <button onClick={handleFileSelect} className='btn btn-primary mt-2'>Upload Profile</button>
          <input
            id='file-input'
            type="file"
            accept="image/*"
            onChange={handleImageChanges}
            className="file-input"
            style={{ display: 'none' }}
          />
        </div>

        <div className='mb-3'>
          <label htmlFor="">Name</label>
          <InputEmoji
            type="text"
            className='infield'
            value={name}
            placeholder='Enter your Name'
            onChange={setName}
            required
          />
        </div>

        <div className='mb-3'>
          <label htmlFor="">About</label>
          <InputEmoji
            type="text"
            className='infield'
            placeholder='Enter your Quotes'
            value={about}
            onChange={setAbout}
          />
        </div>

        <div className='mb-3'>
          <label htmlFor="">Phone Number</label>
          <input
            type="number"
            className='infield'
            placeholder='+91 9876543210'
            style={{ borderRadius: '50px' }}
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <button type='submit' className='btn btn-success' onClick={Submit}>
          Save
        </button>
      </div>
    </div>

  )
}

export default Profile;




