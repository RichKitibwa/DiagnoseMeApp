import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import '../App.css';

const DoctorSideNav = ({ onLinkClick }) => {
    return (
        <Nav className="flex-column sidebar-card">
            <Link to="/doctor" onClick={onLinkClick} className="nav-link">
                <HomeIcon /> Home
            </Link>
            <Link to="/new-patient" onClick={onLinkClick} className="nav-link">
                <PersonAddAlt1Icon /> New Patient
            </Link>
            <Link to="/existing-patients" onClick={onLinkClick} className="nav-link">
                <RemoveRedEyeIcon /> Existing Patients
            </Link>
            <Link to="/cases" onClick={onLinkClick} className="nav-link">
                <AssignmentIndIcon /> Patient Cases
            </Link>
        </Nav>
    );
};

export default DoctorSideNav;
