import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Grid, TextField,
  Select, MenuItem, InputLabel, FormControl, Card, CardContent, CardActions, Avatar, Skeleton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

// --- MOCK DATA ---
const mockElectionsData = {
  'ELEC-001': {
    name: 'Student Council President 2025',
    candidates: [
      { id: uuidv4(), name: 'Rohan Verma', statement: 'Leading with integrity and vision.' },
      { id: uuidv4(), name: 'Anjali Singh', statement: 'A voice for every student.' },
    ],
  },
  'ELEC-002': {
    name: 'Debate Club Captain',
    candidates: [
      { id: uuidv4(), name: 'Amit Kumar', statement: 'Championing discourse and critical thinking.' },
    ],
  },
};

const theme = createTheme({
  palette: {
    primary: { main: '#00897b' }, // Teal
    secondary: { main: '#f9a825' }, // Yellow for accents
    background: { default: '#f4f6f8' },
  },
});

const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

export default function ManageCandidates() {
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState({});
  const [selectedElectionId, setSelectedElectionId] = useState('ELEC-001');
  const [newCandidate, setNewCandidate] = useState({ name: '', statement: '' });

  useEffect(() => {
    setTimeout(() => {
      setElections(mockElectionsData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleElectionChange = (event) => {
    setSelectedElectionId(event.target.value);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;

    const newCandidateData = { ...newCandidate, id: uuidv4() };
    const updatedElections = { ...elections };
    updatedElections[selectedElectionId].candidates.push(newCandidateData);
    
    setElections(updatedElections);
    setNewCandidate({ name: '', statement: '' }); // Reset form
  };

  const handleDeleteCandidate = (candidateId) => {
    const updatedElections = { ...elections };
    const candidates = updatedElections[selectedElectionId].candidates;
    updatedElections[selectedElectionId].candidates = candidates.filter(c => c.id !== candidateId);
    setElections(updatedElections);
  };

  const currentCandidates = useMemo(() => {
    return elections[selectedElectionId]?.candidates || [];
  }, [elections, selectedElectionId]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Manage Candidates</Typography>
          <Typography color="text.secondary">Add or remove candidates for a selected election.</Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
          <FormControl fullWidth>
            <InputLabel>Select Election</InputLabel>
            <Select
              value={selectedElectionId}
              label="Select Election"
              onChange={handleElectionChange}
              disabled={loading}
            >
              {Object.keys(elections).map(id => (
                <MenuItem key={id} value={id}>{elections[id].name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Add Candidate Form */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom>Add New Candidate</Typography>
              <Box component="form" onSubmit={handleAddCandidate}>
                <TextField
                  label="Candidate Name"
                  name="name"
                  value={newCandidate.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Brief Statement (Optional)"
                  name="statement"
                  value={newCandidate.statement}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Add Candidate
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Candidate List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Candidates for "{elections[selectedElectionId]?.name}" ({currentCandidates.length})
            </Typography>
            {loading ? <Skeleton variant="rectangular" height={100} /> : (
              <Grid container spacing={2}>
                {currentCandidates.map(candidate => (
                  <Grid item xs={12} sm={6} key={candidate.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            {getInitials(candidate.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="div">{candidate.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{candidate.statement}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteCandidate(candidate.id)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}