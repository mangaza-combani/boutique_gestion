// src/pages/SalesHistory/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  MenuItem,
  useTheme,
  alpha,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Print as PrintIcon,
  Info as InfoIcon,
  DateRange as DateRangeIcon,
  EuroSymbol as EuroIcon,
  ArrowBack,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  BarChart as ChartIcon,
  CreditCard,
  ShoppingCart as CartIcon,
  LocalAtm as CashIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  InsertDriveFile as CsvIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Configuration des templates d'export
const exportTemplates = {
  simple: {
    name: 'Simple',
    description: 'Vue basique des ventes',
    icon: <ReceiptIcon />,
    columns: {
      id: true,
      date: true,
      customer: true,
      amount: true,
      status: true,
    },
    includeStats: false,
    includeCharts: false,
  },
  detailed: {
    name: 'Détaillé',
    description: 'Rapport complet avec détails',
    icon: <InfoIcon />,
    columns: {
      id: true,
      date: true,
      customer: true,
      vendeur: true,
      amount: true,
      paymentMethod: true,
      status: true,
      items: true,
    },
    includeStats: true,
    includeCharts: true,
  },
  accounting: {
    name: 'Comptabilité',
    description: 'Format pour la comptabilité',
    icon: <EuroIcon />,
    columns: {
      id: true,
      date: true,
      amount: true,
      paymentMethod: true,
      status: true,
      tax: true,
    },
    includeStats: true,
    includeCharts: false,
  },
};

