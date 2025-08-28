import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Core Components
import {
  Box, Paper, Typography, CssBaseline, Button, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Skeleton, Toolbar // FIXED: Added Toolbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BarChartIcon from '@mui/icons-material/BarChart';

// --- MOCK DATA ---
const mockManagerData = {
  kpis: { activeElections: 2, draftElections: 1, publishedResults: 8 },
  elections: [
    { id: 'ELEC-001', name: 'Student Council President 2025', status: 'Active', voterTurnout: 0.65 },
    { id: 'ELEC-002', name: 'Debate Club Captain', status: 'Upcoming', voterTurnout: 0 },
    { id: 'ELEC-003', name: 'Science Olympiad Team Lead', status: 'Completed', voterTurnout: 0.88 },
    { id: 'ELEC-005', name: 'Annual Budget Approval', status: 'Draft', voterTurnout: 0 },
  ],
};

const theme = createTheme({
  palette: { primary: { main: '#673ab7' }, background: { default: '#f4f6f8' } },
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

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setData(mockManagerData);
      setLoading(false);
    }, 1200);
  }, []);

  const getStatusChip = (status) => {
    const colorMap = { Active: 'success', Upcoming: 'info', Completed: 'default', Draft: 'warning' };
    return <Chip label={status} color={colorMap[status]} size="small" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">Election Manager Dashboard</Typography>
            <Typography color="text.secondary">Oversee and manage your assigned elections.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/manager/create-election')}>
            Create Election
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}><StatCard title="Active Elections" value={data?.kpis.activeElections ?? '—'} icon={<DonutLargeIcon fontSize="large" />} color="success.main" /></Grid>
          <Grid item xs={12} md={4}><StatCard title="Draft Elections" value={data?.kpis.draftElections ?? '—'} icon={<EditNoteIcon fontSize="large" />} color="warning.main" /></Grid>
          <Grid item xs={12} md={4}><StatCard title="Published Results" value={data?.kpis.publishedResults ?? '—'} icon={<FactCheckIcon fontSize="large" />} color="info.main" /></Grid>
        </Grid>

        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <Toolbar sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">My Elections</Typography>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Election Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Voter Turnout</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from(new Array(3)).map((_, index) => (
                    <TableRow key={index}><TableCell colSpan={4}><Skeleton /></TableCell></TableRow>
                  ))
                ) : (
                  data.elections.map((election) => (
                    <TableRow key={election.id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{election.name}</TableCell>
                      <TableCell>{getStatusChip(election.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <Box sx={{ height: 8, borderRadius: '4px', bgcolor: 'grey.300' }}>
                              <Box sx={{ height: '100%', width: `${election.voterTurnout * 100}%`, bgcolor: 'primary.main', borderRadius: '4px' }} />
                            </Box>
                          </Box>
                          <Typography variant="body2">{`${(election.voterTurnout * 100).toFixed(0)}%`}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button startIcon={<BarChartIcon />} size="small">View Results</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}