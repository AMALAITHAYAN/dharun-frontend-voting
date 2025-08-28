import React, { useState, useEffect } from 'react';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Grid, CircularProgress, List,
  ListItem, ListItemAvatar, Avatar, ListItemText, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// MUI Icons
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';

// --- MOCK DATA (Simulating data from your backend) ---
const mockDashboardData = {
  kpis: {
    totalClubs: 24,
    totalUsers: 452,
    openElections: 5,
    pendingApprovals: 3,
  },
  userRegistrations: [
    { month: 'Mar', users: 30 },
    { month: 'Apr', users: 45 },
    { month: 'May', users: 62 },
    { month: 'Jun', users: 55 },
    { month: 'Jul', users: 78 },
    { month: 'Aug', users: 95 },
  ],
  recentActivity: [
    { type: 'New Club Approval', details: 'The Debate Club', user: 'Dr. Mehta' },
    { type: 'New Election Created', details: 'Student Council President', user: 'Admin' },
    { type: 'New User Registered', details: 'Riya Sharma', user: 'riya.s@school.com' },
  ]
};

const theme = createTheme({
  palette: {
    primary: { main: '#4caf50' }, // A friendly green
    background: { default: '#f4f6f8' },
  },
});

// A reusable component for the statistics cards
const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      borderRadius: '12px',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'scale(1.05)' }
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData(mockDashboardData);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Admin Dashboard</Typography>
          <Typography color="text.secondary">Welcome back! Here's an overview of the voting system.</Typography>
        </Box>

        {/* --- KPI Cards --- */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Total Clubs" value={data.kpis.totalClubs} icon={<GroupsIcon />} color="#1976d2" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Total Users" value={data.kpis.totalUsers} icon={<PersonAddIcon />} color="#388e3c" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Open Elections" value={data.kpis.openElections} icon={<HowToVoteIcon />} color="#f57c00" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Approvals" value={data.kpis.pendingApprovals} icon={<RuleFolderIcon />} color="#d32f2f" /></Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* --- User Registrations Chart --- */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', height: '100%' }}>
              <Typography variant="h6" gutterBottom>New User Registrations</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.userRegistrations} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* --- Recent Activity List --- */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', height: '100%' }}>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <List>
                {data.recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}><GroupsIcon /></Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={activity.type} secondary={activity.details} />
                    </ListItem>
                    {index < data.recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}