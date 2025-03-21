import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Divider, IconButton } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {calculateAge} from '../utils/CalculateAge';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from "@mui/icons-material/Send";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Col, Container, Row } from 'react-bootstrap';
import DoctorSideNav from './DoctorSideNav';
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
                <Col  md={3} lg={2} className="d-none d-lg-block sidebar">
                    <DoctorSideNav />
                </Col>
                <Col  md={9} lg={10} className="">
                    <Box sx={{ margin: 2 }}>
                        <Card variant="outlined" sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h5">Patient Details</Typography>
                                <Divider sx={{ marginY: 2 }} />
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

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100vh",
                                overflow: "hidden",
                            }}
                            >
                            <Box
                                sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                padding: "20px",
                                marginBottom: "80px",
                                }}
                            >
                                {chatHistory.map((chat, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: chat.user === "Doctor" ? "flex-end" : "flex-start",
                                        marginBottom: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: "70%",
                                            padding: 2,
                                            borderRadius: 10,
                                            backgroundColor:
                                            chat.user === "Doctor" ? "#e0f7fa" : "#f5f5f5",
                                            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                    <Typography
                                            variant="body2"
                                            sx={{
                                            fontWeight: "bold",
                                            color: chat.user === "Doctor" ? "#00796b" : "#000",
                                            marginBottom: 1,
                                            }}
                                        >
                                            {chat.user}
                                        </Typography>
                                        {chat.user === "Model" ? (
                                            formatResponse(chat.message)
                                        ) : (
                                            <Typography variant="body1">{chat.message}</Typography>
                                        )}
                                    </Box>
                                </Box>
                                ))}
                            </Box>

                            <Box
                                sx={{
                                    position: "fixed",
                                    bottom: 40,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "70%",
                                    maxWidth: "900px",
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: 30,
                                    padding: "5px 15px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    zIndex: 2,
                                }}
                            >
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
                                    sx={{
                                        backgroundColor: "transparent",
                                        flexGrow: 1,
                                        fontSize: "16px",
                                        border: "none",
                                        outline: "none",
                                        padding: "5px 0",
                                    }}
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
                                sx={{
                                position: "fixed",
                                bottom: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                color: "gray",
                                textAlign: "center",
                                paddingBottom: "10px",
                                }}
                            >
                                This assessment is to support, not replace, the doctor's clinical judgment.
                            </Typography>     
                    </Box>
                </Col>
            </Row>
        </Container>            
    );
};

export default Patient;
