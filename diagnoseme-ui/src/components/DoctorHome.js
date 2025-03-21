import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DoctorSideNav from './DoctorSideNav';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import '../App.css';

const DoctorHome = () => {

  // const [files, setFiles] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const navigate = useNavigate();

  // const handleFileClick = (fileId) => {
  //   navigate(`/file/${fileId}`);
  // };
  const role = localStorage.getItem('role');
  console.log(role);

  useEffect(() => {
    const fetchPatientCount = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('/patients/get_patients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const count = response.data?.length || 0;
        setPatientCount(count);
      } catch (error) {
        console.error('Failed to fetch patient count', error);
        setPatientCount(0);
      }
    };

    fetchPatientCount();
  }, []);

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const token = localStorage.getItem('jwtToken');
  //       const response = await axios.get('/api/files/file', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       console.log(response.data);
  //       setFiles(response.data);
  //     } catch (error) {
  //       console.error('Error fetching files:', error);
  //     }
  //   };

  //   fetchFiles();
  // }, []);

  return (
    <Container fluid className="view-container">
        <Row className="gx-0">
            <Col xs={12} md={4} lg={2} className="d-none d-lg-block sidebar">
                <DoctorSideNav />
            </Col>
            <Col xs={12} md={8} lg={10} className="px-md-4 welcome-doctor">
              <div className="welcome-section">
                <div className="doctor-home-content">
                  <h2>Welcome, Doctor!</h2>
                  <p>Manage your patients effectively using our data-driven algorithms</p>
                  <Row>
                    <Col md={6} lg={3} className="mb-4">
                      <Card className="text-center card-shadow">
                        <Card.Body>
                          <Card.Title>Patients</Card.Title>
                          <Card.Text>{patientCount}</Card.Text>
                          <Button variant="outline-primary" onClick={() => navigate('/new-patient')}>Add Patient</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                      <Card className="text-center card-shadow">
                        <Card.Body>
                          <Card.Title>Open Cases</Card.Title>
                          <Card.Text>0</Card.Text>
                          <Button variant="outline-secondary" onClick={() => navigate('/cases')}>View Cases</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>  
                  <Row>
                  
                  </Row>
                </div>
              </div>
            </Col>
        </Row>  
    </Container> 
  );
};
  
export default DoctorHome;
