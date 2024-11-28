import React, { useState ,useMemo} from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Warning as WarningIcon,
  ArrowBack,
  Add as AddIcon,
  Download as DownloadIcon,
  FormatListBulleted as ListIcon,
  GridView as GridIcon,
  Sort as SortIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import ProductGrid from './ProductGrid';
import ProductList from './ProductList';
import FilterDrawer from './FilterDrawer';
import { ExportMenu } from './ExportMenu';
export const StockOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { products, categories } = useInventory();
  
  // États locaux
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Stats rapides
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.totalStock <= p.minStock);
    const outOfStock = products.filter(p => p.totalStock === 0);
    const totalValue = products.reduce((sum, p) => 
      sum + (p.totalStock * p.purchasePrice), 0);

    return {
      totalProducts,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      totalValue
    };
  }, [products]);

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    let result = products;

    // Recherche
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.reference.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par catégorie
    if (selectedCategory) {
      result = result.filter(product => 
        product.category === selectedCategory
      );
    }

    // Tri
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.totalStock - b.totalStock;
          break;
        case 'value':
          comparison = (a.totalStock * a.purchasePrice) - 
                      (b.totalStock * b.purchasePrice);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, search, selectedCategory, sortBy, sortOrder]);

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
          <IconButton onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Stock
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/inventory/add')}
          >
            Nouveau produit
          </Button>
          <ExportMenu data={filteredProducts} />
        </Box>
      </Box>

      {/* Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Produits
              </Typography>
              <Typography variant="h4">
                {stats.totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Stock faible
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.lowStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rupture de stock
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.outOfStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valeur du stock
              </Typography>
              <Typography variant="h4" color="primary">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(stats.totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou référence..."
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
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )}
                  variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: selectedCategory === category.name ? category.color : 'transparent',
                    color: selectedCategory === category.name ? 'white' : category.color,
                    borderColor: category.color,
                  }}
                />
              ))}
              <IconButton onClick={() => setFilterDrawerOpen(true)}>
                <FilterIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Options de vue et tri */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="subtitle1">
          {filteredProducts.length} produits trouvés
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => {
              if (newView !== null) {
                setView(newView);
              }
            }}
            size="small"
          >
            <ToggleButton value="grid">
              <Tooltip title="Vue grille">
                <GridIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="Vue liste">
                <ListIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            startIcon={<SortIcon />}
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
          >
            Trier
          </Button>
        </Box>
      </Box>

      {/* Liste des produits */}
      {view === 'grid' ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <ProductList products={filteredProducts} />
      )}

      {/* Filtre latéral */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </Box>
  );
};

export default StockOverview;