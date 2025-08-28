import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Usage:
 * <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
 * <ProtectedRoute allowedRole="MANAGER"><ManagerDashboard /></ProtectedRoute>
 * <ProtectedRoute allowedRole="VOTER"><VoterDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role"); // null if not logged in

  // Not logged in → go to login
  if (!role) return <Navigate to="/login" replace />;

  // If role mismatch → push them to their own dashboard
  if (allowedRole && role !== allowedRole) {
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "MANAGER") return <Navigate to="/manager" replace />;
    if (role === "VOTER") return <Navigate to="/voter" replace />;
  }

  return children;
}
