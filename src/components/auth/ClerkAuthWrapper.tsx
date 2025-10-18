import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography, useTheme } from "@mui/material";
import {
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
} from "@clerk/clerk-react";
import StorefrontIcon from "@mui/icons-material/Storefront";

type AuthMode = "signIn" | "signUp";

interface ClerkAuthWrapperProps {
  mode: AuthMode;
}

const ClerkAuthWrapper: React.FC<ClerkAuthWrapperProps> = ({ mode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Remove Clerk branding elements after component mounts
    const removeBranding = () => {
      const brandingSelectors = [
        ".cl-internal-b3fm6y",
        ".cl-branded",
        ".cl-branded-card",
        '[class*="cl-internal-"][class*="branded"]',
        ".cl-footer__powered-by",
        ".cl-internal-powered-by",
        'div[style*="writing-mode: vertical"]',
        'div[style*="writing-mode:vertical"]',
        '[style*="transform: rotate"]',
        '[class*="cl-"][class*="badge"]',
        '[class*="cl-"][class*="branding"]',
        "[data-clerk-branding]",
        "[data-powered-by-clerk]",
        '.cl-card > a[href*="clerk"]',
        '.cl-card > button[aria-label*="Clerk"]',
      ];

      brandingSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          (element as HTMLElement).style.display = "none";
          (element as HTMLElement).style.visibility = "hidden";
          (element as HTMLElement).style.opacity = "0";
        });
      });
    };

    // Run immediately
    removeBranding();

    // Run again after a short delay to catch dynamically added elements
    const timer = setTimeout(removeBranding, 100);
    const timer2 = setTimeout(removeBranding, 500);
    const timer3 = setTimeout(removeBranding, 1000);

    // Set up a mutation observer to catch any new branding elements
    const observer = new MutationObserver(removeBranding);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, []);

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
          py: 2,
          px: 3,
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <StorefrontIcon
            sx={{ color: theme.palette.primary.main, fontSize: 32, mr: 1 }}
          />
          <Typography variant="h6" component="div" fontWeight="bold">
              Snack Basket Order Management
          </Typography>
        </Box>
      </Box>

      {/* Auth Container */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              mb: 2,
            }}
          >
            <StorefrontIcon sx={{ color: "white", fontSize: 40 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {mode === "signIn" ? "Sign in" : "Sign up"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            to continue to shaswat
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "white",
          }}
        >
          {/* Clerk Component */}
          <Box sx={{ p: 4 }}>
            {mode === "signIn" ? (
              <ClerkSignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: {
                      width: "100%",
                    },
                    card: {
                      boxShadow: "none",
                      borderRadius: 0,
                      width: "100%",
                      margin: 0,
                      padding: 0,
                    },
                    header: {
                      display: "none",
                    },
                    headerTitle: {
                      display: "none",
                    },
                    headerSubtitle: {
                      display: "none",
                    },
                    formButtonPrimary: {
                      backgroundColor: theme.palette.primary.main,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      textTransform: "none",
                      padding: "12px",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                    formFieldInput: {
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "1rem",
                    },
                    formFieldLabel: {
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      marginBottom: "6px",
                    },
                    footerAction: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                    footerActionLink: {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      "&:hover": {
                        color: theme.palette.primary.dark,
                      },
                    },
                    socialButtonsBlockButton: {
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "0.95rem",
                      textTransform: "none",
                    },
                    dividerLine: {
                      background: theme.palette.divider,
                    },
                    dividerText: {
                      color: theme.palette.text.secondary,
                      fontSize: "0.875rem",
                    },
                    identityPreviewEditButton: {
                      color: theme.palette.primary.main,
                    },
                    formFieldSuccessText: {
                      color: theme.palette.success.main,
                    },
                    formFieldErrorText: {
                      color: theme.palette.error.main,
                    },
                    otpCodeFieldInput: {
                      borderRadius: "8px",
                    },
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                    logoPlacement: "none",
                  },
                }}
              />
            ) : (
              <ClerkSignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: {
                      width: "100%",
                    },
                    card: {
                      boxShadow: "none",
                      borderRadius: 0,
                      width: "100%",
                      margin: 0,
                      padding: 0,
                    },
                    header: {
                      display: "none",
                    },
                    headerTitle: {
                      display: "none",
                    },
                    headerSubtitle: {
                      display: "none",
                    },
                    formButtonPrimary: {
                      backgroundColor: theme.palette.primary.main,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      textTransform: "none",
                      padding: "12px",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                    formFieldInput: {
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "1rem",
                    },
                    formFieldLabel: {
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      marginBottom: "6px",
                    },
                    footerAction: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                    footerActionLink: {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      "&:hover": {
                        color: theme.palette.primary.dark,
                      },
                    },
                    socialButtonsBlockButton: {
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "0.95rem",
                      textTransform: "none",
                    },
                    dividerLine: {
                      background: theme.palette.divider,
                    },
                    dividerText: {
                      color: theme.palette.text.secondary,
                      fontSize: "0.875rem",
                    },
                    identityPreviewEditButton: {
                      color: theme.palette.primary.main,
                    },
                    formFieldSuccessText: {
                      color: theme.palette.success.main,
                    },
                    formFieldErrorText: {
                      color: theme.palette.error.main,
                    },
                    otpCodeFieldInput: {
                      borderRadius: "8px",
                    },
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                    logoPlacement: "none",
                  },
                }}
              />
            )}
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Snack Basket Order Management. All rights
            reserved.
          </Typography>
          <Box
            sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Typography
              variant="body2"
              component="a"
              href="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              Help
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography
              variant="body2"
              component="a"
              href="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              Privacy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography
              variant="body2"
              component="a"
              href="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              Terms
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ClerkAuthWrapper;
