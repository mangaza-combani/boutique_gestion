import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ products }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Référence</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell align="right">Prix</TableCell>
            <TableCell align="right">Stock total</TableCell>
            <TableCell>Stock par taille</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              hover
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
              onClick={() => navigate(`/inventory/product/${product.id}`)}
            >
              <TableCell>{product.reference}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={product.images[0] || '/api/placeholder/40/40'}
                    sx={{ width: 40, height: 40, borderRadius: 1 }}
                    alt={product.name}
                  />
                  <Typography>{product.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={product.category}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">
                  {product.sellingPrice.toFixed(2)} €
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Chip
                  icon={product.totalStock <= product.minStock ? <WarningIcon /> : null}
                  label={product.totalStock}
                  color={product.totalStock <= product.minStock ? 'warning' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Object.entries(product.stock || {}).map(([size, quantity]) => (
                    <Chip
                      key={size}
                      label={`${size}: ${quantity}`}
                      size="small"
                      variant="outlined"
                      color={quantity <= 3 ? 'warning' : 'default'}
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/inventory/product/${product.id}`);
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;