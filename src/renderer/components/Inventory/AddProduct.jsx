// src/pages/Inventory/components/AddProduct/index.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  InputAdornment,
  Switch,
  FormControlLabel,
  FormHelperText,
  useTheme,
  alpha,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  ColorLens as ColorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const UNIT_TYPES = {
  CLOTHING_SIZE: 'clothing_size',
  AGE: 'age',
  SHOE_SIZE: 'shoe_size',
  VOLUME: 'volume',
  PUFF_DRAW: 'puff_draw',
  STORAGE: 'storage',
  NONE: 'none'
};

const SIZE_CONFIGS = {
  [UNIT_TYPES.CLOTHING_SIZE]: {
    label: 'Tailles vêtements',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    supportsColors: true,
    unit: ''
  },
  [UNIT_TYPES.AGE]: {
    label: 'Âges',
    values: ['0-3m', '3-6m', '6-12m', '1an', '2ans', '3ans', '4ans', '5ans', '6ans'],
    supportsColors: true,
    unit: 'ans'
  },
  [UNIT_TYPES.SHOE_SIZE]: {
    label: 'Pointures',
    values: Array.from({ length: 20 }, (_, i) => (35 + i).toString()),
    supportsColors: true,
    unit: 'EU'
  },
  [UNIT_TYPES.VOLUME]: {
    label: 'Volumes',
    values: ['30', '50', '100', '200', '500', '1000'],
    supportsColors: false,
    unit: 'ml'
  },
  [UNIT_TYPES.PUFF_DRAW]: {
    label: 'Tirages',
    values: ['500', '600', '800', '1500', '2000', '3000'],
    supportsColors: true,
    unit: 'puffs'
  },
  [UNIT_TYPES.STORAGE]: {
    label: 'Stockage',
    values: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
    supportsColors: true,
    unit: ''
  },
  [UNIT_TYPES.NONE]: {
    label: 'Aucune taille',
    values: ['unique'],
    supportsColors: true,
    unit: ''
  }
};

const COMMON_COLORS = [
  { name: 'Noir', code: '#000000' },
  { name: 'Blanc', code: '#FFFFFF' },
  { name: 'Rouge', code: '#FF0000' },
  { name: 'Bleu', code: '#0000FF' },
  { name: 'Vert', code: '#00FF00' },
  { name: 'Jaune', code: '#FFFF00' },
  { name: 'Rose', code: '#FFC0CB' },
  { name: 'Gris', code: '#808080' },
  { name: 'Marron', code: '#8B4513' },
  { name: 'Beige', code: '#F5F5DC' },
  { name: 'Violet', code: '#800080' },
  { name: 'Orange', code: '#FFA500' }
];

const ALERT_TYPES = {
  PERCENTAGE: 'percentage',
  QUANTITY: 'quantity'
};

const defaultStockAlerts = {
  type: ALERT_TYPES.QUANTITY,
  warningThreshold: 5,
  criticalThreshold: 2,
  notifyOnLow: true,
  notifyOnCritical: true,
};

