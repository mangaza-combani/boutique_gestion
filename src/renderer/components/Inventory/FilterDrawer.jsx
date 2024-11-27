// src/pages/Inventory/components/FilterDrawer.jsx
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const defaultFilters = {
  lowStock: false,
  outOfStock: false,
  priceRange: [0, 1000],
  categories: [],
};

const FilterDrawer = ({ open, onClose, onFiltersChange }) => {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState(defaultFilters);

  const handleApply = () => {
    onFiltersChange?.(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Filtres</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            État du stock
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.lowStock}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  lowStock: e.target.checked
                })}
              />
            }
            label="Stock faible"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.outOfStock}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  outOfStock: e.target.checked
                })}
              />
            }
            label="Rupture de stock"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Fourchette de prix
          </Typography>
          <Slider
            value={localFilters.priceRange}
            onChange={(e, newValue) => setLocalFilters({
              ...localFilters,
              priceRange: newValue
            })}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            step={10}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">
              {localFilters.priceRange[0]} €
            </Typography>
            <Typography variant="body2">
              {localFilters.priceRange[1]} €
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            sx={{ mb: 1 }}
          >
            Réinitialiser
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
          >
            Appliquer les filtres
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;