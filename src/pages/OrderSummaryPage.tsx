import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useOrderStore } from "../services/orderStore";
import { useShopStore } from "../services/shopStore";
import { Order } from "../models/Order";
import { Shop } from "../models/Shop";
import PersonIcon from "@mui/icons-material/Person";

const OrderSummaryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById, currentOrder } = useOrderStore();
  const { shops } = useShopStore();
  const { user } = useUser();

  const [order, setOrder] = useState<Order | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    // Try to get order from state (coming from order creation)
    const orderId = location.state?.orderId;

    if (orderId) {
      const fetchedOrder = getOrderById(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      }
    } else if (currentOrder) {
      // Fallback to current order in store
      setOrder(currentOrder);
    } else {
      // No order found, redirect to home
      navigate("/");
    }
  }, [location.state, getOrderById, currentOrder, navigate]);

  useEffect(() => {
    if (order && shops.length > 0) {
      const shopData = shops.find((s) => s.id === order.shopId);
      setShop(shopData || null);
    }
  }, [order, shops]);

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

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
            Snack Basket Order Management
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                {user?.firstName?.charAt(0) || <PersonIcon />}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            icon={<CheckCircleOutlineIcon />}
            label="Order Completed"
            color="success"
            variant="outlined"
          />
        </Box>

        <Paper elevation={2} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ReceiptIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
            <Typography variant="h5">Order Summary</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {order.id}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Shop
              </Typography>
              <Typography variant="body1" gutterBottom>
                {shop ? shop.name : "Unknown Shop"}
              </Typography>

              {shop && (
                <>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Shop Contact
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {shop.phoneNumber}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Order Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {order.orderItems.map((item, index) => (
                  <Box
                    key={`order-${index}`}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom:
                        index < order.orderItems.length - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1">
                        {item.sku.name} ({item.sku.id})
                      </Typography>
                      <Typography variant="body1">
                        ₹{item.sku.price.toFixed(2)} × {item.quantity}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {item.sku.description}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{(item.sku.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Order Totals */}
        <Paper
          elevation={3}
          sx={{ mt: 4, p: 3, borderRadius: 2 }}
          className="summary-section"
        >
          <Typography variant="h6" gutterBottom>
            Order Total
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box className="summary-row">
            <Typography>Subtotal:</Typography>
            <Typography>₹{order.totalAmount.toFixed(2)}</Typography>
          </Box>

          {order.discountAmount && order.discountAmount > 0 && (
            <Box className="summary-row">
              <Typography>
                Discount{order.discountCode ? ` (${order.discountCode})` : ""}:
              </Typography>
              <Typography color="error.main">
                -₹{order.discountAmount.toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box className="summary-total">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">
              ₹{order.finalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/order")}
          >
            Create New Order
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderSummaryPage;
