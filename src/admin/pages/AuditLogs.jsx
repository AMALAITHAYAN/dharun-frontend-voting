import React, { useState, useEffect, useMemo } from 'react';

// MUI Core & Lab Components
import {
  Box, Paper, Typography, CssBaseline, CircularProgress, TextField, Chip, Stack
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

// --- MOCK DATA ---
const mockLogs = [
  { id: 1, level: 'INFO', timestamp: '2025-08-21 14:15:30 IST', admin: 'admin@school.com', action: 'New election created: "Student Council President".', details: { electionId: 'ELEC-001' }, icon: <AddCircleOutlineIcon /> },
  { id: 2, level: 'INFO', timestamp: '2025-08-21 13:10:05 IST', admin: 'admin@school.com', action: 'User role updated for riya.s@school.com.', details: { userId: 'USR-102', newRole: 'ElectionOfficer' }, icon: <EditIcon /> },
  { id: 3, level: 'SECURITY', timestamp: '2025-08-21 12:05:11 IST', admin: 'SYSTEM', action: 'Failed login attempt for unknown user.', details: { ip: '198.51.100.12' }, icon: <ReportProblemIcon /> },
  { id: 4, level: 'INFO', timestamp: '2025-08-21 11:50:22 IST', admin: 'SYSTEM', action: 'Vote successfully cast in election ELEC-001.', details: { voterId: 'USR-155' }, icon: <HowToVoteIcon /> },
  { id: 5, level: 'INFO', timestamp: '2025-08-21 11:45:00 IST', admin: 'admin@school.com', action: 'Admin login success.', details: { ip: '203.0.113.75' }, icon: <VpnKeyIcon /> },
];

// A custom DARK THEME for this component
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#121212', paper: '#1e1e1e' },
    primary: { main: '#90caf9' },
    warning: { main: '#ffb74d' },
    error: { main: '#f48fb1' },
  },
  typography: {
    fontFamily: '"Fira Code", "Roboto Mono", monospace',
  },
});

export default function AuditLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityStyles = (level) => {
    switch (level) {
      case 'INFO': return { color: 'primary' };
      case 'SECURITY': return { color: 'warning' };
      case 'ERROR': return { color: 'error' };
      default: return { color: 'grey' };
    }
  };

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => filter === 'ALL' || log.level === filter)
      .filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.admin.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [logs, filter, searchTerm]);

  if (loading) { /* ... loading spinner JSX ... */ }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', p: 4 }}>
        <CssBaseline />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Audit & Activity Logs</Typography>
          <Typography color="text.secondary">Track all system and admin activities for transparency and security.</Typography>
          <Paper sx={{ p: 2, mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search logs by action or user..." variant="outlined" size="small" fullWidth
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              {['ALL', 'INFO', 'SECURITY', 'ERROR'].map(level => (
                <Chip
                  key={level} label={level} clickable
                  color={filter === level ? 'primary' : 'default'}
                  onClick={() => setFilter(level)}
                />
              ))}
            </Stack>
          </Paper>
        </Box>

        <Timeline position="alternate">
          {filteredLogs.map((log) => (
            <TimelineItem key={log.id}>
              <TimelineOppositeContent color="text.secondary" sx={{ m: 'auto 0' }}>{log.timestamp}</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color={getSeverityStyles(log.level).color} variant="filled">{log.icon}</TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper elevation={6} sx={{ p: 2 }}>
                  <Typography variant="h6" component="span">{log.action}</Typography>
                  <Typography color="text.secondary">by {log.admin}</Typography>
                  <pre style={{ background: '#2d2d2d', padding: '8px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.8rem' }}>
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </ThemeProvider>
  );
}