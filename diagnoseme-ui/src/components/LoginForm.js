import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE } from '../utils/Constants';
import { 
  TextField, 
  Button, 
  CardContent, 
  Container, 
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline, LockOutlined } from '@mui/icons-material';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
      });

      const token = response.data.access_token;
      const role = response.data.userRole;
      localStorage.setItem('role', role); 

      handleLogin(role, token);

      if (role === 'DOCTOR') {
        navigate('/doctor');
      } else if (role === 'PATIENT') {
        navigate('/patient');
      }

    } catch (error) {
      console.error(error.response?.data);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="login">
      <Container maxWidth="sm" className="login-container">
        <Paper elevation={6} className="login-paper">
          <CardContent className="login-content">
            {error && <Alert severity="error" className="login-error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} className="login-form">
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
                className="login-text-field"
              />
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
                className="login-password-field"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                className="login-button"
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>    
  );
};

export default LoginForm;
