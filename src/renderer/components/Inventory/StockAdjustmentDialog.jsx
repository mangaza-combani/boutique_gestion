// src/pages/Inventory/components/ProductDetails/dialogs/index.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

// Types et constantes
const MOVEMENT_REASONS = {
  increase: [
    { value: 'purchase', label: 'Achat' },
    { value: 'return', label: 'Retour client' },
    { value: 'inventory', label: 'Ajustement inventaire' },
    { value: 'other', label: 'Autre' }
  ],
  decrease: [
    { value: 'sale', label: 'Vente' },
    { value: 'loss', label: 'Perte/Casse' },
    { value: 'inventory', label: 'Ajustement inventaire' },
    { value: 'other', label: 'Autre' }
  ]
};

const MOVEMENT_TYPE_CONFIG = {
  purchase: { label: 'Achat', color: 'primary' },
  sale: { label: 'Vente', color: 'success' },
  return: { label: 'Retour', color: 'warning' },
  adjustment: { label: 'Ajustement', color: 'info' },
};

// Composant d'ajustement de stock
export const StockAdjustmentDialog = ({ open, onClose, product, onAdjust }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [adjustment, setAdjustment] = useState({
    type: 'increase',
    quantity: '',
    size: Object.keys(product.stock)[0],
    reason: '',
    note: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAdjust({
        ...adjustment,
        quantity: Number(adjustment.quantity) * (adjustment.type === 'decrease' ? -1 : 1)
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajustement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNewStock = () => {
    if (!adjustment.quantity) return product.stock[adjustment.size];
    return product.stock[adjustment.size] + (
      adjustment.type === 'increase' 
        ? Number(adjustment.quantity) 
        : -Number(adjustment.quantity)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Ajustement du stock - {product.name}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Type d'ajustement */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type d'ajustement</InputLabel>
              <Select
                value={adjustment.type}
                onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value })}
              >
                <MenuItem value="increase">Augmentation</MenuItem>
                <MenuItem value="decrease">Diminution</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Quantité et taille */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantité"
              type="number"
              value={adjustment.quantity}
              onChange={(e) => setAdjustment({ ...adjustment, quantity: e.target.value })}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Taille</InputLabel>
              <Select
                value={adjustment.size}
                onChange={(e) => setAdjustment({ ...adjustment, size: e.target.value })}
              >
                {Object.entries(product.stock).map(([size, quantity]) => (
                  <MenuItem key={size} value={size}>
                    {size} (Stock actuel: {quantity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Raison et note */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Raison</InputLabel>
              <Select
                value={adjustment.reason}
                onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
              >
                {MOVEMENT_REASONS[adjustment.type].map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Note"
              value={adjustment.note}
              onChange={(e) => setAdjustment({ ...adjustment, note: e.target.value })}
            />
          </Grid>

          {/* Aperçu */}
          <Grid item xs={12}>
            <Box sx={{ 
              bgcolor: alpha(theme.palette.info.main, 0.1), 
              p: 2, 
              borderRadius: 1 
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Aperçu du changement
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Stock actuel ({adjustment.size})</Typography>
                <Typography>{product.stock[adjustment.size]}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography>Nouveau stock</Typography>
                <Typography fontWeight="bold">
                  {calculateNewStock()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <LoadingButton 
          loading={loading}
          variant="contained"
          onClick={handleSubmit}
          disabled={!adjustment.quantity || !adjustment.reason}
        >
          Confirmer l'ajustement
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

// Composant d'historique des mouvements
export const MovementHistoryDialog = ({ open, onClose, movements }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const filteredMovements = movements.filter(movement =>
    movement.reference?.toLowerCase().includes(search.toLowerCase()) ||
    movement.note?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6">
          Historique des mouvements
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Barre de recherche et export */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item flex={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {/* Export logic */}}
              >
                Exporter
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Table des mouvements */}
        <TableContainer>
          <Table size="small">
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
              {filteredMovements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((movement) => {
                  const typeConfig = MOVEMENT_TYPE_CONFIG[movement.type] || 
                    MOVEMENT_TYPE_CONFIG.adjustment;
                  return (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={typeConfig.label}
                          color={typeConfig.color}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={movement.quantity >= 0 ? 'success.main' : 'error.main'}
                        >
                          {movement.quantity >= 0 ? '+' : ''}{movement.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>{movement.reference}</TableCell>
                      <TableCell>{movement.note}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredMovements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Lignes par page"
        />
      </DialogContent>
    </Dialog>
  );
};