import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Pages
import HomePage from "./pages/HomePage";
import ShopFormPage from "./pages/ShopFormPage";
import OrderPage from "./pages/OrderPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import DeliveryPage from "./pages/DeliveryPage";
import SurveyPage from "./pages/SurveyPage";
import ReturnOrderPage from "./pages/ReturnOrder";

// Auth Components
import Login from "./components/auth/Login";
import { useAuthStore } from "./services/authService";
import { useOrderStore } from "./services/orderStore";
import { useDeliveryStore } from "./services/deliveryStore";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#5e35b1", // Deep purple
    },
    secondary: {
      main: "#e91e63", // Pink
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route
              path="/"
              element={
                localStorage.getItem("isLoggedIn") === "true" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/new-shop"
              element={
                <ProtectedRoute>
                  <ShopFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-summary"
              element={
                <ProtectedRoute>
                  <OrderSummaryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <DeliveryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/return-order"
              element={
                <ProtectedRoute>
                  <ReturnOrderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/survey"
              element={
                <ProtectedRoute>
                  <SurveyPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
