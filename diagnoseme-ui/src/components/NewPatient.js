import React, { useState } from "react";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import DoctorSideNav from "./DoctorSideNav";

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
        setPatientInfo({
            ...patientInfo,
            dateOfBirth: date,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formattedPatientInfo = {
            ...patientInfo,
            dateOfBirth: patientInfo.dateOfBirth ? patientInfo.dateOfBirth.toISOString().split('T')[0] : null,
        };
        setIsLoading(true);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('/api/add-patient', formattedPatientInfo, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("token", token)
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
            setSubmissionMessage('An error occurred while adding the patient. Please try again.');
        } finally {
            setIsLoading(false);
        }
        console.log('Form data submitted:', patientInfo);
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
                                            <ReactDatePicker
                                                  selected={patientInfo.dateOfBirth}
                                                  onChange={handleDateChange}
                                                  className="form-control"
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
