import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Print as PrintIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useInventory } from '../../context/InventoryContext';
import {StockAdjustmentDialog} from './StockAdjustmentDialog';
import {MovementHistoryDialog }from './StockAdjustmentDialog';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { products, addMovement } = useInventory();
  const [activeTab, setActiveTab] = useState(0);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [movementHistoryOpen, setMovementHistoryOpen] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Produit non trouvé</Typography>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </Box>
    );
  }

  const handleStockAdjustment = (adjustment) => {
    addMovement({
      productId: product.id,
      type: 'adjustment',
      ...adjustment,
      date: new Date().toISOString(),
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ref: {product.reference}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => {/* Logique d'impression */}}
          >
            Imprimer fiche
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/inventory/edit/${product.id}`)}
          >
            Modifier
          </Button>
        </Box>
      </Box>

      {/* Informations rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Stock total
              </Typography>
              <Typography variant="h4" color={
                product.totalStock <= product.minStock ? 'error.main' : 'success.main'
              }>
                {product.totalStock}
              </Typography>
              {product.totalStock <= product.minStock && (
                <Chip
                  size="small"
                  color="error"
                  label="Stock faible"
                  icon={<InventoryIcon />}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Prix d'achat
              </Typography>
              <Typography variant="h4">
                {product.purchasePrice.toFixed(2)} €
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Dernier achat: {new Date(product.lastPurchase).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Prix de vente
              </Typography>
              <Typography variant="h4">
                {product.sellingPrice.toFixed(2)} €
              </Typography>
              <Typography variant="body2" color="success.main">
                Marge: {((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valeur du stock
              </Typography>
              <Typography variant="h4" color="primary.main">
                {(product.totalStock * product.purchasePrice).toFixed(2)} €
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions rapides */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setAdjustmentDialogOpen(true)}
        >
          Ajuster le stock
        </Button>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => setMovementHistoryOpen(true)}
        >
          Historique des mouvements
        </Button>
      </Box>

      {/* Onglets de détail */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Détails" />
          <Tab label="Stock par taille" />
          <Tab label="Mouvements" />
          <Tab label="Statistiques" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Informations générales
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Catégorie</TableCell>
                        <TableCell>{product.category}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fournisseur</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Emplacement</TableCell>
                        <TableCell>{product.location}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dernier inventaire</TableCell>
                        <TableCell>
                          {new Date(product.lastInventory).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Seuils de stock
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Stock minimum</TableCell>
                        <TableCell>{product.minStock}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Stock maximum</TableCell>
                        <TableCell>{product.maxStock}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Stock optimal</TableCell>
                        <TableCell>
                          {Math.round((product.minStock + product.maxStock) / 2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Taille</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Stock minimum</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(product.stock).map(([size, quantity]) => (
                    <TableRow key={size}>
                      <TableCell>{size}</TableCell>
                      <TableCell align="right">{quantity}</TableCell>
                      <TableCell align="right">
                        {Math.round(product.minStock / Object.keys(product.stock).length)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={quantity === 0 ? "Rupture" : quantity <= 3 ? "Faible" : "OK"}
                          color={quantity === 0 ? "error" : quantity <= 3 ? "warning" : "success"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => setAdjustmentDialogOpen(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={movement.type === 'purchase' ? 'Achat' : 'Ajustement'}
                          color={movement.type === 'purchase' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {movement.quantity}
                      </TableCell>
                      <TableCell>{movement.reference}</TableCell>
                      <TableCell>{movement.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 3 && (
            <Box sx={{ height: 400 }}>
              {/* Graphiques de statistiques */}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <StockAdjustmentDialog
        open={adjustmentDialogOpen}
        onClose={() => setAdjustmentDialogOpen(false)}
        product={product}
        onAdjust={handleStockAdjustment}
      />

      <MovementHistoryDialog
        open={movementHistoryOpen}
        onClose={() => setMovementHistoryOpen(false)}
        movements={product.movements}
      />
    </Box>
  );
};

export default ProductDetails;