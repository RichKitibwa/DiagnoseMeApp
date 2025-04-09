import React, { useState } from "react";
import { format } from 'date-fns';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { USER_ROLE } from '../utils/Constants';
import '../App.css';
import { 
    TextField,
    MenuItem,
    Grid,
    Box,
    Paper,
    Typography,
    Snackbar,
    Alert,
    Container,
    InputAdornment,
    Button,
    CircularProgress
} from '@mui/material';
import { 
    DatePicker, 
    LocalizationProvider 
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    PersonOutline,
    WcOutlined,
    CalendarMonthOutlined,
    PhoneOutlined,
    EmailOutlined,
    MedicalInformationOutlined,
    ContactEmergencyOutlined
} from '@mui/icons-material';

function NewPatient() {
    const navigate = useNavigate();
    const [patientInfo, setPatientInfo] = useState({
        username: '',
        gender: '',
        dateOfBirth: null,
        patientPhoneNumber: '',
        email:'',
        allergies: 'None',
        chronicIllnesses: 'None',
        nextOfKinName: '',
        nextOfKinPhoneNumber: '',
    });

    const [submissionMessage, setSubmissionMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo({
            ...patientInfo,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setPatientInfo(prev => ({
            ...prev,
            dateOfBirth: date
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formattedDate = patientInfo.dateOfBirth ? 
            format(new Date(patientInfo.dateOfBirth), 'yyyy-MM-dd') : null;

        const formattedPatientInfo = {
            username: patientInfo.username,
            email: patientInfo.email,
            gender: patientInfo.gender,
            user_role: USER_ROLE.PATIENT,
            date_of_birth: formattedDate,
            patient_phone_number: patientInfo.patientPhoneNumber,
            allergies: patientInfo.allergies,
            chronic_illnesses: patientInfo.chronicIllnesses,
            next_of_kin_name: patientInfo.nextOfKinName,
            next_of_kin_phone_number: patientInfo.nextOfKinPhoneNumber,
        };
        
        setIsLoading(true);

        try {
            const response = await axios.post('/patients/create_patient', formattedPatientInfo);
            
            if (response.status === 200) {
                setPatientInfo({
                    username: '',
                    gender: '',
                    dateOfBirth: null,
                    patientPhoneNumber: '',
                    email:'',
                    allergies: 'None',
                    chronicIllnesses: 'None',
                    nextOfKinName: '',
                    nextOfKinPhoneNumber: '',
                });
                
                setSubmissionMessage('Patient added successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                
                // Navigate to the patient page after a short delay
                setTimeout(() => {
                    navigate(`/patient/${response.data.patient_id}`);
                }, 1500);
            }
        } catch (error) {
            console.error('Error during patient creation:', error.response?.data || error.message);
            setSubmissionMessage('An error occurred while adding the patient. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <div className="new-patient-container">
            <Container 
                component="main" 
                maxWidth="md" 
                className="new-patient-content"
            >
                <Paper 
                    elevation={3} 
                    className="new-patient-form-container"
                >
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500, textAlign: 'center' }}>
                        Add New Patient Information
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Patient Name"
                                    name="username"
                                    value={patientInfo.username}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Gender"
                                    name="gender"
                                    value={patientInfo.gender}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    // InputProps={{
                                    //     startAdornment: (
                                    //         <InputAdornment position="start">
                                    //             <WcOutlined />
                                    //         </InputAdornment>
                                    //     ),
                                    // }}
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date of Birth"
                                        value={patientInfo.dateOfBirth}
                                        onChange={handleDateChange}
                                        maxDate={new Date()}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: 'outlined',
                                                InputProps: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarMonthOutlined />
                                                        </InputAdornment>
                                                    ),
                                                }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="patientPhoneNumber"
                                    value={patientInfo.patientPhoneNumber}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={patientInfo.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Known Allergies"
                                    name="allergies"
                                    value={patientInfo.allergies}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MedicalInformationOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Chronic Illnesses"
                                    name="chronicIllnesses"
                                    value={patientInfo.chronicIllnesses}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MedicalInformationOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Next of Kin"
                                    name="nextOfKinName"
                                    value={patientInfo.nextOfKinName}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ContactEmergencyOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Next of Kin's Phone Number"
                                    name="nextOfKinPhoneNumber"
                                    value={patientInfo.nextOfKinPhoneNumber}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isLoading}
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                                    sx={{ 
                                        py: 1.5,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        borderRadius: 1.5,
                                        boxShadow: 2
                                    }}
                                >
                                    {isLoading ? 'Adding Patient...' : 'Add Patient'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
            
            <Snackbar
                open={openSnackbar}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                className="new-patient-snackbar"
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarSeverity} 
                    variant="filled" 
                    sx={{ width: '100%' }}
                >
                    {submissionMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default NewPatient;
