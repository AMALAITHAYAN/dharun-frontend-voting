import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI Core Components
import {
  Box, Container, Typography, CssBaseline, Button, Grid, Paper,
  Skeleton, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CampaignIcon from '@mui/icons-material/Campaign';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// --- MOCK DATA ---
// Mock data for a logged-in voter
const mockVoterData = {
  user: { name: 'Rohan Verma' },
  kpis: {
    eligibleElections: 3,
    ballotsCast: 2,
  },
  activeElections: [
    { id: 'ELEC-001', name: 'Student Council President 2025', endDate: '2025-08-22T17:00' },
  ],
  announcements: [
    { id: 1, title: 'Election Deadline Extended', content: 'The deadline for the Student Council election has been extended to August 22nd, 5 PM.' },
    { id: 2, title: 'New Candidate Added', content: 'A new candidate has been added to the Debate Club Captain election.' },
  ]
};

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f4f6f8' },
  },
});

const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: '12px' }}>
    <Box sx={{ color, mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

export default function VoterDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate fetching dashboard data
    setTimeout(() => {
      setData(mockVoterData);
      setLoading(false);
    }, 1200);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CssBaseline />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {loading ? <Skeleton width="40%" /> : `Welcome, ${data.user.name}!`}
          </Typography>
          <Typography color="text.secondary">
            {loading ? <Skeleton width="60%" /> : "Here's a summary of your voting activity. Make your voice heard!"}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Panel */}
          <Grid item xs={12} md={8}>
            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                {loading ? <Skeleton variant="rounded" height={88} /> : 
                  <StatCard title="Eligible Elections" value={data.kpis.eligibleElections} icon={<HowToVoteIcon fontSize="large" />} color="primary.main" />
                }
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? <Skeleton variant="rounded" height={88} /> : 
                  <StatCard title="Ballots Cast" value={data.kpis.ballotsCast} icon={<FactCheckIcon fontSize="large" />} color="success.main" />
                }
              </Grid>
            </Grid>

            {/* Active Elections Section */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">Active Elections</Typography>
                <Button component={RouterLink} to="/voter/elections" endIcon={<ChevronRightIcon />}>View All</Button>
              </Box>
              {loading ? <Skeleton variant="rectangular" height={100} /> :
                data.activeElections.length > 0 ? (
                  data.activeElections.map(election => (
                    <Paper key={election.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography fontWeight="bold">{election.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Closes: {formatDate(election.endDate)}</Typography>
                      </Box>
                      <Button component={RouterLink} to={`/voter/ballot?e=${election.id}`} variant="contained">Vote Now</Button>
                    </Paper>
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>No active elections right now.</Typography>
                )
              }
            </Paper>
          </Grid>
          
          {/* Right Panel */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', height: '100%' }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>Recent Announcements</Typography>
              {loading ? <Skeleton variant="rectangular" height={200} /> :
                <List>
                  {data.announcements.map((ann, index) => (
                    <React.Fragment key={ann.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><CampaignIcon color="action" /></ListItemIcon>
                        <ListItemText primary={ann.title} secondary={ann.content} primaryTypographyProps={{ fontWeight: 'bold' }} />
                      </ListItem>
                      {index < data.announcements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              }
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}