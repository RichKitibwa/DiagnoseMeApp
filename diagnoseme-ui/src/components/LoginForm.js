import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE } from '../utils/Constants';

const LoginForm = ({  handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
      });

      const token = response.data.access_token;

      console.log('Role:', response.data.userRole);
      const role = response.data.userRole;
      localStorage.setItem('role', role); 

      handleLogin(role, token);

      if (role === 'DOCTOR') {
        navigate('/doctor');
      } else if (role === 'PATIENT') {
        navigate('/patient');
      }

    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className='login'>
      <div className='login-container background-image'>
        <div className='container mt-5'>
            <div className='row justify-content-center'>
              <div className='col-md-4'>
                <div className='card'>
                  <div className='card-header text-center'>
                    <h3>Log in</h3>
                  </div>
                  <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg btn-block w-100">Login</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>    
          </div>      
        </div>    
    </div>    
  );
};

export default LoginForm;
