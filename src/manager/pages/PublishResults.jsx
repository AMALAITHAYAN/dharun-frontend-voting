import React, { useState, useEffect, useMemo } from 'react';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Grid, Select, MenuItem,
  InputLabel, FormControl, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// MUI Icons
import PublishIcon from '@mui/icons-material/Publish';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- MOCK DATA ---
const mockResultsData = {
  'ELEC-003': {
    name: 'Science Olympiad Team Lead',
    isPublished: false,
    results: [
      { name: 'Rohan Verma', votes: 35 },
      { name: 'Anjali Singh', votes: 28 },
      { name: 'Amit Kumar', votes: 5 },
    ],
  },
  'ELEC-006': {
    name: 'Annual Fest Committee Head',
    isPublished: true,
    results: [
      { name: 'Priya Sharma', votes: 112 },
      { name: 'Vikram Rathod', votes: 98 },
    ],
  },
};

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' }, // A success green
    background: { default: '#f4f6f8' },
  },
});

export default function PublishResults() {
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState({});
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setElections(mockResultsData);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const updatedElections = { ...elections };
      updatedElections[selectedElectionId].isPublished = true;
      setElections(updatedElections);
      setIsPublishing(false);
      setSnackbarOpen(true);
    }, 2000);
  };

  const selectedElection = useMemo(() => {
    return elections[selectedElectionId] || null;
  }, [elections, selectedElectionId]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Publish Election Results</Typography>
          <Typography color="text.secondary">Select a completed election to review and publish the final results.</Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <FormControl fullWidth>
                <InputLabel>Select a Completed Election</InputLabel>
                <Select
                  value={selectedElectionId}
                  label="Select a Completed Election"
                  onChange={(e) => setSelectedElectionId(e.target.value)}
                  disabled={loading}
                >
                  {Object.keys(elections).map(id => (
                    <MenuItem key={id} value={id}>{elections[id].name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={isPublishing ? <CircularProgress size={24} color="inherit" /> : (selectedElection?.isPublished ? <CheckCircleIcon /> : <PublishIcon />)}
                disabled={!selectedElection || isPublishing || selectedElection.isPublished}
                onClick={handlePublish}
              >
                {selectedElection?.isPublished ? 'Published' : (isPublishing ? 'Publishing...' : 'Publish Now')}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {selectedElection && (
          <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: '12px' }}>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Results Preview for "{selectedElection.name}"
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedElection.results} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            Results have been successfully published!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}