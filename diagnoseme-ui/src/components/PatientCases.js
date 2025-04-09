import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Container, Table, Button } from 'react-bootstrap';
import DoctorSideNav from "./DoctorSideNav";
import { formatDate } from "../utils/FormatDate";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const PatientCases = () => {
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCases = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('/api/cases', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });    
                setCases(response.data);
                } catch (error) {
                    console.error('Error fetching cases', error);
                } finally {
                    setIsLoading(false);
            }
        };
        fetchCases();
    }, []);

    const handleCaseClick = (caseId) => {
        navigate(`/case-details/${caseId}`)
    };

    return (
        <Container fluid className="view-container">
            <Row>
                <Col md={3} lg={2} className="d-none d-lg-block sidebar">
                    <DoctorSideNav />
                </Col>
                <Col md={9} lg={10}>
                    <h2 className="my-4">Patient Cases</h2>
                    {cases.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Date Opened</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.map((c) => (
                                    <tr key={c.caseId}>
                                        <td>{c.patientName}</td>
                                        <td>{formatDate(c.caseCreationDate)}</td>
                                        <td>{c.caseStatus}</td>
                                        <td>
                                            <Button variant="primary" size="sm" onClick={() => handleCaseClick(c.caseId)}>
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="no-cases-message">
                            No Cases yet.
                        </p>
                    )}
                </Col>
            </Row>
        </Container>    
    );
};

export default PatientCases;
