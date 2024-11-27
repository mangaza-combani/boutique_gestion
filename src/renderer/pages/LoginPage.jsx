import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CssBaseline,
  useTheme,
  alpha,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  StorefrontOutlined as StoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonOutline as UserIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Composants stylés personnalisés
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(145deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha('#ffffff', 0.95)} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  '& .MuiSvgIcon-root': {
    fontSize: 40,
    color: '#fff',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.95),
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      backgroundColor: '#ffffff',
      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: theme.palette.text.secondary,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
  },
}));

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Identifiants incorrects');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.9)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm">
        <CssBaseline />
        <StyledPaper elevation={0}>
          <LogoContainer>
            <StoreIcon />
          </LogoContainer>

          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            Point de Vente
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
            }}
          >
            Connectez-vous à votre espace de gestion
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  animation: 'slideDown 0.3s ease-out',
                  '@keyframes slideDown': {
                    from: { transform: 'translateY(-20px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 },
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Identifiant"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
            >
              Se connecter
            </StyledButton>

            <Typography 
              variant="caption" 
              align="center" 
              sx={{ 
                mt: 3,
                display: 'block',
                color: theme.palette.text.secondary,
              }}
            >
              © {new Date().getFullYear()} Système de Point de Vente. Tous droits réservés.
            </Typography>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}