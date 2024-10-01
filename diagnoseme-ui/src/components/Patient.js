import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {calculateAge} from '../utils/CalculateAge';
import CircularProgress from '@mui/material/CircularProgress';
import { Col, Container, Row } from 'react-bootstrap';
import DoctorSideNav from './DoctorSideNav';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import '../App.css';

const Patient = () => {
    const { patientId } = useParams();
    const [patientDetails, setPatientDetails] = useState({});
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [medGptSuggestions, setMedGptSuggestions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`/api/patient/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const patientData = response.data;
                patientData.age =  calculateAge(patientData.dateOfBirth);
                setPatientDetails(patientData);
            } catch (error) {
                console.error('Error fetching patient details', error);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    const handleGenerateDiagnosis = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('jwtToken');
            const {dateOfBirth, gender, allergies, chronicIllnesses} = patientDetails;

            const patientInfo = {
                dateOfBirth,
                gender,
                allergies,
                chronicIllnesses
            };

            const response = await axios.post('/api/generate-diagnosis', {
                patientId,
                patientInfo,
                clinicalNotes
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMedGptSuggestions(response.data);
            setClinicalNotes('');
        } catch (error) {
            console.log('Error Generating Diagnosis', error);
        } finally {
            setIsLoading(false);
        }
    }; 

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleSubmit = () => {

    };

    const handleClear = () => {
        setClinicalNotes('');
        setMedGptSuggestions('');
    };

    return (
        <Container fluid className="view-container">
             <Row>
                <Col  md={3} lg={2} className="d-none d-lg-block sidebar">
                    <DoctorSideNav />
                </Col>
                <Col  md={9} lg={10} className="">
                    <Box sx={{ margin: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Patient Details
                        </Typography>
                        <Typography variant="subtitle1">
                            Name: {patientDetails.username} - Age: {patientDetails.age} - Gender: {patientDetails.gender} -  
                            Allergies: {patientDetails.allergies}
                        </Typography>

                        <Card variant="outlined" sx={{ marginTop: 2 }}>
                            <CardContent>
                                <label htmlFor="raised-button-file" style={{ marginBottom: '16px', display: 'block' }}>
                                    <Button variant="contained" color="primary" component="span" startIcon={<PhotoCamera />}>
                                        Upload Images
                                    </Button>
                                </label>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleImageChange}
                                />  
                                <TextField
                                    label="Clinical Notes"
                                    multiline
                                    rows={6}
                                    fullWidth
                                    value={clinicalNotes}
                                    onChange={(e) => setClinicalNotes(e.target.value)}
                                    variant="outlined"
                                    margin="normal" 
                                />

                                <Button variant="contained" color="primary" onClick={handleGenerateDiagnosis} disabled={isLoading}>
                                    {isLoading ? <CircularProgress size={24} /> : "Generate Preliminary Diagnosis"}
                                </Button>
                                {selectedImage && <span style={{ marginTop: 8 }}>{selectedImage.name}</span>}
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ marginTop: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Suggestions
                                </Typography>
                                <Typography variant="body1">{medGptSuggestions || 'No suggestions yet.'}</Typography>
                            </CardContent>
                        </Card>

                        <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="outlined" onClick={handleClear}>
                                Clear
                            </Button>
                        </Box>
                    </Box>
                </Col>
            </Row>
        </Container>            
    );
};

export default Patient;
