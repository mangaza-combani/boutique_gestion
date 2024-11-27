import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductGrid = ({ products }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            }}
            onClick={() => navigate(`/inventory/product/${product.id}`)}
          >
            <CardMedia
              component="img"
              height="140"
              image={product.images[0] || '/api/placeholder/400/400'}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ref: {product.reference}
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  icon={product.totalStock <= product.minStock ? <WarningIcon /> : <InventoryIcon />}
                  label={`Stock: ${product.totalStock}`}
                  color={product.totalStock <= product.minStock ? 'warning' : 'success'}
                  size="small"
                />
                <Typography variant="h6" color="primary">
                  {product.sellingPrice.toFixed(2)} €
                </Typography>
              </Box>

              {/* Stock par taille si applicable */}
              {product.stock && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Object.entries(product.stock).map(([size, quantity]) => (
                    <Chip
                      key={size}
                      label={`${size}: ${quantity}`}
                      size="small"
                      variant="outlined"
                      color={quantity <= 3 ? 'warning' : 'default'}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;