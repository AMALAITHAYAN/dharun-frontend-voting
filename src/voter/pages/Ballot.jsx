import React, { useState } from "react";

// MUI Core Components
import {
  Container, Paper, Box, Typography, Button, Divider, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' }, // A trustworthy green
    background: { default: '#f4f6f8' },
  },
});

// Mock data for candidates
const positions = [
  {
    name: "president",
    title: "President",
    candidates: ["Alice Johnson", "Bob Williams"],
  },
  {
    name: "secretary",
    title: "Secretary",
    candidates: ["Carol Davis", "Dave Miller"],
  },
];

export default function Ballot() {
  // --- Your original state logic is preserved ---
  const [selected, setSelected] = useState({});

  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to submit the vote
    setTimeout(() => {
      console.log("Vote submitted:", selected);
      setLoading(false);
      setVoted(true);
      setConfirmationOpen(true);
    }, 1500);
  };

  const isSubmitDisabled = Object.keys(selected).length !== positions.length || loading || voted;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: '12px' }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">Student Council Election</Typography>
            <Typography color="text.secondary">Please cast your vote for each position below.</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={submit}>
            {positions.map((position, index) => (
              <FormControl key={position.name} component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'black' }}>
                  {position.title}
                </FormLabel>
                <RadioGroup
                  name={position.name}
                  value={selected[position.name] || ""}
                  onChange={handleChange}
                >
                  {position.candidates.map((candidate) => (
                    <FormControlLabel
                      key={candidate}
                      value={candidate}
                      control={<Radio />}
                      label={candidate}
                    />
                  ))}
                </RadioGroup>
                {index < positions.length - 1 && <Divider sx={{ my: 2 }} />}
              </FormControl>
            ))}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitDisabled}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (voted ? 'Vote Submitted' : 'Submit Vote')}
            </Button>
          </Box>
        </Paper>

        {/* --- Confirmation Dialog --- */}
        <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            Vote Submitted Successfully!
          </DialogTitle>
          <DialogContent>
            <Alert severity="success">
              Thank you for participating. Your vote has been securely recorded.
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Typography fontWeight="bold">Your selections:</Typography>
              {Object.entries(selected).map(([key, value]) => (
                <Typography key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: <strong>{value}</strong>
                </Typography>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmationOpen(false)} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}