import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LogoutButton = ({ handleLogout }) => {

  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      localStorage.removeItem('token');
      handleLogout();
      navigate('/');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Link className="nav-link" onClick={handleLogoutClick}>Logout</Link>
  );
};

export default LogoutButton;
