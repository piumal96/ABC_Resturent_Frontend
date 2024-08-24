import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import logo from "../assets/images/logo.png"; 

const Register: React.FC = () => {
  return (
    <Container maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src={logo} alt="Logo" style={{ width: "200px", height: "80px" }} />
        </Box>
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
            InputProps={{
              style: {
                borderRadius: "8px",
                fontSize: "0.875rem",
              },
            }}
            sx={{ fontSize: "0.875rem" }}
          />
          <Button
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