// Styled Components
const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.background.paper,
  borderRadius: '16px',
  marginBottom: theme.spacing(3),
  boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    cursor: 'pointer',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: theme.transitions.create(['box-shadow']),
    '&:hover': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    boxShadow: `0 1px 3px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

// Types de données
const initialFilters = {
  startDate: null,
  endDate: null,
  paymentMethod: '',
  status: '',
  vendeur: '',
  minAmount: '',
  maxAmount: '',
};

const statusConfig = {
  completed: { 
    color: 'success', 
    label: 'Terminé', 
    icon: <CheckCircleIcon fontSize="small" />
  },
  pending: { 
    color: 'warning', 
    label: 'En attente', 
    icon: <PendingIcon fontSize="small" />
  },
  cancelled: { 
    color: 'error', 
    label: 'Annulé', 
    icon: <CancelIcon fontSize="small" />
  },
};


// Utilitaires de formatage
const formatCurrency = (amount) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const formatDate = (date) => format(date, 'dd/MM/yyyy HH:mm');

const getDateRangeLabel = (startDate, endDate) => {
  if (!startDate && !endDate) return 'Toutes les périodes';
  if (!endDate) return `Depuis le ${formatDate(startDate)}`;
  if (!startDate) return `Jusqu'au ${formatDate(endDate)}`;
  return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`;
};
// Composant des statistiques rapides
const QuickStats = ({ data }) => {
    const theme = useTheme();
    
    const stats = useMemo(() => ({
      totalSales: data.reduce((sum, sale) => sum + sale.amount, 0),
      totalTransactions: data.length,
      cardPayments: data.filter(sale => sale.paymentMethod === 'card'),
      cashPayments: data.filter(sale => sale.paymentMethod === 'cash'),
      averageTicket: data.length > 0 ? data.reduce((sum, sale) => sum + sale.amount, 0) / data.length : 0,
      completedSales: data.filter(sale => sale.status === 'completed'),
    }), [data]);
  
    const statCards = [
      {
        title: "Ventes totales",
        value: formatCurrency(stats.totalSales),
        subValue: `${stats.totalTransactions} transactions`,
        icon: <ReceiptIcon />,
        color: theme.palette.primary.main,
      },
      {
        title: "Paiements CB",
        value: stats.cardPayments.length,
        subValue: `${((stats.cardPayments.length / stats.totalTransactions) * 100).toFixed(1)}%`,
        icon: <CreditCard />,
        color: theme.palette.success.main,
      },
      {
        title: "Paiements Espèces",
        value: stats.cashPayments.length,
        subValue: `${((stats.cashPayments.length / stats.totalTransactions) * 100).toFixed(1)}%`,
        icon: <CashIcon />,
        color: theme.palette.warning.main,
      },
      {
        title: "Ticket moyen",
        value: formatCurrency(stats.averageTicket),
        subValue: "par transaction",
        icon: <EuroIcon />,
        color: theme.palette.info.main,
      },
    ];
  
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography color="textSecondary" variant="h6">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {stat.subValue}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Composant de détail d'une vente
  const SaleDetailDialog = ({ open, onClose, sale }) => {
    const theme = useTheme();
  
    if (!sale) return null;
  
    const sections = [
      {
        title: "Informations générales",
        items: [
          { label: "N° de vente", value: sale.id },
          { label: "Date", value: formatDate(sale.date) },
          { label: "Statut", value: statusConfig[sale.status].label },
          { label: "Vendeur", value: sale.vendeur },
        ]
      },
      {
        title: "Client",
        items: [
          { label: "Nom", value: sale.customer },
          { label: "Fidélité", value: sale.customerLoyalty || "Non inscrit" },
        ]
      },
      {
        title: "Paiement",
        items: [
          { label: "Mode", value: sale.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces' },
          { label: "Total", value: formatCurrency(sale.amount) },
        ]
      }
    ];
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Détail de la vente</Typography>
            <Box>
              <IconButton onClick={() => {/* Logique d'impression */}}>
                <PrintIcon />
              </IconButton>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Sections d'information */}
            <Grid item xs={12} md={4}>
              {sections.map((section, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {section.title}
                  </Typography>
                  {section.items.map((item, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body1">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Grid>
  
            {/* Articles */}
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Articles
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Article</TableCell>
                      <TableCell align="right">Prix unitaire</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sale.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1">Total</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {formatCurrency(sale.amount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fermer</Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => {/* Logique d'impression */}}
          >
            Imprimer le ticket
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const SearchAndFilters = ({ search, onSearchChange, filters, onFilterChange }) => {
    const theme = useTheme();
  
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher par N° de vente ou client..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Date début"
                  value={filters.startDate ? dayjs(filters.startDate) : null}
                  onChange={(newValue) => {
                    onFilterChange('startDate', newValue ? newValue.toDate() : null);
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium"
                    }
                  }}
                />
                <DatePicker
                  label="Date fin"
                  value={filters.endDate ? dayjs(filters.endDate) : null}
                  onChange={(newValue) => {
                    onFilterChange('endDate', newValue ? newValue.toDate() : null);
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium"
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    onFilterChange('startDate', null);
                    onFilterChange('endDate', null);
                  }}
                  startIcon={<FilterIcon />}
                >
                  Réinitialiser
                </Button>
              </Box>
            </LocalizationProvider>
          </Grid>
        </Grid>
  
        {/* Périodes prédéfinies */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {[
            {
              label: "Aujourd'hui",
              getDates: () => ({
                startDate: dayjs().startOf('day').toDate(),
                endDate: dayjs().endOf('day').toDate()
              })
            },
            {
              label: "Cette semaine",
              getDates: () => ({
                startDate: dayjs().startOf('week').toDate(),
                endDate: dayjs().endOf('day').toDate()
              })
            },
            {
              label: "Ce mois",
              getDates: () => ({
                startDate: dayjs().startOf('month').toDate(),
                endDate: dayjs().endOf('day').toDate()
              })
            },
            {
              label: "30 derniers jours",
              getDates: () => ({
                startDate: dayjs().subtract(30, 'day').startOf('day').toDate(),
                endDate: dayjs().endOf('day').toDate()
              })
            }
          ].map((period) => (
            <FilterChip
              key={period.label}
              label={period.label}
              onClick={() => {
                const dates = period.getDates();
                onFilterChange('startDate', dates.startDate);
                onFilterChange('endDate', dates.endDate);
              }}
            />
          ))}
        </Box>
      </Paper>
    );
  };
  
  // Composant de filtres avancés
  const AdvancedFilters = ({ filters, onFilterChange }) => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Filtres avancés</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Mode de paiement"
                value={filters.paymentMethod}
                onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="card">Carte bancaire</MenuItem>
                <MenuItem value="cash">Espèces</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Statut"
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="completed">Terminé</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="cancelled">Annulé</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Montant minimum"
                type="number"
                value={filters.minAmount}
                onChange={(e) => onFilterChange('minAmount', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Montant maximum"
                type="number"
                value={filters.maxAmount}
                onChange={(e) => onFilterChange('maxAmount', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const getStatusChip = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        size="small"
        color={config.color}
        label={config.label}
        icon={config.icon}
        variant="outlined"
      />
    );
  };

  // Composant d'export
const ExportMenu = ({ data, filters }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [exportDialog, setExportDialog] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
  
    const handleExport = async (template, format) => {
      setLoading(true);
      try {
        const exportData = prepareDataForExport(data, template);
        
        switch (format) {
          case 'excel':
            await exportToExcel(exportData, template);
            break;
          case 'pdf':
            await exportToPdf(exportData, template);
            break;
          case 'csv':
            exportToCsv(exportData, template);
            break;
        }
      } catch (error) {
        console.error('Export error:', error);
        // Gérer l'erreur
      } finally {
        setLoading(false);
        setExportDialog(false);
        setAnchorEl(null);
      }
    };
  
    const prepareDataForExport = (data, template) => {
      return data.map(sale => {
        const exportItem = {};
        if (template.columns.id) exportItem['N° de vente'] = sale.id;
        if (template.columns.date) exportItem['Date'] = formatDate(sale.date);
        if (template.columns.customer) exportItem['Client'] = sale.customer;
        if (template.columns.amount) exportItem['Montant'] = formatCurrency(sale.amount);
        if (template.columns.status) exportItem['Statut'] = statusConfig[sale.status].label;
        if (template.columns.paymentMethod) 
          exportItem['Paiement'] = sale.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces';
        return exportItem;
      });
    };
  
    const exportToExcel = async (data, template) => {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Ventes');
      
      // Si on inclut les statistiques
      if (template.includeStats) {
        const statsWs = XLSX.utils.json_to_sheet([
          { 'Statistiques': 'Valeur' },
          { 'Total des ventes': formatCurrency(data.reduce((sum, sale) => sum + parseFloat(sale.amount), 0)) },
          { 'Nombre de transactions': data.length },
          { 'Ticket moyen': formatCurrency(data.reduce((sum, sale) => sum + parseFloat(sale.amount), 0) / data.length) }
        ]);
        XLSX.utils.book_append_sheet(wb, statsWs, 'Statistiques');
      }
  
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `ventes_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      );
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
          {Object.entries(exportTemplates).map(([key, template]) => (
            <MenuItem
              key={key}
              onClick={() => {
                setSelectedTemplate(template);
                setExportDialog(true);
              }}
            >
              <ListItemIcon>
                {template.icon}
              </ListItemIcon>
              <ListItemText 
                primary={template.name}
                secondary={template.description}
              />
            </MenuItem>
          ))}
        </Menu>
  
        <Dialog 
          open={exportDialog} 
          onClose={() => setExportDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Export - {selectedTemplate?.name}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Format d'export
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ExcelIcon />}
                    onClick={() => handleExport(selectedTemplate, 'excel')}
                    fullWidth
                  >
                    Excel
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PdfIcon />}
                    onClick={() => handleExport(selectedTemplate, 'pdf')}
                    fullWidth
                  >
                    PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CsvIcon />}
                    onClick={() => handleExport(selectedTemplate, 'csv')}
                    fullWidth
                  >
                    CSV
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Période exportée
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getDateRangeLabel(filters.startDate, filters.endDate)}
                </Typography>
              </Grid>
  
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Colonnes incluses
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(selectedTemplate?.columns || {})
                    .filter(([, value]) => value)
                    .map(([key]) => (
                      <Chip
                        key={key}
                        label={key}
                        size="small"
                        variant="outlined"
                      />
                    ))
                  }
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialog(false)}>
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
  
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          >
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography>Export en cours...</Typography>
            </Paper>
          </Box>
        )}
      </>
    );
  };
  
  // Composant principal
  export const SalesHistory = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedSale, setSelectedSale] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState(initialFilters);
    const salesData = [
      {
        id: 'VNT-001',
        date: new Date('2024-03-26T10:30:00'),
        customer: 'John Doe',
        amount: 159.99,
        items: [
          { name: 'T-shirt Basic (M)', quantity: 2, price: 39.99 },
          { name: 'Jean Slim (L)', quantity: 1, price: 79.99 },
        ],
        paymentMethod: 'card',
        status: 'completed',
        vendeur: 'Alice Martin',
        customerLoyalty: 'Client fidèle',
      },
      {
        id: 'VNT-002',
        date: new Date('2024-03-26T11:45:00'),
        customer: 'Jane Smith',
        amount: 89.99,
        items: [
          { name: 'Robe d\'été (S)', quantity: 1, price: 89.99 },
        ],
        paymentMethod: 'cash',
        status: 'completed',
        vendeur: 'Bob Wilson',
        customerLoyalty: 'Nouveau client',
      },
      {
        id: 'VNT-003',
        date: new Date('2024-03-26T14:15:00'),
        customer: 'Mike Johnson',
        amount: 249.97,
        items: [
          { name: 'Veste en cuir (L)', quantity: 1, price: 199.99 },
          { name: 'Ceinture', quantity: 1, price: 49.98 },
        ],
        paymentMethod: 'card',
        status: 'pending',
        vendeur: 'Alice Martin',
        customerLoyalty: 'Client fidèle',
      },
      {
        id: 'VNT-004',
        date: new Date('2024-03-26T15:30:00'),
        customer: 'Sarah Williams',
        amount: 129.99,
        items: [
          { name: 'Sneakers (42)', quantity: 1, price: 129.99 },
        ],
        paymentMethod: 'card',
        status: 'completed',
        vendeur: 'Charlie Brown',
        customerLoyalty: 'Client VIP',
      },
      {
        id: 'VNT-005',
        date: new Date('2024-03-26T16:45:00'),
        customer: 'David Lee',
        amount: 199.98,
        items: [
          { name: 'Chemise (L)', quantity: 2, price: 99.99 },
        ],
        paymentMethod: 'cash',
        status: 'cancelled',
        vendeur: 'Bob Wilson',
        customerLoyalty: 'Client standard',
      },
      {
        id: 'VNT-006',
        date: new Date('2024-03-26T17:20:00'),
        customer: 'Emma Davis',
        amount: 299.97,
        items: [
          { name: 'Sac à main', quantity: 1, price: 199.99 },
          { name: 'Portefeuille', quantity: 1, price: 99.98 },
        ],
        paymentMethod: 'card',
        status: 'completed',
        vendeur: 'Alice Martin',
        customerLoyalty: 'Client VIP',
      },
      {
        id: 'VNT-007',
        date: new Date('2024-03-26T18:00:00'),
        customer: 'James Wilson',
        amount: 149.99,
        items: [
          { name: 'Jean Regular (32)', quantity: 1, price: 149.99 },
        ],
        paymentMethod: 'cash',
        status: 'pending',
        vendeur: 'Charlie Brown',
        customerLoyalty: 'Nouveau client',
      },
      {
        id: 'VNT-008',
        date: new Date('2024-03-27T09:15:00'),
        customer: 'Sophie Martin',
        amount: 449.97,
        items: [
          { name: 'Manteau hiver (M)', quantity: 1, price: 299.99 },
          { name: 'Écharpe', quantity: 1, price: 49.99 },
          { name: 'Gants', quantity: 1, price: 99.99 },
        ],
        paymentMethod: 'card',
        status: 'completed',
        vendeur: 'Bob Wilson',
        customerLoyalty: 'Client fidèle',
      },
      {
        id: 'VNT-009',
        date: new Date('2024-03-27T10:30:00'),
        customer: 'Lucas Brown',
        amount: 179.98,
        items: [
          { name: 'T-shirt Premium (L)', quantity: 2, price: 89.99 },
        ],
        paymentMethod: 'card',
        status: 'completed',
        vendeur: 'Alice Martin',
        customerLoyalty: 'Client standard',
      },
      {
        id: 'VNT-010',
        date: new Date('2024-03-27T11:45:00'),
        customer: 'Olivia Taylor',
        amount: 529.96,
        items: [
          { name: 'Robe de soirée (M)', quantity: 1, price: 399.99 },
          { name: 'Pochette', quantity: 1, price: 129.97 },
        ],
        paymentMethod: 'card',
        status: 'completed',
        vendeur: 'Charlie Brown',
        customerLoyalty: 'Client VIP',
      },
    ];
  
    const handleFilterChange = (key, value) => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
      setPage(0);
    };
  
    const getFilteredSales = useMemo(() => {
      return salesData.filter(sale => {
        const searchLower = search.toLowerCase();
        const matchesSearch = sale.id.toLowerCase().includes(searchLower) ||
          sale.customer.toLowerCase().includes(searchLower);
  
        const matchesDateRange = (!filters.startDate || sale.date >= filters.startDate) &&
          (!filters.endDate || sale.date <= filters.endDate);
  
        const matchesPaymentMethod = !filters.paymentMethod || 
          sale.paymentMethod === filters.paymentMethod;
  
        const matchesStatus = !filters.status || sale.status === filters.status;
  
        const matchesAmount = (!filters.minAmount || sale.amount >= parseFloat(filters.minAmount)) &&
          (!filters.maxAmount || sale.amount <= parseFloat(filters.maxAmount));
  
        return matchesSearch && matchesDateRange && matchesPaymentMethod && 
               matchesStatus && matchesAmount;
      });
    }, [search, filters, salesData]);
  
    return (
      <Box sx={{ p: 3 }}>
        {/* Navigation et titre */}
        <Header>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Historique des Ventes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getDateRangeLabel(filters.startDate, filters.endDate)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ExportMenu data={getFilteredSales} filters={filters} />
            <Button
              variant="contained"
              startIcon={<CartIcon />}
              onClick={() => navigate('/new-sale')}
            >
              Nouvelle vente
            </Button>
          </Box>
        </Header>
  
        {/* Statistiques */}
        <QuickStats data={getFilteredSales} />
  
        {/* Filtres */}
        <SearchAndFilters
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
  
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
  
        {/* Liste des ventes */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° de vente</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Vendeur</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell>Paiement</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredSales
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sale) => (
                  <StyledTableRow
                    key={sale.id}
                    onClick={() => {
                      setSelectedSale(sale);
                      setDetailDialogOpen(true);
                    }}
                  >
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.vendeur}</TableCell>
                    <TableCell align="right">{formatCurrency(sale.amount)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={sale.paymentMethod === 'card' ? <CreditCard /> : <CashIcon />}
                        label={sale.paymentMethod === 'card' ? 'Carte' : 'Espèces'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {getStatusChip(sale.status)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Logique d'impression
                        }}
                      >
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={getFilteredSales.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </TableContainer>
  
        {/* Dialogs */}
        <SaleDetailDialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          sale={selectedSale}
        />
  
        {/* Message si aucun résultat */}
        {getFilteredSales.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Aucune vente ne correspond aux critères de recherche.
          </Alert>
        )}
      </Box>
    );
  };
  
  export default SalesHistory;