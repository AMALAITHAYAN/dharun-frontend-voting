import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Toolbar, TextField,
  InputAdornment, Chip, IconButton, Menu, MenuItem, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, FormControl, InputLabel
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// --- MOCK DATA ---
const mockVoterRollData = {
  'ELEC-001': {
    name: 'Student Council President 2025',
    voters: [
      { id: uuidv4(), name: 'Rohan Verma', identifier: 'rohan.v@school.com', status: 'Voted' },
      { id: uuidv4(), name: 'Amit Kumar', identifier: 'amit.k@school.com', status: 'Eligible' },
      { id: uuidv4(), name: 'Sneha Patil', identifier: 'sneha.p@school.com', status: 'Eligible' },
    ],
  },
  'ELEC-002': {
    name: 'Debate Club Captain',
    voters: [
      { id: uuidv4(), name: 'Anjali Singh', identifier: 'anjali.s@school.com', status: 'Eligible' },
    ],
  },
};

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' }, // A strong, trustworthy blue
    background: { default: '#f4f6f8' },
  },
});

const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

export default function VoterRoll() {
  const [loading, setLoading] = useState(true);
  const [voterRolls, setVoterRolls] = useState({});
  const [selectedElectionId, setSelectedElectionId] = useState('ELEC-001');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [newVoter, setNewVoter] = useState({ name: '', identifier: '' });

  useEffect(() => {
    setTimeout(() => {
      setVoterRolls(mockVoterRollData);
      setLoading(false);
    }, 1200);
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddVoter = () => {
    if (!newVoter.name || !newVoter.identifier) return;
    const newVoterData = { ...newVoter, id: uuidv4(), status: 'Eligible' };
    const updatedRolls = { ...voterRolls };
    updatedRolls[selectedElectionId].voters.push(newVoterData);
    setVoterRolls(updatedRolls);
    setNewVoter({ name: '', identifier: '' });
    handleCloseModal();
  };

  const handleDeleteVoter = (voterId) => {
    const updatedRolls = { ...voterRolls };
    const voters = updatedRolls[selectedElectionId].voters;
    updatedRolls[selectedElectionId].voters = voters.filter(v => v.id !== voterId);
    setVoterRolls(updatedRolls);
  };
  
  const filteredVoters = useMemo(() => {
    const currentVoters = voterRolls[selectedElectionId]?.voters || [];
    return currentVoters.filter(voter =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [voterRolls, selectedElectionId, searchTerm]);

  const getStatusChip = (status) => {
    const colorMap = { Voted: 'success', Eligible: 'default' };
    return <Chip label={status} color={colorMap[status]} size="small" />;
  };

  if (loading) { /* ... loading spinner JSX ... */ }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Voter Roll Management</Typography>
          <Typography color="text.secondary">Manage the list of eligible voters for each election.</Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Election</InputLabel>
          <Select
            value={selectedElectionId}
            label="Select Election"
            onChange={(e) => setSelectedElectionId(e.target.value)}
            disabled={loading}
            sx={{ bgcolor: 'white' }}
          >
            {Object.keys(voterRolls).map(id => (
              <MenuItem key={id} value={id}>{voterRolls[id].name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <Toolbar sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              variant="outlined" size="small" placeholder="Search by name or email/ID..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: '40%' }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
            <Box>
              <Button variant="outlined" startIcon={<UploadFileIcon />} sx={{ mr: 2 }}>
                Import CSV
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Add Voter
              </Button>
            </Box>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Voter Name</TableCell>
                  <TableCell>Email / Student ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVoters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((voter) => (
                  <TableRow key={voter.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>{getInitials(voter.name)}</Avatar>
                        <Typography fontWeight="bold">{voter.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{voter.identifier}</TableCell>
                    <TableCell>{getStatusChip(voter.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => handleDeleteVoter(voter.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredVoters.length}
            rowsPerPage={rowsPerPage} page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
          <DialogTitle fontWeight="bold">Add New Voter</DialogTitle>
          <DialogContent>
            <TextField name="name" label="Full Name" value={newVoter.name} onChange={(e) => setNewVoter({...newVoter, name: e.target.value})} fullWidth margin="dense" sx={{ mt: 1 }} autoFocus />
            <TextField name="identifier" label="Email / Student ID" value={newVoter.identifier} onChange={(e) => setNewVoter({...newVoter, identifier: e.target.value})} fullWidth margin="dense" />
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleAddVoter} variant="contained">Add Voter</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}