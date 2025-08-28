import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// MUI Core Components
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const theme = createTheme({
  palette: {
    primary: { main: '#2c3e50' }, // A dark, professional blue
  },
});

export default function Navbar() {
  // --- Your original logic is preserved ---
  const user = JSON.parse(localStorage.getItem("ovote_user") || 'null');
  const role = user?.role;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("ovote_user");
    navigate("/login");
  };
  // --- End of original logic ---

  // State for the manager dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navButtonStyle = { color: 'white', textDecoration: 'none', mx: 1 };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <HowToVoteIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ ...navButtonStyle, flexGrow: 1, '&:hover': { color: '#e0e0e0' } }}
          >
            Online Voting System
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* --- All conditional rendering is preserved and improved --- */}
            
            {/* Not logged in */}
            {!role && (
              <>
                <Button component={RouterLink} to="/login" sx={navButtonStyle}>Login</Button>
                <Button component={RouterLink} to="/register" sx={navButtonStyle}>Register</Button>
              </>
            )}

            {/* Voter-only links */}
            {role === "VOTER" && (
              <>
                <Button component={RouterLink} to="/voter" sx={navButtonStyle}>Dashboard</Button>
                <Button component={RouterLink} to="/voter/elections" sx={navButtonStyle}>Elections</Button>
                <Button component={RouterLink} to="/voter/my-votes" sx={navButtonStyle}>My Votes</Button>
              </>
            )}

            {/* Manager-only links */}
            {role === "MANAGER" && (
              <>
                <Button component={RouterLink} to="/manager" sx={navButtonStyle}>Dashboard</Button>
                <Button component={RouterLink} to="/manager/elections" sx={navButtonStyle}>Elections</Button>
                {/* Dropdown Menu for other manager links */}
                <Button
                  sx={navButtonStyle}
                  onClick={handleMenuClick}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Manage
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem component={RouterLink} to="/manager/create-election" onClick={handleMenuClose}>Create Election</MenuItem>
                  <MenuItem component={RouterLink} to="/manager/positions" onClick={handleMenuClose}>Positions</MenuItem>
                  <MenuItem component={RouterLink} to="/manager/candidates" onClick={handleMenuClose}>Candidates</MenuItem>
                  <MenuItem component={RouterLink} to="/manager/voters" onClick={handleMenuClose}>Voter Roll</MenuItem>
                  <MenuItem component={RouterLink} to="/manager/publish" onClick={handleMenuClose}>Publish Results</MenuItem>
                </Menu>
              </>
            )}

            {/* Admin-only links */}
            {role === "ADMIN" && (
              <>
                <Button component={RouterLink} to="/admin" sx={navButtonStyle}>Dashboard</Button>
                <Button component={RouterLink} to="/admin/users" sx={navButtonStyle}>Users</Button>
                <Button component={RouterLink} to="/admin/clubs" sx={navButtonStyle}>Clubs</Button>
                <Button component={RouterLink} to="/admin/settings" sx={navButtonStyle}>Settings</Button>
                <Button component={RouterLink} to="/admin/audit" sx={navButtonStyle}>Audit Logs</Button>
              </>
            )}
            
            {/* Logout Button (visible only if logged in) */}
            {role && (
              <Button
                variant="outlined"
                onClick={logout}
                startIcon={<LogoutIcon />}
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)', '&:hover': { borderColor: 'white' }, ml: 2 }}
              >
                Logout ({user.name})
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}