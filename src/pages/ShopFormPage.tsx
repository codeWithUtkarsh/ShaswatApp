import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import ShopForm from "../components/ShopForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/authService";
import PersonIcon from "@mui/icons-material/Person";

const ShopFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{ flexGrow: 1 }}
          >
            Shop & Order Management
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                {user?.name?.charAt(0) || <PersonIcon />}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
            aria-label="back to dashboard"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Create New Shop
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <ShopForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default ShopFormPage;
