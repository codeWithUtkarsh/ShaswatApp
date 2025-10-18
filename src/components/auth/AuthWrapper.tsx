import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@clerk/clerk-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthWrapper component that handles authentication state
 *
 * @param children - The children to render
 * @param requireAuth - Whether auth is required to view the children (defaults to true)
 *
 * If requireAuth is true:
 * - When authenticated, shows children
 * - When not authenticated, redirects to home page
 *
 * If requireAuth is false:
 * - When authenticated, redirects to dashboard
 * - When not authenticated, shows children
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
          bgcolor: "#f5f7fa",
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // If auth is required but user is not signed in
  if (requireAuth && !isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If auth is NOT required and user IS signed in
  if (!requireAuth && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // In all other cases, render children
  return <>{children}</>;
};

export default AuthWrapper;
