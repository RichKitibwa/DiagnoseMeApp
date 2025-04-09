import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import '../App.css';

const PatientSideNav = ({ onLinkClick }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Nav className="flex-column sidebar-card">
            <Link 
                to="/patient" 
                onClick={onLinkClick} 
                className={`nav-link ${currentPath === '/patient' ? 'active' : ''}`}
            >
                <HomeIcon className="nav-icon" /> <span className="nav-link-text">Dashboard</span>
            </Link>
            <Link 
                to="/view-reports" 
                onClick={onLinkClick} 
                className={`nav-link ${currentPath === '/view-reports' ? 'active' : ''}`}
            >
                <DescriptionIcon className="nav-icon" /> <span className="nav-link-text">View Reports</span>
            </Link>
            <Link 
                to="/history" 
                onClick={onLinkClick} 
                className={`nav-link ${currentPath === '/history' ? 'active' : ''}`}
            >
                <HistoryIcon className="nav-icon" /> <span className="nav-link-text">Medical History</span>
            </Link>
        </Nav>
    );
};

export default PatientSideNav;
