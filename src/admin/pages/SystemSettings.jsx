import React, { useState, useEffect } from 'react';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Grid, TextField, Switch, FormControlLabel,
  Tabs, Tab, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import SaveIcon from '@mui/icons-material/Save';

// --- MOCK DATA (Simulating settings loaded from a database) ---
const initialSettings = {
  // General Settings
  portalName: 'Online Voting System for Clubs & Schools',
  defaultTimezone: 'Asia/Kolkata',
  allowSelfRegistration: true,
  // Security Settings
  mfaRequired: false,
  passwordMinLength: 8,
  // Email Settings
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  fromEmail: 'noreply@schoolvoting.com'
};

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' }, // Indigo
    background: { default: '#f4f6f8' },
  },
});

// A helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SystemSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [tab, setTab] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setIsDirty(JSON.stringify(settings) !== JSON.stringify(initialSettings));
  }, [settings]);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setSnackbarOpen(true);
      // In a real app, you would update the initial settings state here
      // to reflect the newly saved data.
    }, 1500);
  };
  
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">System Settings</Typography>
            <Typography color="text.secondary">Manage global configurations for the voting portal.</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={!isDirty || isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
        
        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="General" />
              <Tab label="Security" />
              <Tab label="Email Configuration" />
            </Tabs>
          </Box>
          
          <TabPanel value={tab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField name="portalName" label="Portal Name" value={settings.portalName} onChange={handleInputChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Default Timezone</InputLabel>
                  <Select name="defaultTimezone" value={settings.defaultTimezone} label="Default Timezone" onChange={handleInputChange}>
                    <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                    <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                    <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Switch name="allowSelfRegistration" checked={settings.allowSelfRegistration} onChange={handleInputChange} />} label="Allow Public User Self-Registration" />
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField name="passwordMinLength" label="Minimum Password Length" type="number" value={settings.passwordMinLength} onChange={handleInputChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Switch name="mfaRequired" checked={settings.mfaRequired} onChange={handleInputChange} />} label="Require Multi-Factor Authentication (MFA) for Admins" />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}><TextField name="smtpHost" label="SMTP Host" value={settings.smtpHost} onChange={handleInputChange} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField name="smtpPort" label="SMTP Port" type="number" value={settings.smtpPort} onChange={handleInputChange} fullWidth /></Grid>
              <Grid item xs={12} md={6}><TextField name="fromEmail" label="'From' Email Address" type="email" value={settings.fromEmail} onChange={handleInputChange} fullWidth helperText="The email address that sends system notifications."/></Grid>
            </Grid>
          </TabPanel>
        </Paper>
        
        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}