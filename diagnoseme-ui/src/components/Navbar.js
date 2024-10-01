import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import {Navbar, Nav, Button, Offcanvas} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './Logout';
import { USER_ROLE } from '../utils/Constants';
import DoctorSideNav from './DoctorSideNav';
import PatientSideNav from './PatientSideNav';
import '../App.css';

const MyNavbar = ({isAuthenticated, handleLogout, userRole}) => {
  const location = useLocation();
  const isTransparent = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';
  const [showDrawer, setShowDrawer] = useState(false);
  const toggleDrawer = () => setShowDrawer(!showDrawer);
  const role = localStorage.getItem('role');

  return (
    <>
      <Navbar 
        bg={isTransparent ? 'transparent' : 'light'}
        variant={isTransparent ? 'dark' : 'light'}
        expand="lg"
        fixed="top"
      >
        <Container>
          {isAuthenticated && (
              <Button variant="outline-none" onClick={toggleDrawer} className="me-2 d-lg-none">
                <span className="navbar-toggler-icon"></span>
              </Button>
          )}
          <Navbar.Brand as={Link} to="/">DiagnoseMe</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                userRole === USER_ROLE.PATIENT ? (
                  <>
                    <Nav.Link as={Link} to="/view-reports">View Reports</Nav.Link>
                    
                    <LogoutButton handleLogout={handleLogout} />
                  </>
                ) : userRole === USER_ROLE.DOCTOR ? (
                  <>
                    <Nav.Link as={Link} to="/pending-reports">Pending Reports</Nav.Link>
                    <LogoutButton handleLogout={handleLogout} />
                  </>
                ) : null
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={showDrawer} onHide={toggleDrawer} className="custom-offcanvas">
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
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
