import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router for navigation

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Menu, MenuItem,
  Tabs, Tab, Skeleton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';

// --- MOCK DATA ---
// Status is determined based on the current date: August 21, 2025
const initialElections = [
  { id: 'ELEC-001', name: 'Student Council President 2025', startDate: '2025-08-20T09:00', endDate: '2025-08-22T17:00', candidates: 5, votes: 120, status: 'Active' },
  { id: 'ELEC-002', name: 'Debate Club Captain', startDate: '2025-09-01T10:00', endDate: '2025-09-02T16:00', candidates: 3, votes: 0, status: 'Upcoming' },
  { id: 'ELEC-003', name: 'Science Olympiad Team Lead', startDate: '2025-08-15T09:00', endDate: '2025-08-16T17:00', candidates: 4, votes: 68, status: 'Completed' },
  { id: 'ELEC-004', name: 'Alumni Association Board', startDate: '2025-09-10T09:00', endDate: '2025-09-15T18:00', candidates: 8, votes: 0, status: 'Upcoming' },
];

const theme = createTheme({
  palette: {
    primary: { main: '#0d47a1' }, // Strong Blue
    background: { default: '#f4f6f8' },
  },
});

export default function ElectionsList() {
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [tab, setTab] = useState('Active');

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);
  
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    setTimeout(() => {
      setElections(initialElections);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMenuClick = (event, election) => {
    setAnchorEl(event.currentTarget);
    setMenuTarget(election);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTarget(null);
  };
  
  const handleTabChange = (event, newValue) => setTab(newValue);

  const filteredElections = useMemo(() => {
    return elections.filter(e => e.status === tab);
  }, [elections, tab]);

  const getStatusChip = (status) => {
    const colorMap = { Active: 'success', Upcoming: 'info', Completed: 'default' };
    return <Chip label={status} color={colorMap[status]} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Elections</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/manager/create-election')}>
            Create New Election
          </Button>
        </Box>
        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="Active" value="Active" />
              <Tab label="Upcoming" value="Upcoming" />
              <Tab label="Completed" value="Completed" />
            </Tabs>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Election Name</TableCell>
                  <TableCell>Starts On</TableCell>
                  <TableCell>Ends On</TableCell>
                  <TableCell>Candidates</TableCell>
                  <TableCell>Votes Cast</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Skeleton loaders
                  Array.from(new Array(3)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={7}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredElections.map((election) => (
                    <TableRow key={election.id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{election.name}</TableCell>
                      <TableCell>{formatDate(election.startDate)}</TableCell>
                      <TableCell>{formatDate(election.endDate)}</TableCell>
                      <TableCell>{election.candidates}</TableCell>
                      <TableCell>{election.votes.toLocaleString()}</TableCell>
                      <TableCell>{getStatusChip(election.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuClick(e, election)}><MoreVertIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><BarChartIcon fontSize="small" sx={{ mr: 1.5 }} /> View Results</MenuItem>
          <MenuItem onClick={handleMenuClose}><PeopleIcon fontSize="small" sx={{ mr: 1.5 }} /> Manage Candidates</MenuItem>
          <MenuItem onClick={handleMenuClose}><EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit Details</MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
}