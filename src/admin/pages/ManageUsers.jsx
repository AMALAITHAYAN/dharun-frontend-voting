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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';

// --- MOCK DATA ---
const initialUsers = [
  { id: uuidv4(), name: 'Priya Sharma', email: 'priya.s@school.com', role: 'Admin', club: 'System-Wide', status: 'Active' },
  { id: uuidv4(), name: 'Dr. Mehta', email: 'mehta.d@school.com', role: 'Manager', club: 'Student Council', status: 'Active' },
  { id: uuidv4(), name: 'Rohan Verma', email: 'rohan.v@school.com', role: 'Voter', club: 'Debate Club', status: 'Active' },
  { id: uuidv4(), name: 'Anjali Singh', email: 'anjali.s@school.com', role: 'Voter', club: 'Science Olympiad', status: 'Inactive' },
  { id: uuidv4(), name: 'Amit Kumar', email: 'amit.k@school.com', role: 'Voter', club: 'Student Council', status: 'Active' },
];

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // Blue
    secondary: { main: '#f57c00' }, // Orange for Admins
    background: { default: '#f4f6f8' },
  },
});

const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

export default function ManageUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUsers(initialUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setMenuTarget(user);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTarget(null);
  };

  const handleOpenModal = (user = null) => {
    setIsEditMode(!!user);
    setCurrentUser(user ? { ...user } : { name: '', email: '', role: 'Voter', club: 'Student Council', status: 'Active' });
    setOpenModal(true);
    handleMenuClose();
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = () => {
    if (isEditMode) {
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? currentUser : u)));
    } else {
      setUsers(prev => [{ ...currentUser, id: uuidv4() }, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteUser = () => {
    if (!menuTarget) return;
    setUsers(prev => prev.filter(u => u.id !== menuTarget.id));
    handleMenuClose();
  };
  
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const getRoleChip = (role) => {
    const roleMap = {
      Admin: { icon: <AdminPanelSettingsIcon />, color: 'secondary' },
      Manager: { icon: <SupervisorAccountIcon />, color: 'primary' },
      Voter: { icon: <PersonIcon />, color: 'default' },
    };
    return <Chip icon={roleMap[role].icon} label={role} color={roleMap[role].color} size="small" />;
  };
  
  if (loading) { /* ... loading spinner JSX ... */ }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Manage Users</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
            Add User
          </Button>
        </Box>
        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <Toolbar sx={{ p: 2 }}>
            <TextField
              variant="outlined" size="small" placeholder="Search by name or email..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: '50%' }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Club / School</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>{getInitials(user.name)}</Avatar>
                        <Box>
                          <Typography fontWeight="bold">{user.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.club}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>
                      <Chip label={user.status} color={user.status === 'Active' ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuClick(e, user)}><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredUsers.length}
            rowsPerPage={rowsPerPage} page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleOpenModal(menuTarget)}><EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}><VpnKeyIcon fontSize="small" sx={{ mr: 1.5 }} /> Reset Password</MenuItem>
          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}><DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete User</MenuItem>
        </Menu>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
          <DialogTitle fontWeight="bold">{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogContent>
            <TextField name="name" label="Full Name" value={currentUser?.name || ''} onChange={handleInputChange} fullWidth margin="dense" sx={{ mt: 1 }} autoFocus />
            <TextField name="email" label="Email Address" value={currentUser?.email || ''} onChange={handleInputChange} fullWidth margin="dense" />
            <TextField name="club" label="Club / School" value={currentUser?.club || ''} onChange={handleInputChange} fullWidth margin="dense" />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select name="role" value={currentUser?.role || 'Voter'} label="Role" onChange={handleInputChange}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Voter">Voter</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}