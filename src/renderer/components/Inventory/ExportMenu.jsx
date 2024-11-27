// src/pages/Inventory/components/StockOverview/ExportMenu.jsx
import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  InsertDriveFile as CsvIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const ExportMenu = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportDialog, setExportDialog] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    reference: true,
    name: true,
    category: true,
    price: true,
    stock: true,
    sizes: false,
    supplier: false,
    lastUpdate: false
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      const exportData = data.map(product => {
        const row = {};
        if (selectedFields.reference) row['Référence'] = product.reference;
        if (selectedFields.name) row['Nom'] = product.name;
        if (selectedFields.category) row['Catégorie'] = product.category;
        if (selectedFields.price) row['Prix'] = product.sellingPrice;
        if (selectedFields.stock) row['Stock total'] = product.totalStock;
        if (selectedFields.sizes && product.stock) {
          Object.entries(product.stock).forEach(([size, qty]) => {
            row[`Stock ${size}`] = qty;
          });
        }
        if (selectedFields.supplier) row['Fournisseur'] = product.supplier;
        if (selectedFields.lastUpdate) row['Dernière mise à jour'] = new Date(product.lastUpdate).toLocaleDateString();
        return row;
      });

      switch (exportType) {
        case 'excel':
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(exportData);
          XLSX.utils.book_append_sheet(wb, ws, 'Stock');
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          saveAs(
            new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            `inventaire_${new Date().toISOString().split('T')[0]}.xlsx`
          );
          break;

        case 'csv':
          const csv = XLSX.utils.json_to_csv(exportData);
          saveAs(
            new Blob([csv], { type: 'text/csv;charset=utf-8' }),
            `inventaire_${new Date().toISOString().split('T')[0]}.csv`
          );
          break;

        case 'pdf':
          // Logique d'export PDF à implémenter
          break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setLoading(false);
      setExportDialog(false);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Exporter
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem 
          onClick={() => {
            setExportType('excel');
            setExportDialog(true);
          }}
        >
          <ListItemIcon>
            <ExcelIcon />
          </ListItemIcon>
          <ListItemText>Excel</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setExportType('csv');
            setExportDialog(true);
          }}
        >
          <ListItemIcon>
            <CsvIcon />
          </ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setExportType('pdf');
            setExportDialog(true);
          }}
        >
          <ListItemIcon>
            <PdfIcon />
          </ListItemIcon>
          <ListItemText>PDF</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog 
        open={exportDialog} 
        onClose={() => setExportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Configuration de l'export
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Sélectionnez les informations à exporter :
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.reference}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    reference: e.target.checked
                  })}
                />
              }
              label="Référence"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.name}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    name: e.target.checked
                  })}
                />
              }
              label="Nom du produit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.category}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    category: e.target.checked
                  })}
                />
              }
              label="Catégorie"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.price}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    price: e.target.checked
                  })}
                />
              }
              label="Prix"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.stock}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    stock: e.target.checked
                  })}
                />
              }
              label="Stock total"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.sizes}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    sizes: e.target.checked
                  })}
                />
              }
              label="Stock par taille"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.supplier}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    supplier: e.target.checked
                  })}
                />
              }
              label="Fournisseur"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.lastUpdate}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    lastUpdate: e.target.checked
                  })}
                />
              }
              label="Dernière mise à jour"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={loading || !Object.values(selectedFields).some(v => v)}
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          >
            Exporter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportMenu;