import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Receipt as ReceiptIcon,
  Timeline as TimelineIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
    sx={{ py: 3 }}
  >
    {value === index && children}
  </Box>
);

export const CustomerDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  // Données simulées du client
  const customer = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0123456789',
    birthDate: '1990-01-01',
    billingAddress: {
      street: '123 Rue Exemple',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
    },
    preferences: {
      newsletter: true,
      smsNotifications: true,
    },
    stats: {
      totalPurchases: 1250.50,
      numberOfOrders: 15,
      averageOrderValue: 83.37,
      lastPurchase: '2024-03-25',
    },
    purchases: [
      {
        id: 'VNT-001',
        date: '2024-03-25',
        amount: 150.00,
        items: [
          { name: 'T-shirt Basic (M)', quantity: 2, price: 39.99 },
          { name: 'Jean Slim (L)', quantity: 1, price: 79.99 }
        ],
        status: 'completed'
      },
      // Plus d'achats...
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {customer.name}
          </Typography>
          <Typography color="text.secondary">
            Client depuis {new Date(customer.purchases[0]?.date).toLocaleDateString()}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/customers/edit/${id}`)}
        >
          Modifier
        </Button>
      </Box>

      {/* Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Total des achats
            </Typography>
            <Typography variant="h4" color="primary">
              {customer.stats.totalPurchases.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Nombre de commandes
            </Typography>
            <Typography variant="h4">
              {customer.stats.numberOfOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Panier moyen
            </Typography>
            <Typography variant="h4">
              {customer.stats.averageOrderValue.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Dernier achat
            </Typography>
            <Typography variant="h4">
              {new Date(customer.stats.lastPurchase).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Contenu principal */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Informations" />
          <Tab label="Historique des achats" />
          <Tab label="Préférences" />
        </Tabs>

        {/* Panneau Informations */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations de contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" />
                  <Typography>{customer.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" />
                  <Typography>{customer.phone}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Adresse de facturation
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon color="action" />
                <Box>
                  <Typography>{customer.billingAddress.street}</Typography>
                  <Typography>
                    {customer.billingAddress.postalCode} {customer.billingAddress.city}
                  </Typography>
                  <Typography>{customer.billingAddress.country}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panneau Historique des achats */}
        <TabPanel value={activeTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>N° Commande</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Produits</TableCell>
                  <TableCell align="right">Montant</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customer.purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.id}</TableCell>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {purchase.items.map((item, index) => (
                          <Typography key={index} variant="body2">
                            {item.quantity}x {item.name}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {purchase.amount.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={purchase.status === 'completed' ? 'Terminé' : 'En cours'}
                        color={purchase.status === 'completed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small"
                        onClick={() => window.open(`/sales/${purchase.id}`, '_blank')}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small">
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Panneau Préférences */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Préférences de communication
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label="Newsletter"
                    color={customer.preferences.newsletter ? 'success' : 'default'}
                    variant="outlined"
                  />
                  <Chip
                    label="SMS"
                    color={customer.preferences.smsNotifications ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CustomerDetail;