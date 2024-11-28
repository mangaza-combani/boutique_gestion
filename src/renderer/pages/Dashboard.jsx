import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  History as HistoryIcon,
  BarChart as StatsIcon,
  Inventory as InventoryIcon,
  People as CustomersIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AttachMoney as CashIcon,
  Receipt as ReceiptIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const MenuCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.background.paper,
  borderRadius: '16px',
  marginBottom: theme.spacing(3),
  boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const UserProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: 'Administration',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />,
      color: '#D32F2F', // Rouge pour distinguer l'administration
      onClick: () => navigate('/admin'),
      description: 'Configuration du système',
      requireAdmin: true, // Pour contrôler l'affichage selon le rôle
      features: [
        'Gestion des utilisateurs',
        'Configuration des rôles',
        'Paramètres système',
        'Personnalisation des documents'
      ]
    },
    {
      title: 'Encaissement',
      icon: <CartIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      onClick: () => navigate('/new-sale'),
      description: 'Effectuer un encaissement',
    },
    {
      title: 'Historique',
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      onClick: () => navigate('/history'),
      description: 'Consulter les ventes précédentes',
    },
    {
      title: 'Stock',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#2E7D32',
      onClick: () => navigate('/inventory'),
      description: 'Gérer les produits et le stock',
    },
    {
      title: 'Clients',
      icon: <CustomersIcon sx={{ fontSize: 40 }} />,
      color: '#1976D2',
      onClick: () => navigate('/customers'),
      description: 'Base de données clients',
    },
    {
      title: 'Statistiques',
      icon: <StatsIcon sx={{ fontSize: 40 }} />,
      color: '#9C27B0',
      onClick: () => navigate('/stats'),
      description: 'Rapports et analyses',
    },
    {
      title: 'Caisse',
      icon: <CashIcon sx={{ fontSize: 40 }} />,
      color: '#ED6C02',
      onClick: () => navigate('/cash-register'),
      description: 'Gestion de la caisse',
    },
  ];

  const QuickStats = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  }));

  return (
    <Box 
      sx={{ 
        p: 3,
        minHeight: '100vh',
        background: theme.palette.grey[50],
      }}
    >
      <Header>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Point de Vente
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <UserProfile>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <UserIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vendeur
              </Typography>
            </Box>
          </UserProfile>
          <Divider orientation="vertical" flexItem />
          <IconButton color="primary" onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </IconButton>
          <IconButton color="error" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Header>

      {/* Quick Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <QuickStats>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <ReceiptIcon />
            </Avatar>
            <Box>
              <Typography color="text.secondary" variant="body2">
                Ventes du jour
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                1,234 €
              </Typography>
            </Box>
          </QuickStats>
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickStats>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <CartIcon />
            </Avatar>
            <Box>
              <Typography color="text.secondary" variant="body2">
                encaissement
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                48
              </Typography>
            </Box>
          </QuickStats>
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickStats>
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <InventoryIcon />
            </Avatar>
            <Box>
              <Typography color="text.secondary" variant="body2">
                Articles faibles en stock
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                7
              </Typography>
            </Box>
          </QuickStats>
        </Grid>
      </Grid>

      {/* Main Menu Grid */}
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MenuCard onClick={item.onClick}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(item.color, 0.1),
                    color: item.color,
                    width: 56,
                    height: 56,
                    mr: 2 
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 2,
                  bgcolor: item.color,
                  '&:hover': {
                    bgcolor: alpha(item.color, 0.9),
                  },
                }}
              >
                Accéder
              </Button>
            </MenuCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;