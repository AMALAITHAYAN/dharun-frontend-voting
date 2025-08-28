import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI Core Components
import {
  Box, Container, Typography, CssBaseline, Button, Grid, Card, CardContent,
  CardActions, Chip, Skeleton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- MOCK DATA ---
// We'll use the current date (August 21, 2025) to determine status.
const mockElections = [
  {
    id: 'ELEC-001',
    name: 'Student Council President 2025',
    organization: 'Greenwood High School',
    endDate: '2025-08-22T17:00',
    status: 'Open' // User has not voted yet
  },
  {
    id: 'ELEC-002',
    name: 'Debate Club Captain',
    organization: 'Debate Club',
    endDate: '2025-08-23T12:00',
    status: 'Voted' // User has already voted
  },
  {
    id: 'ELEC-004',
    name: 'Alumni Association Board',
    organization: 'Alumni Association',
    endDate: '2025-09-15T18:00',
    status: 'Open' // User has not voted yet
  },
];

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#388e3c' },
    background: { default: '#f4f6f8' },
  },
});

// A component for the loading state
const ElectionCardSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ borderRadius: '12px' }}>
            <CardContent><Skeleton variant="rectangular" height={100} /></CardContent>
        </Card>
    </Grid>
);

export default function EligibleElections() {
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setElections(mockElections);
      setLoading(false);
    }, 1200);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CssBaseline />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Eligible Elections</Typography>
          <Typography color="text.secondary">
            Below are the elections you are currently eligible to vote in. Please cast your vote before the deadline.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            // Show skeleton loaders while fetching data
            <>
              <ElectionCardSkeleton />
              <ElectionCardSkeleton />
              <ElectionCardSkeleton />
            </>
          ) : elections.length > 0 ? (
            elections.map((election) => (
              <Grid item xs={12} sm={6} md={4} key={election.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {election.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {election.organization}
                    </Typography>
                    <Chip
                      icon={<TimerIcon />}
                      label={`Closes on: ${formatDate(election.endDate)}`}
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/voter/ballot?e=${election.id}`}
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={election.status === 'Voted' ? <CheckCircleIcon /> : <HowToVoteIcon />}
                      disabled={election.status === 'Voted'}
                      color={election.status === 'Voted' ? 'secondary' : 'primary'}
                    >
                      {election.status === 'Voted' ? 'Voted' : 'Vote Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
                <Typography align="center" color="text.secondary" sx={{ mt: 5 }}>
                    There are no elections you are eligible for at this time.
                </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}