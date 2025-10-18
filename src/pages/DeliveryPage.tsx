import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

import { useUser, useClerk } from "@clerk/clerk-react";
import { useShopStore } from "../services/shopStore";
import { useOrderStore } from "../services/orderStore";
import { useDeliveryStore } from "../services/deliveryStore";
import {
  Delivery,
  DeliveryStatus,
  DeliveryStatusColors,
  DeliveryStatusLabels,
} from "../models/Delivery";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Import already exists at the top, removing duplicate

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`delivery-tabpanel-${index}`}
      aria-labelledby={`delivery-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Delivery phases
const DELIVERY_PHASES: DeliveryStatus[] = [
  "Packaging",
  "Transit",
  "ShipToOutlet",
  "OutForDelivery",
  "Delivered",
];

const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { fetchDeliveries, updateDeliveryStatus } = useDeliveryStore();
  const { shops, fetchShops } = useShopStore();
  const { orders, fetchOrders } = useOrderStore();
  const [allDeliveries, setAllDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchShops();
      await fetchOrders();
      await fetchDeliveries();
      setAllDeliveries(useDeliveryStore.getState().deliveries);
    };

    loadData();
  }, [fetchShops, fetchOrders, fetchDeliveries]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    signOut();
    navigate("/");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const handleStatusUpdate = async (
    deliveryId: string,
    newStatus: DeliveryStatus,
  ) => {
    try {
      if (!deliveryId) return;
      await updateDeliveryStatus(deliveryId, newStatus, "", "");
      setAllDeliveries(useDeliveryStore.getState().deliveries);
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  // Get shop name by id
  const getShopName = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    return shop ? shop.name : "Unknown Shop";
  };

  // Get order details
  const getOrderDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    return order
      ? {
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          items: order.orderItems.length,
          amount: order.finalAmount,
        }
      : { orderDate: "Unknown", items: 0, amount: 0 };
  };

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = allDeliveries.filter((delivery) => {
    const shopName = getShopName(delivery.shopId);
    const matchesSearch =
      shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.includes(searchTerm) ||
      (delivery.trackingNumber && delivery.trackingNumber.includes(searchTerm));

    if (statusFilter === "all") {
      return matchesSearch;
    }

    return matchesSearch && delivery.status === statusFilter;
  });

  const getStatusChip = (status: DeliveryStatus) => {
    const color = DeliveryStatusColors[status];
    const label = DeliveryStatusLabels[status];

    let icon;
    switch (status) {
      case "Packaging":
        icon = <PendingIcon />;
        break;
      case "Transit":
        icon = <DeliveryDiningIcon />;
        break;
      case "ShipToOutlet":
        icon = <LocalShippingIcon />;
        break;
      case "OutForDelivery":
        icon = <DeliveryDiningIcon />;
        break;
      case "Delivered":
        icon = <CheckCircleIcon />;
        break;
      default:
        icon = <PendingIcon />;
    }

    return (
      <Chip
        icon={icon}
        label={label}
        size="small"
        sx={{ bgcolor: `${color}20`, color: color, fontWeight: 500 }}
      />
    );
  };

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
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
            aria-label="back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Delivery Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track and manage your deliveries efficiently
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="delivery tabs"
              indicatorColor="primary"
              textColor="primary"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  py: 2,
                },
              }}
            >
              <Tab label="All Deliveries" />
              {DELIVERY_PHASES.map((phase) => (
                <Tab key={phase} label={DeliveryStatusLabels[phase]} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Search and Filter */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search by shop name or delivery ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                >
                  <InputLabel id="status-filter-label">
                    Filter by Status
                  </InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    {DELIVERY_PHASES.map((phase) => (
                      <MenuItem key={phase} value={phase}>
                        {DeliveryStatusLabels[phase]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* All Deliveries Tab */}
            <TabPanel value={tabValue} index={0}>
              <DeliveryTable
                deliveries={filteredDeliveries}
                getStatusChip={getStatusChip}
                getShopName={getShopName}
                getOrderDetails={getOrderDetails}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabPanel>

            {/* Status-specific Tabs */}
            {DELIVERY_PHASES.map((phase, index) => (
              <TabPanel key={phase} value={tabValue} index={index + 1}>
                <DeliveryTable
                  deliveries={filteredDeliveries.filter(
                    (d) => d.status === phase,
                  )}
                  getStatusChip={getStatusChip}
                  getShopName={getShopName}
                  getOrderDetails={getOrderDetails}
                  onStatusUpdate={handleStatusUpdate}
                />
              </TabPanel>
            ))}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            bgcolor: "#f0f7ff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocalShippingIcon
              sx={{ color: "primary.main", mr: 2, fontSize: 28 }}
            />
            <Typography variant="h6" fontWeight="600">
              Delivery Statistics
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {allDeliveries?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Deliveries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {allDeliveries?.filter((d) => d.status === "Packaging")
                    .length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {allDeliveries?.filter((d) =>
                    ["Transit", "ShipToOutlet", "OutForDelivery"].includes(
                      d.status,
                    ),
                  ).length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Transit
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {allDeliveries?.filter((d) => d.status === "Delivered")
                    .length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delivered
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

// Delivery Table Component
interface DeliveryTableProps {
  deliveries: Delivery[];
  getStatusChip: (status: DeliveryStatus) => JSX.Element;
  getShopName: (shopId: string) => string;
  getOrderDetails: (orderId: string) => {
    orderDate: string;
    items: number;
    amount: number;
  };
  onStatusUpdate: (deliveryId: string, status: DeliveryStatus) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  getStatusChip,
  getShopName,
  getOrderDetails,
  onStatusUpdate,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    deliveryId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(deliveryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleStatusChange = (
    deliveryId: string,
    newStatus: DeliveryStatus,
  ) => {
    onStatusUpdate(deliveryId, newStatus);
    handleMenuClose();
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none" }}>
      <Table aria-label="deliveries table">
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Tracking #</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Shop Name</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Est. Delivery</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">
                  No deliveries found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            deliveries.map((delivery) => {
              const { orderDate, items, amount } = getOrderDetails(
                delivery.orderId,
              );
              const nextStatus =
                DELIVERY_PHASES[DELIVERY_PHASES.indexOf(delivery.status) + 1];

              return (
                <TableRow
                  key={delivery.id}
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                >
                  <TableCell>{delivery.trackingNumber}</TableCell>
                  <TableCell component="th" scope="row">
                    #{delivery.orderId}
                  </TableCell>
                  <TableCell>{getShopName(delivery.shopId)}</TableCell>
                  <TableCell>{orderDate}</TableCell>
                  <TableCell>{items}</TableCell>
                  <TableCell align="right">₹{amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusChip(delivery.status)}</TableCell>
                  <TableCell>
                    {delivery.actualDeliveryDate
                      ? new Date(
                          delivery.actualDeliveryDate,
                        ).toLocaleDateString()
                      : delivery.estimatedDeliveryDate
                        ? new Date(
                            delivery.estimatedDeliveryDate,
                          ).toLocaleDateString()
                        : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => handleMenuClick(e, delivery.id || "")}
                      endIcon={<MoreVertIcon fontSize="small" />}
                      sx={{
                        borderRadius: 8,
                        textTransform: "none",
                        fontSize: "0.75rem",
                      }}
                    >
                      Actions
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenu === delivery.id}
                      onClose={handleMenuClose}
                    >
                      {nextStatus && (
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(delivery.id || "", nextStatus)
                          }
                        >
                          Update to {DeliveryStatusLabels[nextStatus]}
                        </MenuItem>
                      )}
                      <MenuItem>View Details</MenuItem>
                      <MenuItem>Contact Shop</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeliveryPage;
