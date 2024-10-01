import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs } from 'react-bootstrap';
import DoctorSideNav from './DoctorSideNav';
import '../App.css';
import { formatDate } from '../utils/FormatDate';

const CaseDetailView = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const [caseDetails, setCaseDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCase = async ()=> {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`/api/case/${caseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });    
                setCaseDetails(response.data);
                } catch (error) {
                    console.error('Error fetching cases', error);
                } finally {
                    setIsLoading(false);
            }
        };
        fetchCase();
    }, [caseId]);

    if (isLoading) {
        return <div>Loading Case Details...</div>;
    }

    if (!caseDetails) {
        return <div>No case details available.</div>;
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();

    };

    return (
        <Container fluid className="view-container">
            <Row>
                <Col md={3} lg={2} className="d-none d-lg-block sidebar">
                    <DoctorSideNav />
                </Col>

                <Col md={9} lg={10}>
                    <h1 className="my-4">Case Details: {caseDetails.patientName}</h1>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Patient Information</Card.Title>
                            <p>Name: {caseDetails.patientName}</p>
                            <p>Gender: {caseDetails.gender}</p>
                            <p>Date of Birth: {formatDate(caseDetails.dateOfBirth)}</p>
                            <p>Email: {caseDetails.email}</p>
                            <p>Phone Number: {caseDetails.patientPhoneNumber}</p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Medical History</Card.Title>
                            <p>Allergies: {caseDetails.allergies || 'None'}</p>
                            <p>Chronic Illnesses: {caseDetails.chronicIllnesses || 'None'}</p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Initial Diagnosis</Card.Title>
                            <p>{caseDetails.diagnosis}</p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Medication and Treatment</Card.Title>
                            <Form onSubmit={handleFormSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Medication</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Enter medication" />
                                </Form.Group>
                                <Button type="submit" variant="primary">Update Case</Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Additional Notes</Card.Title>
                            <Form.Group className="mb-3">
                                <Form.Control as="textarea" rows={3} placeholder="Enter any additional notes" />
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <div className="d-grid gap-2">
                        <Button variant="success" size="lg" type="submit">
                            Save All Changes
                        </Button>
                        <Button variant="danger" size="lg">
                            Close Case
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CaseDetailView;
