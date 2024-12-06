import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure Axios is imported

const Login = ({ setView }) => {

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('');

  // const [loading, setLoading] = useState(false); // Loading state

  // Email Validation Function
  const validateEmail = (email) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('')
  };

  // const handleLogin = async (event) => {
  //   event.preventDefault();

  //   // clear previous message
  //   setSuccessMessage('')
  //   setErrorMessage('')

  //   // Check for empty fields
  //   if (!email || !password) {
  //     setErrorMessage('Email and password are required.');
  //     return;
  //   }

  //   // // Check password length
  //   if (password.length !== 4) {
  //     setErrorMessage('Password must be at least 4 characters long.');
  //     return;
  //   }

  //   // Check email validity
  //   if (!validateEmail(email)) {
  //     setErrorMessage('Please enter a valid email.');
  //     return; // Prevent further execution if email is invalid
  //   }

  //   const user_data = { email, password };
  //   axios.post('http://127.0.0.1:4001/Auth/login/', user_data)
  //     .then(response => {

  //       // Add this line to log the response data
  //       console.log("Login Response Data:", response.data);

  //       if (response.data.status) {
  //         localStorage.setItem('Bearer', response.data.access_token);
  //         localStorage.setItem('refresh_token', response.data.refresh_token);
  //         localStorage.setItem('authId', response.data.userdata._id);
  //         localStorage.setItem('profileId', response.data.userdata.profileId)


  //         // Update online status
  //               axios.patch(
  //                 `http://127.0.0.1:4001/Profile/status/${response.data.userdata.profileId}`,
  //                 { online: true, lastSeen: null },
  //               );
                

  //         setSuccessMessage('Logged in successfully!');
  //         setTimeout(() => {
  //           navigate('/app/chats');
  //           setView(true);
  //         }, 2000);
  //       }
  //     })
  //     .catch(error => {
  //       if (error.response) {
  //         setErrorMessage(error.response.data.message || 'An error occurred. Please try again.');
  //       } else {
  //         setErrorMessage('An error occurred. Please try again.');
  //       }
  //     });
  // };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    // clear previous message
    setSuccessMessage('');
    setErrorMessage('');
  
    // Check for empty fields
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }
  
    // // Check password length
    if (password.length !== 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
  
    // Check email validity
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email.');
      return; // Prevent further execution if email is invalid
    }
  
    const user_data = { email, password };
    axios.post('http://127.0.0.1:4001/Auth/login/', user_data)
      .then(response => {
        // console.log("Login Response Data:", response.data);
  
        if (response.data.status) {
          localStorage.setItem('Bearer', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('authId', response.data.userdata._id);
          localStorage.setItem('profileId', response.data.userdata.profileId);
  
          // Update online status
          axios.patch(
            `http://127.0.0.1:4001/Profile/status/${response.data.userdata.profileId}`,
            { online: true }
          )
          .then(statusResponse => {
            console.log("Status Update Response:", statusResponse.data);
  
            if (statusResponse.data.message === "Status updated.") {
              // You can update the state or do something else here if necessary
              // setSuccessMessage('Logged in successfully and status updated!');
              setSuccessMessage('Logged in successfully');
            } else {
              setErrorMessage('Failed to update status.');
            }
  
            setTimeout(() => {
              navigate('/app/chats');
              setView(true);
            }, 2000);
          })
          .catch(error => {
            setErrorMessage('Failed to update status.');
          });
        }
      })
      .catch(error => {
        if (error.response) {
          setErrorMessage(error.response.data.message || 'An error occurred. Please try again.');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      });
  };
  

  const handleSignup = async (event) => {
    event.preventDefault();

    // clear previous message
    setSuccessMessage('')
    setErrorMessage('')

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return; // Prevent further execution if passwords don't match
    }

    // Check email validity
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email.');
      return; // Prevent further execution if email is invalid
    }

    const user_data = { email, password };
    axios.post('http://127.0.0.1:4001/Auth/signup/', user_data)
      .then(response => {
        if (response.data.status) {
          localStorage.setItem('Bearer', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('authId', response.data._id);
          // localStorage.setItem('profileId', response.data._id);
          setSuccessMessage('Signed up successfully!');
          setTimeout(() => {
            navigate('/Profile');
            // setView(true);
          }, 2000);
        } else {
          // Display backend error message
          setErrorMessage(response.data.message || 'Signup failed. Please try again.');
        }
      })
      .catch(error => {
        // Check if there's a response from the server
        if (error.response) {
          // Handle specific error messages returned from the backend
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      });
  };


  useEffect(() => {
    const fetchToken = () => {
      const refresh_token = localStorage.getItem('refresh_token');
      axios.post('http://127.0.0.1:4001/Auth/token/', { refresh_token })
        .then(response => {
          localStorage.setItem('Bearer', response.data.access_token);
        });
    };

    fetchToken();
    const interval = setInterval(fetchToken, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardStyles = {
    // width: '90%',
    maxWidth: '400px',
    margin: '0 auto',
  };


  return (
    <div className='login d-flex justify-content-center align-items-center vh-100'>
      <div className='animate card p-4 shadow ' style={cardStyles}>
        <h2 className='text-center'>{isLogin ? 'Login' : 'Sign Up'}</h2>


        {/* Display success message if present */}
        {successMessage && <p className="success-message" >{successMessage}</p>}

        {/* Display error message if present */}
        {errorMessage && <p className="error-message text-danger text-center">{errorMessage}</p>}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className="fas fa-envelope"></i></span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='form-control'
                placeholder='Enter your email'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='form-control'
                placeholder='Enter your password'
                required
              />
            </div>
            <div className='d-grid'>
              <button type='submit' className='btn btn-primary rounded-pill' /* disabled={loading}*/ >
                { /*loading ? 'Logging in...' :*/ 'Login'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className='input-group mb-3'>
              <span className='input-group-text'><i className="fas fa-envelope"></i></span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='form-control'
                placeholder='Enter your email'
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='signupPassword'>Password</label>
              <input
                type="password"
                id='signupPassword'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='form-control'
                placeholder='Enter your password'
                required
              />
            </div>
            <div className='mb-3'>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className='form-control'
                placeholder='Confirm your Password'
                required
              />
            </div>
            <div className='d-grid'>
              <button type='submit' className='btn btn-primary rounded-pill' /*disabled={loading}*/ > {/*loading ? 'Signing up...' :*/ 'Sign Up'}
              </button>
            </div>
          </form>
        )}
        <button className='btn btn-link mt-3' onClick={toggleForm}>
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;



