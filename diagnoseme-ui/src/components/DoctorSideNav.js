import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import '../App.css';

const DoctorSideNav = ({ onLinkClick }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Nav className="flex-column sidebar-card">
            <Link 
                to="/doctor" 
                onClick={onLinkClick} 
                className={`nav-link ${currentPath === '/doctor' ? 'active' : ''}`}
            >
                <HomeIcon className="nav-icon" /> <span className="nav-link-text">Dashboard</span>
            </Link>
            <Link 
                to="/existing-patients" 
                onClick={onLinkClick} 
                className={`nav-link ${currentPath === '/existing-patients' ? 'active' : ''}`}
            >
                <PeopleIcon className="nav-icon" /> <span className="nav-link-text">Patients</span>
            </Link>
            <Link 
                to="/new-patient" 
                onClick={onLinkClick} 
                className={`nav-link ${currentPath === '/new-patient' ? 'active' : ''}`}
            >
                <PersonAddIcon className="nav-icon" /> <span className="nav-link-text">New Patient</span>
            </Link>
        </Nav>
    );
};

export default DoctorSideNav;
