import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import Home from './components/Home';
import Signup from './components/Signup'; 
import LoginForm from './components/LoginForm';
import LogoutButton from './components/Logout';
import MyNavbar from './components/Navbar';
import DoctorHome from './components/DoctorHome';
import PatientHome from './components/PatientHome';
import FileDetails from './components/FileDetails';
import VerifyOTP from './components/VerifyOTP';
import { USER_ROLE } from './utils/Constants';
import NewPatient from './components/NewPatient';
import ExisitingPatients from './components/ExistingPatients';
import Patient from './components/Patient';
import PatientCases from './components/PatientCases';
import CaseDetailView from './components/CaseDetailView';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const checkAuthentication = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const expiration = extractTokenExpiration(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime <expiration) {
        setIsAuthenticated(true);
        setUserRole(extractUserRoleFromToken(token));
      } else {
        console.log("Token has expired");
        setIsAuthenticated(false);
        setUserRole('');
        localStorage.removeItem('jwtToken');
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  function extractTokenExpiration(token) {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const payloadDecoded = JSON.parse(window.atob(base64));
      const expiration = payloadDecoded.exp;
      return expiration;
    } catch (error) {
      console.error('Error extracting token expiration:', error);
      return null;
    }
  }

  function extractUserRoleFromToken(token) {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token');
      }
  
      // Decode the payload part
      const payload = parts[1];
      const decodedPayload = JSON.parse(window.atob(payload));

      const userRole = decodedPayload.role;
      return userRole;
    } catch (error) {
      console.error('Error extracting user role from token:', error);
      return null;
    }
  }
  
  const handleLogin = (role, token) => {
    localStorage.setItem('jwtToken', token);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <Router>
      <MyNavbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} userRole={userRole} />
      <div className="body-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<VerifyOTP handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup handleLogin={handleLogin} />} /> 
          <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />

          {isAuthenticated && userRole === USER_ROLE.DOCTOR && (
            <>
              <Route path="/new-patient" element={<NewPatient />} />
              <Route path="/existing-patients" element={<ExisitingPatients />} />
              <Route path="/patient/:patientId" element={<Patient />} />
              <Route path="/doctor" element={<DoctorHome />} />
              <Route path="/file/:fileId" element={<FileDetails />} />
              <Route path="/cases" element={<PatientCases />} />
              <Route path="/case-details/:caseId" element={<CaseDetailView />} />

            </>
          )}

           {isAuthenticated && userRole === USER_ROLE.PATIENT && (
            <>
              <Route path="/patient" element={<PatientHome />} />
            </>
          )}  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
