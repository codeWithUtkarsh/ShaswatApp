import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Mock authentication - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful login
      localStorage.setItem('isLoggedIn', 'true');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        email: 'Invalid email or password',
        password: 'Invalid email or password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Container maxWidth="sm" sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      py: 4
    }}>
      <Card elevation={5} sx={{
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        pb: 3,
      }}>
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <StorefrontIcon sx={{ fontSize: 40 }} />
        </Box>

        <CardContent sx={{ pt: 6, pb: 2, px: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" component="h1" align="center" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Sign in to continue to Shop & Order Management
          </Typography>

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                autoFocus
              />

              <FormControl variant="outlined" fullWidth error={!!errors.password}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  required
                />
                {errors.password && (
                  <FormHelperText>{errors.password}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                Don't have an account? Contact your administrator
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
