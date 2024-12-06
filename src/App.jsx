import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Login from './Component/Authentication/Login';
import Profile from './Component/Profile/Profile';
import ChatLayout from './Component/Chat/ChatLayout';
import Contact from '../src/Component/Contact/Contact'
import Navbar from './Component/Navbar/Navbar';

const App = () => {

  const [view, setView] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = () => {
      const profileId = localStorage.getItem('profileId')

      // axios.patch(`http://127.0.0.1:4001/Profile/status/${profileId}`, { online: false, lastSeen: Date.now() })
      //   .then(response => {
      //     console.log(response.data.message);
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   })

      // localStorage.clear();     // Clear localStorage

    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      {view === true && <Navbar setView={setView} />}
      <Routes>
        {/* Route for Login */}
        <Route path='/' element={<Login setView={setView} />} />

        {/* Chat-related routes with Chat Layout */}
        <Route path='/app/*' element={<ChatLayout setView={setView} />} />

        {/* Profile Route without Chat Layout */}
        <Route path='/Profile' element={<Profile setView={setView} />} />
        <Route path='/Contact' element={<Contact setView={setView} />} />

      </Routes>
    </div>
  );
};

export default App;

