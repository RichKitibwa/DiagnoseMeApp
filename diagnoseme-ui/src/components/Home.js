import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
    });
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };
  
  const statsItems = [
    { number: '98%', text: 'Diagnostic Accuracy' },
    { number: '30%', text: 'Time Saved' },
  ];
  
  return (
    <div className='home'>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content" data-aos="fade-right" data-aos-delay="100">
              <h1 className="hero-title">Empowering Healthcare with <span className="gradient-text">Intelligent Diagnostics</span></h1>
              <p className="hero-text">
                MedAI-UG combines advanced AI algorithms with medical expertise to provide accurate, 
                data-driven diagnoses and treatment recommendations. Enhance your clinical decision-making today.
              </p>
              <div className="d-flex gap-3 mt-4">
                <Button variant="primary" size="lg" className="btn-custom" onClick={handleGetStarted} data-aos="zoom-in" data-aos-delay="300">
                  Get Started <ArrowForwardIcon fontSize="small" />
                </Button>
                <Button variant="outline-light" size="lg" className="btn-custom-outline" data-aos="zoom-in" data-aos-delay="400">
                  Watch Demo
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center" data-aos="fade-left" data-aos-delay="200">
              <div className="hero-image-wrapper">
                <img src={usingAi} alt="MedAI-UG AI Platform" className="hero-image" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row className="stats-row justify-content-center">
            {statsItems.map((stat, index) => (
              <Col md={3} sm={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="stat-card">
                  <h2 className="stat-number">{stat.number}</h2>
                  <p className="stat-text">{stat.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="section-header text-center" data-aos="fade-up">
            <span className="section-subtitle">Key Benefits</span>
            <h2 className="section-title">Why Healthcare Professionals Choose MedAI-UG</h2>
          </div>
          
          <Row className="feature-row align-items-center">
            <Col lg={6} data-aos="fade-right" data-aos-delay="100">
              <div className="feature-image-container">
                <img src={usingAi} alt="AI Suggestions" className="feature-image" />
              </div>
            </Col>
            <Col lg={6} data-aos="fade-left" data-aos-delay="200">
              <div className="feature-content">
                <div className="feature-icon">
                  <LocalHospitalIcon fontSize="large" />
                </div>
                <h3 className="feature-title">AI-Powered Diagnostic Support</h3>
                <p className="feature-description">
                  Get instant suggestions and diagnostic insights from our advanced AI algorithm trained on millions of medical cases. Our system provides evidence-based recommendations that complement your clinical expertise.
                </p>
                <ul className="feature-list">
                  <li><CheckCircleIcon className="me-2" />Evidence-based recommendations</li>
                  <li><CheckCircleIcon className="me-2" />Real-time analysis of symptoms</li>
                  <li><CheckCircleIcon className="me-2" />Continuous learning from new medical research</li>
                </ul>
              </div>
            </Col>
          </Row>
          
          <Row className="feature-row align-items-center flex-lg-row-reverse">
            <Col lg={6} data-aos="fade-left" data-aos-delay="100">
              <div className="feature-image-container">
                <img src={saveTime} alt="Save Time" className="feature-image" />
              </div>
            </Col>
            <Col lg={6} data-aos="fade-right" data-aos-delay="200">
              <div className="feature-content">
                <div className="feature-icon">
                  <AccessTimeIcon fontSize="large" />
                </div>
                <h3 className="feature-title">Efficiency and Resource Optimization</h3>
                <p className="feature-description">
                  Streamline your workflow and reduce unnecessary tests by pinpointing the most likely diagnoses. Save valuable time and resources while maintaining the highest standards of patient care.
                </p>
                <ul className="feature-list">
                  <li><CheckCircleIcon className="me-2" />30% reduction in diagnostic time</li>
                  <li><CheckCircleIcon className="me-2" />Decreased rate of unnecessary testing</li>
                  <li><CheckCircleIcon className="me-2" />More time for meaningful patient interaction</li>
                </ul>
              </div>
            </Col>
          </Row>
          
          <Row className="feature-row align-items-center">
            <Col lg={6} data-aos="fade-right" data-aos-delay="100">
              <div className="feature-image-container">
                <img src={patietSatisfaction} alt="Patient Satisfaction" className="feature-image" />
              </div>
            </Col>
            <Col lg={6} data-aos="fade-left" data-aos-delay="200">
              <div className="feature-content">
                <div className="feature-icon">
                  <HealthAndSafetyIcon fontSize="large" />
                </div>
                <h3 className="feature-title">Enhanced Patient Outcomes</h3>
                <p className="feature-description">
                  Build patient trust with more accurate diagnoses and transparent explanations. Our system helps patients understand their conditions, leading to better adherence to treatment plans.
                </p>
                <ul className="feature-list">
                  <li><CheckCircleIcon className="me-2" />Improved patient understanding</li>
                  <li><CheckCircleIcon className="me-2" />Higher treatment adherence rates</li>
                  <li><CheckCircleIcon className="me-2" />Enhanced patient satisfaction scores</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <Container>
          <div className="section-header text-center" data-aos="fade-up">
            <span className="section-subtitle">Simple Process</span>
            <h2 className="section-title">How MedAI-UG Works</h2>
            <p className="section-description">
              Our streamlined three-step process integrates seamlessly into your existing workflow
            </p>
          </div>
          
          <Row className="justify-content-center">
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-image-container">
                  <img src={enterPatientData} alt="Enter patient data" className="step-image" />
                </div>
                <h3 className="step-title">Enter Patient Data</h3>
                <p className="step-text">
                  Input patient demographics, symptoms, medical history, and test results through our intuitive interface or sync directly with your EHR system.
                </p>
              </div>
            </Col>
            
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-image-container">
                  <img src={getDiagnosis} alt="Get Diagnosis" className="step-image" />
                </div>
                <h3 className="step-title">Receive AI Analysis</h3>
                <p className="step-text">
                  Our AI processes the data and provides a ranked list of possible diagnoses with confidence scores, explanations, and supporting medical literature.
                </p>
              </div>
            </Col>
            
            <Col lg={4} md={6} className="mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-image-container">
                  <img src={confirmTreat} alt="Confirm and Treat" className="step-image" />
                </div>
                <h3 className="step-title">Review and Decide</h3>
                <p className="step-text">
                  Make your final clinical judgment with AI-supported insights, access treatment recommendations, and create detailed patient reports with just a few clicks.
                </p>
              </div>
            </Col>
          </Row>
          
          <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="400">
            <Button variant="primary" size="lg" className="btn-custom" onClick={handleGetStarted}>
              Try MedAI-UG Now <ArrowForwardIcon fontSize="small" />
            </Button>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} className="text-center" data-aos="fade-up">
              <div className="cta-content">
                <h2 className="cta-title">Ready to Transform Your Practice?</h2>
                <p className="cta-text">
                  Join thousands of healthcare professionals who have enhanced their diagnostic capabilities with MedAI-UG.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button variant="light" size="lg" className="btn-custom-outline-dark" onClick={handleGetStarted} data-aos="zoom-in" data-aos-delay="100">
                    Start Free Trial
                  </Button>
                  <Button variant="primary" size="lg" className="btn-custom" onClick={handleGetStarted} data-aos="zoom-in" data-aos-delay="200">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row className="pb-4">
            <Col lg={4} md={6} className="mb-4" data-aos="fade-right" data-aos-delay="100">
              <div className="footer-brand">
                <h3 className="footer-logo">MedAI-UG</h3>
                <p className="footer-description">
                  Revolutionizing healthcare diagnostics with artificial intelligence to provide better patient outcomes.
                </p>
              </div>
              <div className="footer-social">
                <a href="#twitter" className="social-link">
                  <TwitterIcon />
                </a>
                <a href="#facebook" className="social-link">
                  <FacebookIcon />
                </a>
                <a href="#linkedin" className="social-link">
                  <LinkedInIcon />
                </a>
                <a href="#instagram" className="social-link">
                  <InstagramIcon />
                </a>
              </div>
            </Col>
            
            <Col lg={2} md={6} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="150">
              <h5 className="footer-heading">Product</h5>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#demo">Request Demo</a></li>
              </ul>
            </Col>
            
            <Col lg={2} md={6} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </Col>
            
            <Col lg={2} md={6} sm={6} className="mb-4" data-aos="fade-up" data-aos-delay="250">
              <h5 className="footer-heading">Resources</h5>
              <ul className="footer-links">
                <li><a href="#help">Help Center</a></li>
                <li><a href="#support">Support</a></li>
                <li><a href="#documentation">Documentation</a></li>
                <li><a href="#api">API</a></li>
              </ul>
            </Col>
            
            <Col lg={2} md={6} sm={6} className="mb-4" data-aos="fade-left" data-aos-delay="300">
              <h5 className="footer-heading">Legal</h5>
              <ul className="footer-links">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#compliance">Compliance</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </Col>
          </Row>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} MedAI-UG. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
