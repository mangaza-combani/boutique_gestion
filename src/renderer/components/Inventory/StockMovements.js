import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Chip,
  MenuItem,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  ArrowBack,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Add as AddIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  ShoppingCart as SalesIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const StockMovements = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { products } = useInventory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    startDate: null,
    endDate: null,
    product: 'all',
  });

  // Récupérer tous les mouvements de tous les produits
  const allMovements = useMemo(() => {
    return products.flatMap(product => 
      product.movements.map(movement => ({
        ...movement,
        productId: product.id,
        productName: product.name,
        productReference: product.reference,
      }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [products]);

  // Stats rapides
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayMovements = allMovements.filter(m => 
      new Date(m.date) >= today
    );

    const monthMovements = allMovements.filter(m => 
      new Date(m.date) >= thisMonth
    );

    return {
      today: {
        total: todayMovements.length,
        in: todayMovements.filter(m => m.type === 'purchase' || m.type === 'return').length,
        out: todayMovements.filter(m => m.type === 'sale' || m.type === 'loss').length,
      },
      month: {
        total: monthMovements.length,
        in: monthMovements.filter(m => m.type === 'purchase' || m.type === 'return').length,
        out: monthMovements.filter(m => m.type === 'sale' || m.type === 'loss').length,
      }
    };
  }, [allMovements]);

  // Filtrage des mouvements
  const filteredMovements = useMemo(() => {
    return allMovements.filter(movement => {
      // Recherche textuelle
      const searchMatch = 
        movement.productName.toLowerCase().includes(search.toLowerCase()) ||
        movement.productReference.toLowerCase().includes(search.toLowerCase()) ||
        movement.reference?.toLowerCase().includes(search.toLowerCase());

      // Filtre par type
      const typeMatch = filters.type === 'all' || movement.type === filters.type;

      // Filtre par dates
      const dateMatch = 
        (!filters.startDate || new Date(movement.date) >= filters.startDate) &&
        (!filters.endDate || new Date(movement.date) <= filters.endDate);

      // Filtre par produit
      const productMatch = filters.product === 'all' || movement.productId === filters.product;

      return searchMatch && typeMatch && dateMatch && productMatch;
    });
  }, [allMovements, search, filters]);

  const getMovementTypeConfig = (type) => {
    switch (type) {
      case 'purchase':
        return { label: 'Achat', color: 'primary', icon: <ShippingIcon /> };
      case 'sale':
        return { label: 'Vente', color: 'success', icon: <SalesIcon /> };
      case 'return':
        return { label: 'Retour', color: 'warning', icon: <InventoryIcon /> };
      case 'loss':
        return { label: 'Perte', color: 'error', icon: <WarningIcon /> };
      case 'adjustment':
        return { label: 'Ajustement', color: 'info', icon: <InventoryIcon /> };
      default:
        return { label: type, color: 'default', icon: <InventoryIcon /> };
    }
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
            Mouvements de stock
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {/* Export logic */}}
          >
            Exporter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/inventory/new-movement')}
          >
            Nouveau mouvement
          </Button>
        </Box>
      </Box>

      {/* Stats rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aujourd'hui
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="textSecondary">Total mouvements</Typography>
                <Typography variant="h6">{stats.today.total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  size="small"
                  icon={<AddIcon />}
                  label={`Entrées: ${stats.today.in}`}
                  color="success"
                />
                <Chip
                  size="small"
                  icon={<RemoveIcon />}
                  label={`Sorties: ${stats.today.out}`}
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ce mois
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="textSecondary">Total mouvements</Typography>
                <Typography variant="h6">{stats.month.total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  size="small"
                  icon={<AddIcon />}
                  label={`Entrées: ${stats.month.in}`}
                  color="success"
                />
                <Chip
                  size="small"
                  icon={<RemoveIcon />}
                  label={`Sorties: ${stats.month.out}`}
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Type de mouvement"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="purchase">Achats</MenuItem>
              <MenuItem value="sale">Ventes</MenuItem>
              <MenuItem value="return">Retours</MenuItem>
              <MenuItem value="loss">Pertes</MenuItem>
              <MenuItem value="adjustment">Ajustements</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Produit"
              value={filters.product}
              onChange={(e) => setFilters({ ...filters, product: e.target.value })}
            >
              <MenuItem value="all">Tous les produits</MenuItem>
              {products.map(product => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DatePicker
                label="Du"
                value={filters.startDate}
                onChange={(date) => setFilters({ ...filters, startDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Au"
                value={filters.endDate}
                onChange={(date) => setFilters({ ...filters, endDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Table des mouvements */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Produit</TableCell>
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
                const typeConfig = getMovementTypeConfig(movement.type);
                return (
                  <TableRow 
                    key={movement.id}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => navigate(`/inventory/product/${movement.productId}`)}
                  >
                    <TableCell>
                      {new Date(movement.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {movement.productName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {movement.productReference}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={typeConfig.icon}
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
      </TableContainer>
    </Box>
  );
};

export default StockMovements;