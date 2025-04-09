import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import '../App.css';
import { useNavigate } from 'react-router';
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Box, 
  Paper, 
  Typography, 
  Container, 
  FormHelperText,
  Alert,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  PersonOutline, 
  EmailOutlined, 
  MedicalServicesOutlined, 
  LocationOnOutlined,
  LockOutlined 
} from '@mui/icons-material';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [clinic, setClinic] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.post('/auth/signup', {
          username,
          email,
          user_role: role,
          registration_number: role === 'DOCTOR' ? registrationNumber : undefined,
          clinic: role === 'DOCTOR' ? clinic : undefined,
          location: role === 'DOCTOR' ? location : undefined,
          password
        });

        navigate('/verify', {state: { userId: response.data.user_id, role: response.data.user_role }}); 
      } catch (error) {
        if (error.response) {
          console.error("Error during signup:", error.response.data);
          setError(error.response.data.detail ? 
            (typeof error.response.data.detail === 'object' ? 
              JSON.stringify(error.response.data.detail) : 
              error.response.data.detail) : 
            'Signup failed. Please try again.');
        } else {
          console.error("Error during signup:", error);
          setError('Network or server error. Please try again later.');
        }
      } finally {
          setIsLoading(false);
      }
    };

    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  return (
    <Box className='register'>
      <Container maxWidth="sm" className="signup-container">
        <Paper elevation={6} className="signup-paper">
         
          <Box className="signup-content">
            {error && <Alert severity="error" className="signup-error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate className="signup-form">
              <TextField
                fullWidth
                margin="normal"
                id="username"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
                className="signup-form-field"
              />

              <TextField
                fullWidth
                margin="normal"
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
                className="signup-form-field"
              />

              <FormControl fullWidth margin="normal" className="signup-form-field">
                <InputLabel id="role-label">Register as</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Register as"
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <MenuItem value="">Select role</MenuItem>
                  <MenuItem value="DOCTOR">Doctor</MenuItem>
                  <MenuItem value="PATIENT">Patient</MenuItem>
                </Select>
                <FormHelperText>Please select your role</FormHelperText>
              </FormControl>

              {role === 'DOCTOR' && (
                <Box className="signup-doctor-fields">
                  <TextField
                    fullWidth
                    margin="normal"
                    id="registrationNumber"
                    label="Registration Number"
                    variant="outlined"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MedicalServicesOutlined />
                        </InputAdornment>
                      ),
                    }}
                    className="signup-form-field"
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    id="clinic"
                    label="Clinic Name"
                    variant="outlined"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MedicalServicesOutlined />
                        </InputAdornment>
                      ),
                    }}
                    className="signup-form-field"
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    id="location"
                    label="Clinic Location"
                    variant="outlined"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                    className="signup-form-field"
                  />
                </Box>
              )}
              
              <TextField
                fullWidth
                margin="normal"
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="signup-password-field"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                className="signup-button"
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
