import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

// MUI Core Components
import {
  Container, Paper, Box, Typography, TextField, Button, Avatar,
  CssBaseline, Alert, CircularProgress, Link
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' }, // A trustworthy indigo
  },
});

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const demoUsers = [
    { email: "admin@ovote.com",   password: "admin123",   role: "ADMIN",   name: "Admin" },
    { email: "manager@ovote.com", password: "manager123", role: "MANAGER", name: "Election Manager" },
    { email: "voter@ovote.com",   password: "voter123",   role: "VOTER",   name: "Voter" },
  ];

  const redirectForRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "MANAGER") navigate("/manager");
    else navigate("/voter");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    setTimeout(() => {
      const found = demoUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        localStorage.setItem(
          "ovote_user",
          JSON.stringify({ name: found.name, email: found.email, role: found.role })
        );
        localStorage.setItem("role", found.role);
        redirectForRole(found.role);
        return;
      }

      try {
        const stored = JSON.parse(localStorage.getItem("ovote_user") || "null");
        if (stored && stored.email === email && password) {
          localStorage.setItem("role", stored.role);
          redirectForRole(stored.role);
          return;
        }
      } catch {}

      setErr("Invalid credentials");
      setLoading(false);
    }, 1000);
  };

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
            {err && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{err}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              // FIXED: Changed e.gantt.value to e.target.value
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ mt: 4, p: 2, borderRadius: '12px', bgcolor: '#f5f5f5' }}>
          <Typography variant="body1" fontWeight="bold">Demo Accounts:</Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
            <li>Admin: <code>admin@ovote.com</code> / <code>admin123</code></li>
            <li>Manager: <code>manager@ovote.com</code> / <code>manager123</code></li>
            <li>Voter: <code>voter@ovote.com</code> / <code>voter123</code></li>
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}