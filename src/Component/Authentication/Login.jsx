import React, { useState ,useEffect } from 'react';
import './Login.css';  // Custom CSS for additional styling

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [animate,setAnimate] = useState(false)
  

  const toggleForm = () => {
    setAnimate(true); // Trigger animation
    setIsLogin(!isLogin);
    setTimeout(() => setAnimate(false), 500);
  }

  const handleLogin = event => {
    event.preventDefault();
  };

  const handleSignup = event => {
    event.preventDefault();
  };


  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className={`card p-4 shadow ${animate ? 'fade-in' : ''}`} style={{ minWidth: '400px', maxWidth: '500px', borderRadius: '15px' }}>
        <h2 className='text-center'>{isLogin ? 'Login' : 'SignUp'}</h2>
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
              <button type='submit' className='btn btn-primary rounded-pill'>Login</button>
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
              <label htmlFor='loginPassword'>Password</label>
              <input
                type="password"
                id='loginPassword'
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
              />
            </div>
            <div className='d-grid'>
              <button type='submit' className='btn btn-primary rounded-pill'>Sign Up</button>
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
