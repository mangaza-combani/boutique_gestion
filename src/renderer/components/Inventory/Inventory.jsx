
import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Save as SaveIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { LoadingButton } from '@mui/lab';

const InventoryCount = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { products, updateInventory } = useInventory();
  const [search, setSearch] = useState('');
  const [inventoryData, setInventoryData] = useState(
    products.map(product => ({
      ...product,
      counted: false,
      newStock: {},
      differences: {},
      notes: ''
    }))
  );
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return inventoryData.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.reference.toLowerCase().includes(search.toLowerCase())
    );
  }, [inventoryData, search]);

  const handleStockCount = (productId, size, value) => {
    setInventoryData(prev => prev.map(product => {
      if (product.id === productId) {
        const newStock = { ...product.newStock, [size]: parseInt(value) || 0 };
        const differences = { ...product.differences };
        differences[size] = newStock[size] - product.stock[size];
        
        return {
          ...product,
          newStock,
          differences,
          counted: true
        };
      }
      return product;
    }));
  };

  const handleSaveInventory = async () => {
    setLoading(true);
    try {
      const updatedProducts = inventoryData.filter(p => p.counted);
      for (const product of updatedProducts) {
        await updateInventory(product.id, {
          stock: { ...product.stock, ...product.newStock },
          lastInventory: new Date().toISOString(),
          notes: product.notes
        });
      }
      navigate('/inventory');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => ({
    total: products.length,
    counted: inventoryData.filter(p => p.counted).length,
    differences: inventoryData.filter(p => 
      p.counted && Object.values(p.differences).some(diff => diff !== 0)
    ).length
  }), [inventoryData, products]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Inventaire
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => {/* Logique d'impression */}}
          >
            Imprimer feuille
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={stats.counted === 0}
          >
            Enregistrer l'inventaire
          </LoadingButton>
        </Box>
      </Box>

      {/* Stats rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" gutterBottom>
              Produits à inventorier
            </Typography>
            <Typography variant="h4">
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" gutterBottom>
              Produits comptés
            </Typography>
            <Typography variant="h4" color="success.main">
              {stats.counted}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {((stats.counted / stats.total) * 100).toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" gutterBottom>
              Différences trouvées
            </Typography>
            <Typography variant="h4" color="warning.main">
              {stats.differences}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <TextField
        fullWidth
        placeholder="Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Table d'inventaire */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Référence</TableCell>
              <TableCell align="center">Taille</TableCell>
              <TableCell align="right">Stock théorique</TableCell>
              <TableCell align="right">Stock compté</TableCell>
              <TableCell align="right">Différence</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              Object.entries(product.stock).map(([size, theoreticalStock], index) => (
                <TableRow 
                  key={`${product.id}-${size}`}
                  sx={{
                    bgcolor: index === 0 ? alpha(theme.palette.grey[100], 0.5) : 'inherit'
                  }}
                >
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={Object.keys(product.stock).length}>
                        <Typography fontWeight="medium">
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell rowSpan={Object.keys(product.stock).length}>
                        {product.reference}
                      </TableCell>
                    </>
                  )}
                  <TableCell align="center">{size}</TableCell>
                  <TableCell align="right">{theoreticalStock}</TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      value={product.newStock[size] || ''}
                      onChange={(e) => handleStockCount(product.id, size, e.target.value)}
                      sx={{ width: 100 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {product.differences[size] && (
                      <Typography
                        color={product.differences[size] < 0 ? 'error.main' : 'success.main'}
                      >
                        {product.differences[size] > 0 ? '+' : ''}
                        {product.differences[size]}
                      </Typography>
                    )}
                  </TableCell>
                  {index === 0 && (
                    <TableCell rowSpan={Object.keys(product.stock).length}>
                      <TextField
                        multiline
                        rows={2}
                        size="small"
                        fullWidth
                        value={product.notes}
                        onChange={(e) => setInventoryData(prev => prev.map(p => 
                          p.id === product.id ? { ...p, notes: e.target.value } : p
                        ))}
                      />
                    </TableCell>
                  )}
                  {index === 0 && (
                    <TableCell rowSpan={Object.keys(product.stock).length}>
                      <Chip
                        size="small"
                        label={product.counted ? "Compté" : "En attente"}
                        color={product.counted ? "success" : "default"}
                        icon={product.counted ? <CheckIcon /> : undefined}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmation */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Confirmer l'inventaire</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Vous avez compté {stats.counted} produits sur {stats.total}.
          </Typography>
          {stats.differences > 0 && (
            <Typography color="warning.main">
              {stats.differences} produits présentent des différences de stock.
            </Typography>
          )}
          <Typography sx={{ mt: 2 }}>
            Voulez-vous enregistrer cet inventaire ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Annuler
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleSaveInventory}
          >
            Confirmer
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryCount;