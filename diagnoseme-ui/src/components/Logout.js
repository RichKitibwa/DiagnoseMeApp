import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    try {
      // Clear all localStorage items
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('role');
      
      // Call parent logout handler
      handleLogout();
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Button 
      onClick={handleLogoutClick} 
      variant="outline-danger" 
      className="logout-btn nav-link-custom"
    >
      <LogoutIcon /> <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
