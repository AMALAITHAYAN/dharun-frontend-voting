import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Toolbar, TextField,
  InputAdornment, Chip, IconButton, Menu, MenuItem, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

// --- MOCK DATA ---
const initialClubs = [
  { id: uuidv4(), name: 'Student Council', manager: 'Dr. Mehta', users: 150, status: 'Active' },
  { id: uuidv4(), name: 'Debate Club', manager: 'Prof. Sharma', users: 45, status: 'Active' },
  { id: uuidv4(), name: 'Science Olympiad', manager: 'Mr. Verma', users: 72, status: 'Active' },
  { id: uuidv4(), name: 'Alumni Association', manager: 'Ms. Anjali', users: 2500, status: 'Inactive' },
  { id: uuidv4(), name: 'Photography Club', manager: 'Mr. Kumar', users: 60, status: 'Active' },
];

const theme = createTheme({
  palette: {
    primary: { main: '#5e35b1' }, // Deep Purple
    secondary: { main: '#00897b' }, // Teal
    background: { default: '#f4f6f8' },
  },
});

// Helper to get initials from a name
const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

export default function ManageClubs() {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentClub, setCurrentClub] = useState(null);

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setClubs(initialClubs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMenuClick = (event, club) => {
    setAnchorEl(event.currentTarget);
    setMenuTarget(club);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTarget(null);
  };

  const handleOpenModal = (club = null) => {
    setIsEditMode(!!club);
    setCurrentClub(club ? { ...club } : { name: '', manager: '', status: 'Active' });
    setOpenModal(true);
    handleMenuClose();
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClub(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClub = () => {
    if (isEditMode) {
      setClubs(prev => prev.map(c => (c.id === currentClub.id ? currentClub : c)));
    } else {
      setClubs(prev => [{ ...currentClub, id: uuidv4(), users: 0 }, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteClub = () => {
    if (!menuTarget) return;
    setClubs(prev => prev.filter(c => c.id !== menuTarget.id));
    handleMenuClose();
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter(club =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubs, searchTerm]);

  if (loading) { /* ... loading spinner JSX ... */ }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Manage Clubs & Schools</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
            Create Club
          </Button>
        </Box>
        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <Toolbar sx={{ p: 2 }}>
            <TextField
              variant="outlined" size="small" placeholder="Search by club or manager..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: '50%' }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Club / School Name</TableCell>
                  <TableCell>Assigned Manager</TableCell>
                  <TableCell>Total Users</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClubs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((club) => (
                  <TableRow key={club.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>{getInitials(club.name)}</Avatar>
                        <Typography fontWeight="bold">{club.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{club.manager}</TableCell>
                    <TableCell>{club.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={club.status} color={club.status === 'Active' ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuClick(e, club)}><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredClubs.length}
            rowsPerPage={rowsPerPage} page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleOpenModal(menuTarget)}><EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit Details</MenuItem>
          <MenuItem onClick={handleMenuClose}><PeopleIcon fontSize="small" sx={{ mr: 1.5 }} /> Manage Users</MenuItem>
          <MenuItem onClick={handleDeleteClub} sx={{ color: 'error.main' }}><DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete Club</MenuItem>
        </Menu>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
          <DialogTitle fontWeight="bold">{isEditMode ? 'Edit Club' : 'Create New Club'}</DialogTitle>
          <DialogContent>
            <TextField name="name" label="Club / School Name" value={currentClub?.name || ''} onChange={handleInputChange} fullWidth margin="dense" sx={{ mt: 1 }} autoFocus />
            <TextField name="manager" label="Assigned Manager" value={currentClub?.manager || ''} onChange={handleInputChange} fullWidth margin="dense" />
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSaveClub} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}