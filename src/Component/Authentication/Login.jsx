import React, { useState } from 'react';
import './Login.css';  // Custom CSS for additional styling

const Login = () => {

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const toggleForm = () =>{
    setIsLogin(!isLogin)
  }

  const handlelogin = event =>{
    event.preventDefault()
  }

  const handleSignup = event =>{
    event.preventDefault()
  }
 
  return (
    <div className='border'>
      <div className='container align-item center'>
        <h2>{isLogin ? 'Login' : 'SignUp'}</h2>
        {isLogin ? (
          <form>

            <div>
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                className='form-control'
                placeholder='Enter your email'
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className='form-control'
                placeholder='Enter your password'
                required
              />
            </div>

            <div>
              <button type='submit' className='btn btn-primary' onClick={handlelogin}> Login </button>
            </div>

          </form>
        ) : (
          <form>
             <div>
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                className='form-control'
                placeholder='Enter your email'
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className='form-control'
                placeholder='Enter your password'
                required
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input 
              type="password"
              value={confirmPassword}
              onChange={e=>setConfirmPassword(e.target.value)}
              className='form-control'
              placeholder='Confirm your Password'
               />
            </div>

            <div>
              <button type='submit' className='btn btn-primary' onClick={handleSignup}> SignUp </button>
            </div>

          </form>
        )}

        <button onClick={toggleForm}>{isLogin ? "Don't have an account ? SignUp " : 'Already have an account ? Login'}</button>
      </div>

    </div>
  );
};

export default Login;
