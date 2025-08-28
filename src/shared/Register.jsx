import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

// MUI Core Components
import {
  Container, Paper, Box, Typography, TextField, Button, Avatar,
  CssBaseline, Link, Grid, CircularProgress, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
  },
});

export default function Register() {
  // --- All of your original logic is preserved ---
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VOTER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading feedback
  const [success, setSuccess] = useState(false); // New state for success feedback

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const redirectForRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "MANAGER") navigate("/manager");
    else navigate("/voter");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      try {
        localStorage.setItem(
          "ovote_user",
          JSON.stringify({ name: form.name, email: form.email, role: form.role })
        );
        localStorage.setItem("role", form.role);
        
        setLoading(false);
        setSuccess(true);
        
        // Redirect after a short delay to show success message
        setTimeout(() => redirectForRole(form.role), 1500);

      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }, 1000);
  };
  // --- End of original logic ---

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={6}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: '12px'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Account created successfully!</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Register As</InputLabel>
                  <Select
                    name="role"
                    value={form.role}
                    label="Register As"
                    onChange={onChange}
                  >
                    <MenuItem value="VOTER">Voter</MenuItem>
                    <MenuItem value="MANAGER">Manager</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || success}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}