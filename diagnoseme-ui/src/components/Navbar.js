import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './Logout';
import { USER_ROLE } from '../utils/Constants';
import DoctorSideNav from './DoctorSideNav';
import PatientSideNav from './PatientSideNav';
import '../App.css';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const MyNavbar = ({isAuthenticated, handleLogout, userRole}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [scrolled, setScrolled] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const toggleDrawer = () => setShowDrawer(!showDrawer);
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

  return (
    <>
      <Navbar 
        className={navbarClasses}
        expand="lg"
        fixed="top"
      >
        <Container>
          {isAuthenticated && (
            <Button variant="outline-none" onClick={toggleDrawer} className="me-2 d-lg-none navbar-menu-btn">
              <span className="navbar-toggler-icon"></span>
            </Button>
          )}
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <LocalHospitalIcon className="brand-icon" />
            <span className="brand-text">
              <span className="brand-text-diagnose">Diagnose</span>
              <span className="brand-text-me">Me</span>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                userRole === USER_ROLE.PATIENT ? (
                  <>
                    <Nav.Link as={Link} to="/view-reports" className="nav-link-custom">View Reports</Nav.Link>
                    <LogoutButton handleLogout={handleLogout} />
                  </>
                ) : userRole === USER_ROLE.DOCTOR ? (
                  <>
                    <Nav.Link as={Link} to="/pending-reports" className="nav-link-custom">Pending Reports</Nav.Link>
                    <LogoutButton handleLogout={handleLogout} />
                  </>
                ) : null
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup" className="nav-link-custom">Sign Up</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="nav-btn-link">
                    <Button variant="primary" className="nav-login-btn">Log In</Button>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={showDrawer} onHide={toggleDrawer} className="custom-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="brand-logo-small">
              <LocalHospitalIcon className="brand-icon" />
              <span className="brand-text">
                <span className="brand-text-diagnose">Diagnose</span>
                <span className="brand-text-me">Me</span>
              </span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isAuthenticated && role === USER_ROLE.DOCTOR ?
            <DoctorSideNav onLinkClick={toggleDrawer}/> : 
            <PatientSideNav onLinkClick={toggleDrawer}/>}
        </Offcanvas.Body>
      </Offcanvas>
    </>  
  );
}

export default MyNavbar;
