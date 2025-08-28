import React, { useState } from 'react';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Grid, TextField,
  Select, MenuItem, InputLabel, FormControl, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import HowToVoteIcon from '@mui/icons-material/HowToVote';

const theme = createTheme({
  palette: {
    primary: { main: '#0d47a1' }, // A strong blue
    background: { default: '#f4f6f8' },
  },
});

export default function CreateElection() {
  // --- Your original logic is preserved ---
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    visibility: "PRIVATE",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  // --- End of original logic ---
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Election created:", form);
      setLoading(false);
      setSuccess(true);
      // Reset form
      setForm({ name: "", startDate: "", endDate: "", visibility: "PRIVATE" });
    }, 1500);
  };
  
  const handleSnackbarClose = () => setSuccess(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default', display: 'flex', justifyContent: 'center' }}>
        <CssBaseline />
        <Paper elevation={4} sx={{ p: 4, borderRadius: '12px', maxWidth: 600, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HowToVoteIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" fontWeight="bold">Create New Election</Typography>
          </Box>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to set up a new election for your club or school.
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Election Name"
                  value={form.name}
                  onChange={onChange}
                  required
                  fullWidth
                  helperText="e.g., Student Council President 2025"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="startDate"
                  label="Start Date & Time"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={onChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="endDate"
                  label="End Date & Time"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={onChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    name="visibility"
                    value={form.visibility}
                    label="Visibility"
                    onChange={onChange}
                  >
                    <MenuItem value="PRIVATE">Private (Eligible voters only)</MenuItem>
                    <MenuItem value="PUBLIC">Public (Anyone can view results)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Election'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Snackbar open={success} autoHideDuration={5000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Election created successfully!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}