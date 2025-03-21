import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import DoctorSideNav from "./DoctorSideNav";
import { USER_ROLE } from '../utils/Constants';

function NewPatient() {
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
        console.log('Formatted Patient Info:', formattedPatientInfo);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('/patients/create_patient', formattedPatientInfo, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
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
            }
        } catch (error) {
            console.error('Error during patient creation:', error.response?.data || error.message);
            setSubmissionMessage('An error occurred while adding the patient. Please try again.');
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
                    <Row>
                        <div className="col-md-6 offset-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="card-title">Add New Patient Information</h2>
                                    {submissionMessage && (
                                        <div className="alert alert-info" role="alert">
                                            {submissionMessage}
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label">
                                                Patient Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                name="username"
                                                value={patientInfo.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="gender" className="form-label">
                                                Gender
                                            </label>
                                            <select
                                                className="form-select"
                                                id="gender"
                                                name="gender"
                                                value={patientInfo.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled hidden>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dateOfBirth" className="form-label">
                                                Date of Birth
                                            </label>
                                            <DatePicker
                                                  selected={patientInfo.dateOfBirth}
                                                  onChange={handleDateChange}
                                                  className="form-control"
                                                  dateFormat="yyyy-MM-dd"
                                                  maxDate={new Date()}
                                                  showMonthDropdown
                                                  showYearDropdown
                                                  showIcon
                                                  dropdownMode="select"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="patientPhoneNumber" className="form-label">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="patientPhoneNumber"
                                                name="patientPhoneNumber"
                                                value={patientInfo.patientPhoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email
                                            </label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                name="email"
                                                placeholder="Email" 
                                                value={patientInfo.email} 
                                                onChange={handleChange} 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="allergies" className="form-label">
                                                Known Allergies
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="allergies"
                                                name="allergies"
                                                value={patientInfo.allergies}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="chronicIllnesses" className="form-label">
                                                Chronic Illnesses
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="chronicIllnesses"
                                                name="chronicIllnesses"
                                                value={patientInfo.chronicIllnesses}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="nextOfKinName" className="form-label">
                                                Next of Kin
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nextOfKinName"
                                                name="nextOfKinName"
                                                value={patientInfo.nextOfKinName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="nextOfKinPhoneNumber" className="form-label">
                                                Next of Kin's Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="nextOfKinPhoneNumber"
                                                name="nextOfKinPhoneNumber"
                                                value={patientInfo.nextOfKinPhoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary text-center" disabled={isLoading}>
                                            {isLoading ? 'Adding Patient...' : 'Add Patient'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Col>    
            </Row>                   
        </Container>
    );
}

export default NewPatient;
