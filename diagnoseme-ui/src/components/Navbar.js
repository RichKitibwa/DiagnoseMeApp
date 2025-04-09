import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './Logout';
import { USER_ROLE } from '../utils/Constants';
import '../App.css';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArticleIcon from '@mui/icons-material/Article';

const MyNavbar = ({isAuthenticated, handleLogout, userRole}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const role = localStorage.getItem('role');

  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamic navbar classes based on scroll state and current page
  let navbarClasses = 'navbar-custom';
  
  if (isHome || isAuthPage) {
    navbarClasses += scrolled 
      ? ' navbar-scrolled navbar-light' 
      : ' navbar-transparent navbar-light';
  } else {
    navbarClasses += scrolled 
      ? ' navbar-scrolled navbar-light' 
      : ' navbar-light navbar-elevated';
  }

  // Handle navbar link click to close mobile menu
  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      className={navbarClasses}
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container fluid="md">
        <Navbar.Brand as={Link} to="/" className="brand-logo" onClick={handleNavLinkClick}>
          <LocalHospitalIcon className="brand-icon" />
          <span className="brand-text">
            <span className="brand-text-diagnose">MedAI</span>
            <span className="brand-text-me">UG</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {isAuthenticated ? (
              userRole === USER_ROLE.PATIENT ? (
                <>
                  <Nav.Link as={Link} to="/view-reports" className="nav-link-custom" onClick={handleNavLinkClick}>
                    <ArticleIcon className="nav-icon" /> <span className="nav-text">View Reports</span>
                  </Nav.Link>
                  <div onClick={handleNavLinkClick}>
                    <LogoutButton handleLogout={handleLogout} />
                  </div>
                </>
              ) : userRole === USER_ROLE.DOCTOR ? (
                <>
                  <Nav.Link as={Link} to="/doctor" className="nav-link-custom" onClick={handleNavLinkClick}>
                    <DashboardIcon className="nav-icon" /> <span className="nav-text">Dashboard</span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/existing-patients" className="nav-link-custom" onClick={handleNavLinkClick}>
                    <PeopleIcon className="nav-icon" /> <span className="nav-text">Patients</span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/new-patient" className="nav-link-custom" onClick={handleNavLinkClick}>
                    <PersonAddIcon className="nav-icon" /> <span className="nav-text">New Patient</span>
                  </Nav.Link>
                  <div onClick={handleNavLinkClick}>
                    <LogoutButton handleLogout={handleLogout} />
                  </div>
                </>
              ) : null
            ) : (
              <>
                <Nav.Link as={Link} to="/signup" className="nav-link-custom my-2 my-lg-0" onClick={handleNavLinkClick}>Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-btn-link my-2 my-lg-0" onClick={handleNavLinkClick}>
                  <Button variant="primary" className="nav-login-btn">Log In</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
