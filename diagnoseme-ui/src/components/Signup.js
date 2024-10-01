import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import { useNavigate } from 'react-router';

const Signup = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [clinic, setClinic] = useState('')
    const [location, setLocation] = useState('')
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // try {
      //   const response = await axios.post('/api/auth/signup', {
      //     username,
      //     email,
      //     role,
      //     registrationNumber,
      //     clinic,
      //     location,
      //     password
      //   });
      try {
        const response = await axios.post('/auth/signup', {
          username,
          email,
          user_role: role,
          registration_number: role === 'DOCTOR' ? registrationNumber : undefined,
          clinic_name: role === 'DOCTOR' ? clinic : undefined,
          location: role === 'DOCTOR' ? location : undefined,
          password
        });
  
        setUserId(response.data.userId);

        navigate('/verify', {state: { userId: response.data.userId, role: response.data.userRole }}); 
        // navigate('/doctor');
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className='register'>
        <div className='register-container background-image'>
          <div className='container mt-5'>
            <div className='row justify-content-center'>
              <div className='col-md-4'>
                <div className='card'>
                  <div className='card-header text-center'>
                    <h3>Sign Up</h3>
                  </div>
                  <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Register as Doctor or Patient: </label>
                            <select className="form-select" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                              <option value="">Register as Doctor or Patient</option>
                              <option value="DOCTOR">Doctor</option>
                              <option value="PATIENT">Patient</option>
                            </select> 
                        </div>

                        {role === 'DOCTOR' && (
                          <div className="mb-3">
                              <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
                              <input
                                  type="text"
                                  className="form-control"
                                  id="registrationNumber"
                                  placeholder="Registration Number"
                                  value={registrationNumber}
                                  onChange={(e) => setRegistrationNumber(e.target.value)}
                                  required
                              />
                              <label htmlFor="clinic" className="form-label">Register Clinic</label>
                              <input type="text" className="form-control" id="clinic" placeholder="Clinic name" value={clinic} onChange={(e) => setClinic(e.target.value)} required/>

                              <label htmlFor="location" className="form-label">Clinic Location</label>
                              <input type="text" className="form-control" id="location" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required/>
                          </div>  
                        )}
                         {role === 'DOCTOR' && (
                      <div className="mb-3">
                        <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
                        <input type="text" className="form-control" id="registrationNumber" placeholder="Registration Number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} required />
                        <label htmlFor="clinic" className="form-label">Register Clinic</label>
                        <input type="text" className="form-control" id="clinic" placeholder="Clinic name" value={clinic} onChange={(e) => setClinic(e.target.value)} required />
                        <label htmlFor="location" className="form-label">Clinic Location</label>
                        <input type="text" className="form-control" id="location" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                      </div>
                    )}
                            
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">SignUp</button>
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

export default Signup;