export const AddProduct = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addProduct, categories } = useInventory();

  // États
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    category: '',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    supplier: '',
    minStock: '',
    maxStock: '',
    images: [],
    unitType: UNIT_TYPES.NONE,
    stockAlerts: defaultStockAlerts,
    location: '',
  });

  const [variants, setVariants] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestionnaires
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleUnitTypeChange = (event) => {
    const newUnitType = event.target.value;
    setFormData({
      ...formData,
      unitType: newUnitType,
      sizes: SIZE_CONFIGS[newUnitType].values.reduce((acc, size) => ({
        ...acc,
        [size]: 0
      }), {})
    });

    // Réinitialiser les variants si le type change
    setVariants([]);
  };

  const handleAddVariant = (color) => {
    const newSizes = {};
    SIZE_CONFIGS[formData.unitType].values.forEach(size => {
      newSizes[size] = 0;
    });

    setVariants([...variants, {
      color,
      sizes: newSizes
    }]);
  };

  const handleRemoveVariant = (colorName) => {
    setVariants(variants.filter(v => v.color.name !== colorName));
  };

  const handleStockChange = (colorName, size, value) => {
    setVariants(variants.map(variant => {
      if (variant.color.name === colorName) {
        return {
          ...variant,
          sizes: {
            ...variant.sizes,
            [size]: parseInt(value) || 0
          }
        };
      }
      return variant;
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const totalStock = variants.reduce((total, variant) => 
        total + Object.values(variant.sizes).reduce((sum, qty) => sum + qty, 0)
      , 0);

      const productData = {
        ...formData,
        totalStock,
        variants,
        hasVariants: variants.length > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addProduct(productData);
      navigate('/inventory');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Composant de configuration des alertes
  const StockAlertConfig = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Configuration des alertes de stock
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Type d'alerte</InputLabel>
            <Select
              value={formData.stockAlerts.type}
              onChange={(e) => handleChange('stockAlerts')({
                target: {
                  value: {
                    ...formData.stockAlerts,
                    type: e.target.value
                  }
                }
              })}
            >
              <MenuItem value={ALERT_TYPES.QUANTITY}>Par quantité fixe</MenuItem>
              <MenuItem value={ALERT_TYPES.PERCENTAGE}>Par pourcentage</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Seuil d'avertissement"
            value={formData.stockAlerts.warningThreshold}
            onChange={(e) => handleChange('stockAlerts')({
              target: {
                value: {
                  ...formData.stockAlerts,
                  warningThreshold: parseInt(e.target.value)
                }
              }
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formData.stockAlerts.type === ALERT_TYPES.PERCENTAGE ? '%' : 'unités'}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Seuil critique"
            value={formData.stockAlerts.criticalThreshold}
            onChange={(e) => handleChange('stockAlerts')({
              target: {
                value: {
                  ...formData.stockAlerts,
                  criticalThreshold: parseInt(e.target.value)
                }
              }
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formData.stockAlerts.type === ALERT_TYPES.PERCENTAGE ? '%' : 'unités'}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.stockAlerts.notifyOnLow}
                onChange={(e) => handleChange('stockAlerts')({
                  target: {
                    value: {
                      ...formData.stockAlerts,
                      notifyOnLow: e.target.checked
                    }
                  }
                })}
              />
            }
            label="Notifier quand le stock est bas"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.stockAlerts.notifyOnCritical}
                onChange={(e) => handleChange('stockAlerts')({
                  target: {
                    value: {
                      ...formData.stockAlerts,
                      notifyOnCritical: e.target.checked
                    }
                  }
                })}
              />
            }
            label="Notifier quand le stock est critique"
          />
        </Grid>
      </Grid>
    );
  };

  // Composant de gestion des variants
  const VariantManager = () => {
    const [customColor, setCustomColor] = useState({ name: '', code: '#000000' });

    return (
      <>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Variantes de couleur
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowColorPicker(true)}
            >
              Ajouter une couleur
            </Button>
          </Box>
        </Grid>

        {variants.map((variant) => (
          <Grid item xs={12} key={variant.color.name}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: variant.color.code,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                  <Typography>{variant.color.name}</Typography>
                </Box>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleRemoveVariant(variant.color.name)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                {SIZE_CONFIGS[formData.unitType].values.map(size => (
                  <Grid item xs={6} sm={4} md={3} key={size}>
                    <TextField
                      fullWidth
                      type="number"
                      label={`${size}${SIZE_CONFIGS[formData.unitType].unit ? ` ${SIZE_CONFIGS[formData.unitType].unit}` : ''}`}
                      value={variant.sizes[size] || 0}
                      onChange={(e) => handleStockChange(variant.color.name, size, e.target.value)}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}

        <Dialog 
          open={showColorPicker} 
          onClose={() => setShowColorPicker(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Ajouter une couleur</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Couleurs prédéfinies
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {COMMON_COLORS.map(color => (
                    <Tooltip title={color.name} key={color.name}>
                      <Box
                        onClick={() => {
                          handleAddVariant(color);
                          setShowColorPicker(false);
                        }}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: color.code,
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>ou</Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom de la couleur"
                  value={customColor.name}
                  onChange={(e) => setCustomColor({ ...customColor, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Code couleur"
                  value={customColor.code}
                  onChange={(e) => setCustomColor({ ...customColor, code: e.target.value })}
                  type="color"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowColorPicker(false)}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (customColor.name) {
                  handleAddVariant(customColor);
                  setShowColorPicker(false);
                  setCustomColor({ name: '', code: '#000000' });
                }
              }}
              disabled={!customColor.name}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/inventory')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Nouveau produit
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            {/* Informations de base */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du produit"
                required
                value={formData.name}
                onChange={handleChange('name')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Référence"
                required
                value={formData.reference}
                onChange={handleChange('reference')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleChange('category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emplacement"
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>

            {/* Prix et stock */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Prix et stock
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix d'achat"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                value={formData.purchasePrice}
                onChange={handleChange('purchasePrice')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix de vente"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                value={formData.sellingPrice}
                onChange={handleChange('sellingPrice')}
              />
            </Grid>

            {/* Type d'unité et tailles */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Type de produit
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Type d'unité</InputLabel>
                <Select
                  value={formData.unitType}
                  onChange={handleUnitTypeChange}
                >
                  {Object.entries(UNIT_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {SIZE_CONFIGS[value].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Gestion des variants */}
            {SIZE_CONFIGS[formData.unitType].supportsColors && (
              <VariantManager />
            )}

            {/* Configuration des alertes */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <StockAlertConfig />
            </Grid>
          </Grid>

          {/* Boutons d'action */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/inventory')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<SaveIcon />}
            >
              Enregistrer
            </Button>
          </Box>
        </Paper>
      </form>
    </Box>
  );
};

export default AddProduct;