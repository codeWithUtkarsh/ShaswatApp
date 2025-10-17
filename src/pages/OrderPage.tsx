import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import OrderForm from '../components/OrderForm';

const OrderPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box className="page-header">
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Order
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Add a new order with SKUs and quantities, and track returns
        </Typography>
      </Box>

      <OrderForm />
    </Container>
  );
};

export default OrderPage;
