import React from "react";
import { Box, Button, Container, Paper, Typography, Grid } from "@mui/material";
import { SignInButton } from "@clerk/clerk-react";

const WelcomePage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 1,
          px: 3,
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src="/snack_basket_logo.jpg"
            alt="Snack Basket Logo"
            sx={{
              height: 40,
              width: "auto",
              mr: 1.5,
              borderRadius: 1,
            }}
          />
          <Typography variant="h6" component="div" fontWeight="bold">
            Snack Basket Order Management
          </Typography>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Paper
              elevation={0}
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 4,
                transform: "rotate(-2deg)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/snack_basket_logo.jpg"
                alt="Snack Basket Logo"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 2,
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Try it, Taste it, Crave it!!
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 400 }}
            >
              Efficiently track orders, manage inventory, and handle deliveries
              with this all-in-one solution.
            </Typography>
            <SignInButton mode="modal">
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Employee Signin
              </Button>
            </SignInButton>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "white",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Snack Basket Order Management. All
            rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomePage;
