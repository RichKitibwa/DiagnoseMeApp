import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import DoctorSideNav from './DoctorSideNav';
import '../App.css';
import { Col, Row, Container, Table, InputGroup, FormControl } from 'react-bootstrap';
import { formatDate } from '../utils/FormatDate';

const ExisitingPatients = () => {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchPatient, setSearchPatient] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('/api/patients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });    
                console.log(response.data)
                setPatients(response.data);
                } catch (error) {
                    console.error('Error fetching patients', error);
                } finally {
                    setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handlePatientClick = (patientId) => {
        navigate(`/patient/${patientId}`)
    }

    const filteredPatients = searchPatient.length > 0
        ? patients.filter(patient => 
            patient.username.toLowerCase().includes(searchPatient.toLowerCase()))
        : patients;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

    return (
        <Container fluid className="view-container">
            <Row>
                <Col md={3} lg={2} className="d-none d-lg-block sidebar">
                    <DoctorSideNav />
                </Col>
                <Col md={9} lg={10}>
                    <h2 className="my-4">Patients</h2>
                    <div className="d-flex justify-content-end mb-3">
                        <InputGroup className="mb-3 search-patient style={{ width: '300px' }}">
                            <FormControl
                                placeholder="Search by name..."
                                aria-label="Search by name"
                                value={searchPatient}
                                onChange={(e) => setSearchPatient(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                    {currentItems.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Date Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems
                                    .map((patient) => (
                                        <tr key={patient.id} onClick={() => handlePatientClick(patient.id)} className="patient-details">
                                            <td>{patient.username}</td>
                                            <td>{formatDate(patient.createdDate)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p style={{ marginTop: 20 }}>
                            No patients added yet, please add patients.
                        </p>
                    )}
                </Col>
            </Row>  
            <Row className="justify-content-center">
                <Col md={12}>
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#!" onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(i + 1);
                                    }}>
                                        {i + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </Col>
            </Row>
        </Container>         
    );
};

export default ExisitingPatients;
