import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Description as InvoiceIcon,
  CreditCard as CardIcon,
  Payments as CashIcon,
  Person as CustomerIcon,
  AccessTime as TimeIcon,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

export const SaleDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [printMenu, setPrintMenu] = useState(null);

  // Données simulées de la vente
  const sale = {
    id: 'VNT-001',
    date: '2024-03-26T14:30:00',
    customer: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      { id: 1, name: 'T-shirt Basic (M)', quantity: 2, price: 39.99, total: 79.98 },
      { id: 2, name: 'Jean Slim (L)', quantity: 1, price: 79.99, total: 79.99 }
    ],
    paymentMethod: 'card',
    subtotal: 159.97,
    tax: 31.99,
    total: 191.96,
    status: 'completed',
    cashier: 'Alice Martin',
    register: 'CAISSE-01'
  };

  const handlePrint = (type) => {
    // Génération du contenu à imprimer
    let content = '';
    switch (type) {
      case 'receipt':
        content = generateReceipt(sale);
        break;
      case 'invoice':
        content = generateInvoice(sale);
        break;
      default:
        return;
    }

    // Envoi à l'imprimante via Electron
    window.api.invoke('print', { content, type });
    setPrintMenu(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Vente {id}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={(e) => setPrintMenu(e.currentTarget)}
        >
          Imprimer
        </Button>
      </Box>

      {/* Informations principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Informations générales
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TimeIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Date et heure
                  </Typography>
                </Box>
                <Typography>
                  {new Date(sale.date).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {sale.paymentMethod === 'card' ? (
                    <CardIcon color="action" fontSize="small" />
                  ) : (
                    <CashIcon color="action" fontSize="small" />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Paiement
                  </Typography>
                </Box>
                <Typography>
                  {sale.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CustomerIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Client
                  </Typography>
                </Box>
                <Typography>{sale.customer.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {sale.customer.email}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ReceiptIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Caisse
                  </Typography>
                </Box>
                <Typography>{sale.register}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {sale.cashier}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="h6" gutterBottom>
              Résumé
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Sous-total</Typography>
                <Typography>
                  {sale.subtotal.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>TVA</Typography>
                <Typography>
                  {sale.tax.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {sale.total.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Articles */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Article</TableCell>
                <TableCell align="right">Prix unitaire</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sale.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    {item.price.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.total.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Menu d'impression */}
      <Menu
        anchorEl={printMenu}
        open={Boolean(printMenu)}
        onClose={() => setPrintMenu(null)}
      >
        <MenuItem onClick={() => handlePrint('receipt')}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ticket de caisse</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePrint('invoice')}>
          <ListItemIcon>
            <InvoiceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Facture</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Fonctions d'impression
const generateReceipt = (sale) => {
  // Template pour ticket de caisse
  return `
    TICKET DE CAISSE
    ----------------
    ${sale.date}
    Caisse: ${sale.register}
    Vendeur: ${sale.cashier}

    Articles:
    ${sale.items.map(item => 
      `${item.name}
       ${item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}`
    ).join('\n')}

    Sous-total: ${sale.subtotal.toFixed(2)}
    TVA: ${sale.tax.toFixed(2)}
    TOTAL: ${sale.total.toFixed(2)}

    Paiement: ${sale.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
  `;
};

const generateInvoice = (sale) => {
  // Template pour facture
  return `
    FACTURE N° ${sale.id}
    ---------------------
    Date: ${new Date(sale.date).toLocaleDateString()}
    Client: ${sale.customer.name}
    Email: ${sale.customer.email}

    Articles:
    ${sale.items.map(item => 
      `${item.name}
       Quantité: ${item.quantity}
       Prix unitaire: ${item.price.toFixed(2)}€
       Total: ${item.total.toFixed(2)}€`
    ).join('\n\n')}

    Sous-total HT: ${sale.subtotal.toFixed(2)}€
    TVA (20%): ${sale.tax.toFixed(2)}€
    Total TTC: ${sale.total.toFixed(2)}€

    Mode de paiement: ${sale.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
  `;
};
export default SaleDetails;