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
  IconButton,
  Alert,
} from "@mui/material";
import logo from "@/assets/images/logo.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back icon
import { useAuth } from '@/context/AuthContext'; // Correct import for useAuth
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth(); // Use the register function from AuthContext

  // Validation function
  const validateForm = () => {
    let valid = true;

    // Email validation (basic regex)
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

    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      valid = false;
    } else {
      setConfirmPasswordError(false);
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setError(null);
      const role = 'Customer'; // Default role set to 'Customer'
      const user = await register(fullName, email, password, role);
      if (user.role === 'Customer') {
        navigate('/'); // Redirect to the homepage
      } else {
        setError('Unauthorized role. Please contact the administrator.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
        {/* Back Button and Logo */}
        <Box position="relative">
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ position: "absolute", top: 16, left: 16 }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Logo Centered */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img src={logo} alt="Logo" style={{ width: "200px", height: "80px" }} />
          </Box>
        </Box>

        {/* Heading */}
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
          Create an Account
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Form Fields */}
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
            label="Full Name"
            name="fullName"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          <TextField
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
            helperText={confirmPasswordError ? "Passwords do not match" : ""}
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
            onClick={handleRegister}
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
            Register
          </Button>
        </Box>

        {/* Sign-in Redirect */}
        <Grid container justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Grid item>
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Sign in
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Register;
