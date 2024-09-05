import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import logo from "@/assets/images/logo.png"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back icon
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook
import UserModel from '@/models/UserModel'; // Import UserModel for typing

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  // State for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Form Validation
  const validateForm = () => {
    let valid = true;
    // Email validation (simple regex)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    // Password validation (min 6 characters)
    if (password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }
    return valid;
  };

  // Handle SignIn
  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Clear any previous errors
      setError('');

      // Call the login method from the AuthContext
      const user: UserModel = await login(email, password);

      // On successful login, navigate based on user role
      if (user.role === 'Admin') {
        navigate('/admin'); // Admin dashboard
      } else if (user.role === 'Staff') {
        navigate('/staff/dashboard'); // Staff dashboard
      } else if (user.role === 'Customer') {
        navigate('/');
      } else {
        setError('Unauthorized role. Please contact the administrator.');
      }
    } catch (err: any) {
      // If there is an error, set the error message
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
        {/* Back Button and Logo */}
        <Box position="relative">
          {/* Back Button, positioned in the top-left */}
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ position: "absolute", top: 16, left: 16 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          {/* Logo centered */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img src={logo} alt="Logo" style={{ width: "200px", height: "80px" }} />
          </Box>
        </Box>
        
        {/* Sign In Text */}
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
            color: "#1976d2",
          }}
        >
          Sign In
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Form */}
        <Box
          component="form"
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? "Please enter a valid email address" : ""}
            InputProps={{
              style: {
                borderRadius: "8px",
                fontSize: "0.875rem",
              },
            }}
            sx={{ fontSize: "0.875rem" }}
          />
          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordError ? "Password must be at least 6 characters" : ""}
            InputProps={{
              style: {
                borderRadius: "8px",
                fontSize: "0.875rem",
              },
            }}
            sx={{ fontSize: "0.875rem" }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            onClick={handleSignIn}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.875rem",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#135ba1",
              },
              transition: "background-color 0.3s ease",
            }}
          >
            Sign In
          </Button>
        </Box>
        
        {/* Register Link */}
        <Grid container justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Grid item>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Don't have an account?{" "}
              <a
                href="/register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Register
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignIn;
