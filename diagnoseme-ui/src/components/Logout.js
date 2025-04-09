import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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
      size="sm" 
      className="nav-link-custom"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
