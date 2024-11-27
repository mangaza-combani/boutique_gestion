import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  IconButton,
  MenuItem,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Chip,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Save as SaveIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useInventory } from '../../context/InventoryContext';

const NewMovement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { products, addMovement } = useInventory();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [movementData, setMovementData] = useState({
    type: '',
    product: null,
    size: '',
    quantity: '',
    reference: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  const movementTypes = [
    { value: 'purchase', label: 'Achat', color: 'primary' },
    { value: 'sale', label: 'Vente', color: 'success' },
    { value: 'return', label: 'Retour', color: 'warning' },
    { value: 'loss', label: 'Perte', color: 'error' },
    { value: 'adjustment', label: 'Ajustement', color: 'info' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!movementData.product || !movementData.type || !movementData.quantity) {
      setFormError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await addMovement({
        productId: movementData.product.id,
        type: movementData.type,
        quantity: parseInt(movementData.quantity) * (movementData.type === 'sale' || movementData.type === 'loss' ? -1 : 1),
        size: movementData.size,
        reference: movementData.reference,
        note: movementData.note,
        date: new Date(movementData.date).toISOString(),
      });

      navigate('/inventory/movements');
    } catch (error) {
      setFormError('Une erreur est survenue lors de l\'enregistrement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Nouveau mouvement de stock
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type de mouvement</InputLabel>
                <Select
                  value={movementData.type}
                  onChange={(e) => setMovementData({ ...movementData, type: e.target.value })}
                  required
                >
                  {movementTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Chip
                        size="small"
                        label={type.label}
                        color={type.color}
                        sx={{ mr: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.reference})`}
                value={movementData.product}
                onChange={(e, newValue) => setMovementData({ 
                  ...movementData, 
                  product: newValue,
                  size: '' // Reset size when product changes
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Produit"
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ref: {option.reference} | Stock total: {option.totalStock}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>

            {movementData.product && movementData.product.stock && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Taille</InputLabel>
                  <Select
                    value={movementData.size}
                    onChange={(e) => setMovementData({ ...movementData, size: e.target.value })}
                    required
                  >
                    {Object.entries(movementData.product.stock).map(([size, quantity]) => (
                      <MenuItem key={size} value={size}>
                        {size} (Stock actuel: {quantity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantité"
                type="number"
                required
                value={movementData.quantity}
                onChange={(e) => setMovementData({ ...movementData, quantity: e.target.value })}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={movementData.date}
                onChange={(e) => setMovementData({ ...movementData, date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Référence"
                value={movementData.reference}
                onChange={(e) => setMovementData({ ...movementData, reference: e.target.value })}
                placeholder="Ex: BON-001, FAC-123..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Note"
                value={movementData.note}
                onChange={(e) => setMovementData({ ...movementData, note: e.target.value })}
              />
            </Grid>

            {movementData.product && movementData.size && (
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: 1
                }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Aperçu du changement
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Stock actuel ({movementData.size})</Typography>
                    <Typography>
                      {movementData.product.stock[movementData.size]}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Nouveau stock</Typography>
                    <Typography fontWeight="bold" color={
                      movementData.type === 'sale' || movementData.type === 'loss'
                        ? movementData.product.stock[movementData.size] - parseInt(movementData.quantity || 0) < 0
                          ? 'error.main'
                          : 'success.main'
                        : 'success.main'
                    }>
                      {movementData.type === 'sale' || movementData.type === 'loss'
                        ? movementData.product.stock[movementData.size] - parseInt(movementData.quantity || 0)
                        : movementData.product.stock[movementData.size] + parseInt(movementData.quantity || 0)
                      }
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                startIcon={<SaveIcon />}
              >
                Enregistrer
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default NewMovement;