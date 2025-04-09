import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Divider, IconButton, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {calculateAge} from '../utils/CalculateAge';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from "@mui/icons-material/Send";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Col, Container, Row } from 'react-bootstrap';
import formatResponse from '../utils/formatResponse';
import '../App.css';

const Patient = () => {
    const { patientId } = useParams();
    const [patientDetails, setPatientDetails] = useState({});
    const [chatHistory, setChatHistory] = useState([]);
    const [currentInput, setCurrentInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`/patients/patient/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const patientData = response.data;
                patientData.age =  calculateAge(patientData.date_of_birth);
                setPatientDetails(patientData);
            } catch (error) {
                console.error('Error fetching patient details', error);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    const handleSendMessage = async () => {
        if (!currentInput.trim()) return;
    
        try {
          setIsLoading(true);
          const token = localStorage.getItem("jwtToken");
          const formattedChatHistory = chatHistory
            .map((chat) => `${chat.user}: ${chat.message}`)
            .join("\n");
    
          const response = await axios.post(
            "/diagnosis/diagnose",
            {
              query: currentInput,
              patient_data: {
                gender: patientDetails.gender,
                date_of_birth: patientDetails.date_of_birth,
                allergies: patientDetails.allergies || "None",
                chronic_illnesses: patientDetails.chronic_illnesses || "None",
              },
              chat_history: formattedChatHistory,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
    
          const newMessage = {
            user: "Doctor",
            message: currentInput,
          };
    
          const modelResponse = {
            user: "Model",
            message: response.data.model_response,
          };
    
          setChatHistory((prev) => [...prev, newMessage, modelResponse]);
          setCurrentInput("");
        } catch (error) {
          console.error("Error generating diagnosis", error);
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <Container fluid className="view-container">
             <Row>
                <Col>
                    <Box className="patient-details-container">
                        <Card variant="outlined" className="patient-card">
                            <CardContent>
                                <Typography variant="h5">Patient Details</Typography>
                                <Divider className="patient-divider" />
                                <Typography variant="body1">
                                <strong>Name:</strong> {patientDetails.username}
                                </Typography>
                                <Typography variant="body1">
                                <strong>Age:</strong> {patientDetails.age || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                <strong>Gender:</strong> {patientDetails.gender || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                <strong>Allergies:</strong> {patientDetails.allergies || "None"}
                                </Typography>
                                <Typography variant="body1">
                                <strong>Chronic Illnesses:</strong> {patientDetails.chronic_illnesses || "None"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>    

                    <Box className="patient-chat-container">
                        <Box className="patient-chat-messages">
                            {chatHistory.map((chat, index) => (
                            chat.user === "Doctor" ? (
                            <Box
                                key={index}
                                className="doctor-message-container"
                            >
                                <Box className="doctor-message">
                                    <Typography variant="body1">{chat.message}</Typography>
                                </Box>
                            </Box>
                            ) : (
                            <Box
                                key={index}
                                className="model-message-container"
                            >
                                <Typography variant="body1">
                                    {formatResponse(chat.message)}
                                </Typography>
                            </Box>
                            )
                            ))}
                        </Box>
                    </Box>
                    
                    <Box className="message-input-container">
                        <IconButton color="primary" component="label">
                            <PhotoCamera />
                            <input
                                type="file"
                                hidden
                                onChange={(event) => console.log(event.target.files[0])}
                            />
                        </IconButton>

                        <TextField
                            placeholder="Enter clinical notes or questions"
                            multiline
                            maxRows={5}
                            fullWidth
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            disabled={isLoading}
                            className="message-input"
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />

                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={isLoading} 
                        >
                            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                        </IconButton>
                    </Box>

                    <Typography
                        variant="caption"
                        className="patient-disclaimer"
                    >
                        This assessment is to support, not replace, the doctor's clinical judgment.
                    </Typography>
                </Col>
            </Row>
        </Container>            
    );
};

export default Patient;
