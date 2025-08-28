import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./shared/Navbar";
import ProtectedRoute from "./shared/ProtectedRoute";

// shared
import Login from "./shared/Login";
import Register from "./shared/Register";

// admin
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageClubs from "./admin/pages/ManageClubs";
import SystemSettings from "./admin/pages/SystemSettings";
import AuditLogs from "./admin/pages/AuditLogs";

// manager
import ManagerDashboard from "./manager/pages/ManagerDashboard";
import ElectionsList from "./manager/pages/ElectionsList";
import CreateElection from "./manager/pages/CreateElection";
import ManagePositions from "./manager/pages/ManagePositions";
import ManageCandidates from "./manager/pages/ManageCandidates";
import VoterRoll from "./manager/pages/VoterRoll";
import PublishResults from "./manager/pages/PublishResults";

// voter
import VoterDashboard from "./voter/pages/VoterDashboard";
import EligibleElections from "./voter/pages/EligibleElections";
import Ballot from "./voter/pages/Ballot";
import MyVotes from "./voter/pages/MyVotes";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Shared */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <SystemSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/elections"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <ElectionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/create-election"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <CreateElection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/positions"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <ManagePositions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/candidates"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <ManageCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/voters"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <VoterRoll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/publish"
          element={
            <ProtectedRoute allowedRole="MANAGER">
              <PublishResults />
            </ProtectedRoute>
          }
        />

        {/* Voter */}
        <Route
          path="/voter"
          element={
            <ProtectedRoute allowedRole="VOTER">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/elections"
          element={
            <ProtectedRoute allowedRole="VOTER">
              <EligibleElections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/ballot"
          element={
            <ProtectedRoute allowedRole="VOTER">
              <Ballot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/my-votes"
          element={
            <ProtectedRoute allowedRole="VOTER">
              <MyVotes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
