import React, { useState, useEffect } from 'react';

// MUI Core Components
import {
  Box, Container, Typography, CssBaseline, Paper, Skeleton,
  Chip, List, ListItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// --- MOCK DATA ---
// Mock data representing votes cast by the user
const mockVotes = [
  {
    confirmationId: 'VOTE-8A2B-C4D6-E8F0',
    electionName: 'Debate Club Captain',
    castDate: '2025-08-21T10:15:00',
  },
  {
    confirmationId: 'VOTE-1G3H-I5J6-K7L8',
    electionName: 'Science Olympiad Team Lead',
    castDate: '2025-08-15T14:30:00',
  },
];

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // A trustworthy blue
    secondary: { main: '#388e3c' }, // A success green
    background: { default: '#f4f6f8' },
  },
});

export default function MyVotes() {
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    // Simulate fetching the user's voting history
    setTimeout(() => {
      setVotes(mockVotes);
      setLoading(false);
    }, 1200);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <CssBaseline />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">My Voting History</Typography>
          <Typography color="text.secondary">
            Here is a confirmation receipt for each vote you have cast. This ensures your participation is recorded.
          </Typography>
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {loading ? (
            // Show skeleton loaders while fetching data
            <>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '8px' }} />
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '8px' }} />
            </>
          ) : votes.length > 0 ? (
            votes.map((vote) => (
              <Paper
                key={vote.confirmationId}
                variant="outlined"
                sx={{ p: 2, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <VerifiedUserIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="600">
                    {vote.electionName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vote Confirmation ID: {vote.confirmationId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cast on: {formatDate(vote.castDate)}
                  </Typography>
                </Box>
                <Chip label="Vote Secured" color="secondary" size="small" />
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '8px' }}>
              <Typography color="text.secondary">
                You haven't cast any votes yet.
              </Typography>
            </Paper>
          )}
        </List>
      </Container>
    </ThemeProvider>
  );
}