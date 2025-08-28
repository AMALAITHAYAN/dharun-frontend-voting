import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Grid, TextField,
  Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText,
  IconButton, Skeleton, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// --- MOCK DATA ---
const mockPositionsData = {
  'ELEC-001': {
    name: 'Student Council President 2025',
    positions: [
      { id: uuidv4(), title: 'President' },
      { id: uuidv4(), title: 'Vice President' },
      { id: uuidv4(), title: 'Secretary' },
    ],
  },
  'ELEC-002': {
    name: 'Debate Club Captain',
    positions: [
      { id: uuidv4(), title: 'Captain' },
    ],
  },
};

const theme = createTheme({
  palette: {
    primary: { main: '#6a1b9a' }, // A deep purple
    secondary: { main: '#d81b60' }, // Pink
    background: { default: '#f4f6f8' },
  },
});

export default function ManagePositions() {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState({});
  const [selectedElectionId, setSelectedElectionId] = useState('ELEC-001');
  const [newPosition, setNewPosition] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setPositions(mockPositionsData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleElectionChange = (event) => {
    setSelectedElectionId(event.target.value);
  };

  const handleAddPosition = (e) => {
    e.preventDefault();
    if (!newPosition.trim()) return;

    const newPositionData = { id: uuidv4(), title: newPosition };
    const updatedPositions = { ...positions };
    updatedPositions[selectedElectionId].positions.push(newPositionData);
    
    setPositions(updatedPositions);
    setNewPosition(''); // Reset form
  };

  const handleDeletePosition = (positionId) => {
    const updatedPositions = { ...positions };
    const positionList = updatedPositions[selectedElectionId].positions;
    updatedPositions[selectedElectionId].positions = positionList.filter(p => p.id !== positionId);
    setPositions(updatedPositions);
  };

  const currentPositions = useMemo(() => {
    return positions[selectedElectionId]?.positions || [];
  }, [positions, selectedElectionId]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Manage Positions</Typography>
          <Typography color="text.secondary">Define the roles and positions available for voting in each election.</Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
          <FormControl fullWidth>
            <InputLabel>Select an Election to Manage</InputLabel>
            <Select
              value={selectedElectionId}
              label="Select an Election to Manage"
              onChange={handleElectionChange}
              disabled={loading}
            >
              {Object.keys(positions).map(id => (
                <MenuItem key={id} value={id}>{positions[id].name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Add Position Form */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom>Add New Position</Typography>
              <Box component="form" onSubmit={handleAddPosition}>
                <TextField
                  label="Position Title"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Add Position
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Position List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Available Positions for "{positions[selectedElectionId]?.name}"
            </Typography>
            <Paper variant="outlined" sx={{ borderRadius: '12px' }}>
              {loading ? <Skeleton variant="rectangular" height={150} /> : (
                <List>
                  {currentPositions.map((position, index) => (
                    <React.Fragment key={position.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePosition(position.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={position.title} />
                      </ListItem>
                      {index < currentPositions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}