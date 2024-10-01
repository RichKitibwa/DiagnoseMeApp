import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import '../App.css';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import usingAi from '../images/using_ai.jpg';
import saveTime from '../images/save_time.jpg';
import patietSatisfaction from '../images/patient_satisfaction.jpg';
import confirmTreat from '../images/confirm_treat.jpg';
import enterPatientData from '../images/enter_patient_data.jpg';
import getDiagnosis from '../images/get_diagnosis.jpg';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const Home = () => {
  return (
    <div className='home'>
      <Container fluid className="hero-container background-image">
        <Row className="align-items-center justify-content-start">
          <Col md={6}>
            <h1 className="title">Empowering Healthcare with AI</h1>
            <p className="intro-text">
              Introducing DiagnoseMe, an innovative AI-driven solution enhancing
              medical expertise for accurate, data-driven patient care and
              diagnosis.
            </p>
            <Button variant="primary" size="lg" className="cta-button">
              Get Started Now
            </Button>
          </Col>
        </Row>
      </Container>
      <Container className="feature-container">
        <Row className="feature-row">
          <Col md={6} className="feature-text-col">
            <h2>Get instant feedback and suggestions from our AI algorithm</h2>
          </Col>
          <Col md={6} className="feature-img-col">
            <img src={usingAi} alt="Get suggestions" className="feature-image" />
          </Col>
        </Row>
        <Row className="feature-row">
          <Col md={6} className="feature-img-col">
            <img src={saveTime} alt="Save time" className="feature-image" />
          </Col>
          <Col md={6} className="feature-text-col">
            <h2>Save time and resources by reducing errors and unnecessary tests</h2>
          </Col>
        </Row>
        <Row className="feature-row">
          <Col md={6} className="feature-text-col">
            <h2>Enhance patient satisfaction and trust</h2>
          </Col>
          <Col md={6} className="feature-img-col">
            <img src={patietSatisfaction} alt="Patient satisfaction" className="feature-image" />
          </Col>
        </Row>
      </Container>
      <Container fluid className="how-it-works-container">
        <Row>
          <Col>
            <h2 className="how-it-works-title">How It Works</h2>
          </Col>
        </Row>
        <Row className="center-step-cards">
          <Col md={3} className="step-card">
            <img src={enterPatientData} alt="Enter patient data" className="step-image" />
            <h3 className="step-title">Step 1: Enter Patient Data</h3>
            <p className="step-text">
              Fill in the patient's basic information, medical history,
              symptoms, and any relevant test results.
            </p>
          </Col>
          <Col md={3} className="step-card">
            <img src={getDiagnosis} alt="Get Diagnosis" className="step-image" />
            <h3 className="step-title">Step 2: Get a Diagnosis</h3>
            <p className="step-text">
              Our AI algorithm will analyze the patient data and provide you with a
              list of possible diagnoses, along with their explanations.
            </p>
          </Col>
          <Col md={3} className="step-card">
            <img src={confirmTreat} alt="Confirm and Treat" className="step-image" />
            <h3 className="step-title">Step 3: Confirm and Treat</h3>
            <p className="step-text">
              Review the preliminary diagnosis. You can also get treatment recommendations and follow-up
              actions from our AI algorithm.
            </p>
          </Col>
        </Row>
      </Container>
      <Container fluid className="footer-container">
        <Row>
          {/* <Col md={4}>
            <div className="footer-logo">
              <img src="" alt="Logo image" className="logo-image" />
              <span className="logo-text">DiagnoseMe</span>
            </div>
          </Col> */}
          <Col md={6}>
            <div className="footer-links">
              <a href="#about" className="footer-link">
                About
              </a>
              <a href="#contact" className="footer-link">
                Contact
              </a>
              <a href="#privacy" className="footer-link">
                Privacy
              </a>
            </div>
          </Col>
          <Col md={6} className="d-flex justify-content-end footer-social">
            <a href="#facebook" className="footer-social-link">
                <TwitterIcon className="social-icon" />
            </a>
            <a href="#twitter" className="footer-social-link">
              <FacebookIcon className="social-icon" />
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
