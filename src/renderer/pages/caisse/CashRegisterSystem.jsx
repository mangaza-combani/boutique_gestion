import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Snackbar,
  Paper,
} from '@mui/material';

import {
  ArrowDownward,
  CloudDownload,
  Warning,
  Print,
  Search,
  ArrowUpward,
} from '@mui/icons-material';

// Configuration des billets et pièces
const DENOMINATIONS = [
  { value: 500, type: 'Billet', label: '500 €' },
  { value: 200, type: 'Billet', label: '200 €' },
  { value: 100, type: 'Billet', label: '100 €' },
  { value: 50, type: 'Billet', label: '50 €' },
  { value: 20, type: 'Billet', label: '20 €' },
  { value: 10, type: 'Billet', label: '10 €' },
  { value: 5, type: 'Billet', label: '5 €' },
  { value: 2, type: 'Pièce', label: '2 €' },
  { value: 1, type: 'Pièce', label: '1 €' },
  { value: 0.5, type: 'Pièce', label: '50 c' },
  { value: 0.2, type: 'Pièce', label: '20 c' },
  { value: 0.1, type: 'Pièce', label: '10 c' },
  { value: 0.05, type: 'Pièce', label: '5 c' },
  { value: 0.02, type: 'Pièce', label: '2 c' },
  { value: 0.01, type: 'Pièce', label: '1 c' }
];

// Composant de comptage monétaire
const MoneyCounter = ({ onChange, initialValues = {} }) => {
  const [counts, setCounts] = useState(
    DENOMINATIONS.reduce((acc, { value }) => ({
      ...acc,
      [value]: initialValues[value] || 0
    }), {})
  );

  const handleCountChange = (value, count) => {
    const newCount = Math.max(0, parseInt(count) || 0);
    const newCounts = {
      ...counts,
      [value]: newCount
    };
    
    setCounts(newCounts);
    
    const total = Object.entries(newCounts).reduce(
      (sum, [denomination, count]) => sum + (parseFloat(denomination) * count),
      0
    );
    
    onChange(total, newCounts);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Billets</Typography>
      <Grid container spacing={2}>
        {DENOMINATIONS.filter(d => d.type === 'Billet').map(({ value, label }) => (
          <Grid item xs={12} sm={6} md={4} key={value}>
            <TextField
              fullWidth
              label={label}
              type="number"
              inputProps={{ 
                min: "0",
                step: "1"
              }}
              value={counts[value]}
              onChange={(e) => handleCountChange(value, e.target.value)}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    = {((counts[value] || 0) * value).toFixed(2)} €
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Pièces</Typography>
      <Grid container spacing={2}>
        {DENOMINATIONS.filter(d => d.type === 'Pièce').map(({ value, label }) => (
          <Grid item xs={12} sm={6} md={4} key={value}>
            <TextField
              fullWidth
              label={label}
              type="number"
              inputProps={{ 
                min: "0",
                step: "1"
              }}
              value={counts[value]}
              onChange={(e) => handleCountChange(value, e.target.value)}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    = {((counts[value] || 0) * value).toFixed(2)} €
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mt: 3,
          bgcolor: 'primary.main', 
          color: 'white' 
        }}
      >
        <Typography variant="h6" align="center">
          Total: {Object.entries(counts).reduce(
            (sum, [denomination, count]) => sum + (parseFloat(denomination) * count),
            0
          ).toFixed(2)} €
        </Typography>
      </Paper>
    </Box>
  );
};

// Composant principal
const CashRegisterSystem = () => {
  // États
  const [isOpen, setIsOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [moneyDetails, setMoneyDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState('');
  const [initialCount, setInitialCount] = useState({});
  const [finalCount, setFinalCount] = useState({});
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalReference, setWithdrawalReference] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    minAmount: '',
    maxAmount: ''
  });

  // Formatage de la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Gestion de l'ouverture de caisse
  const handleOpenRegister = (total, details) => {
    const newTransaction = {
      id: Date.now().toString(),
      type: 'Ouverture',
      amount: total,
      date: new Date().toISOString(),
      details
    };

    setTransactions([...transactions, newTransaction]);
    setCurrentBalance(total);
    setMoneyDetails(details);
    setIsOpen(true);
    setOpenDialog('');
    showNotification('Caisse ouverte avec succès');
  };

  // Gestion de la fermeture de caisse
  const handleCloseRegister = (total, details) => {
    const discrepancy = total - currentBalance;
    const newTransaction = {
      id: Date.now().toString(),
      type: 'Fermeture',
      amount: total,
      date: new Date().toISOString(),
      details,
      discrepancy
    };

    setTransactions([...transactions, newTransaction]);
    setCurrentBalance(0);
    setMoneyDetails({});
    setIsOpen(false);
    setOpenDialog('');
    showNotification(
      `Caisse fermée. ${discrepancy !== 0 ? `Écart: ${formatCurrency(discrepancy)}` : 'Aucun écart.'}`
    );
  };

  // Gestion des retraits
  const handleWithdrawal = () => {
    if (parseFloat(withdrawalAmount) > currentBalance) {
      showNotification('Solde insuffisant', 'error');
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      type: 'Retrait',
      amount: parseFloat(withdrawalAmount),
      date: new Date().toISOString(),
      reason: withdrawalReason,
      reference: withdrawalReference
    };

    setTransactions([...transactions, newTransaction]);
    setCurrentBalance(prev => prev - parseFloat(withdrawalAmount));
    setOpenDialog('');
    resetWithdrawalForm();
    showNotification('Retrait effectué avec succès');
  };

  // Réinitialisation du formulaire de retrait
  const resetWithdrawalForm = () => {
    setWithdrawalAmount('');
    setWithdrawalReason('');
    setWithdrawalReference('');
  };

  // Filtrage des transactions
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const matchesSearch = !searchTerm || 
        Object.values(transaction).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesDateRange = (!filters.startDate || new Date(transaction.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(transaction.date) <= new Date(filters.endDate));
      
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      
      const matchesAmount = (!filters.minAmount || transaction.amount >= parseFloat(filters.minAmount)) &&
        (!filters.maxAmount || transaction.amount <= parseFloat(filters.maxAmount));

      return matchesSearch && matchesDateRange && matchesType && matchesAmount;
    });
  };

  // Notifications
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Génération de rapport
  const generateReport = (transaction) => {
    const report = `
      JUSTIFICATIF DE CAISSE
      ---------------------
      Date: ${new Date(transaction.date).toLocaleString()}
      Type: ${transaction.type}
      Montant: ${formatCurrency(transaction.amount)}
      ${transaction.discrepancy ? `Écart: ${formatCurrency(transaction.discrepancy)}` : ''}
      ${transaction.reason ? `Motif: ${transaction.reason}` : ''}
      ${transaction.reference ? `Référence: ${transaction.reference}` : ''}
      
      Signature: ________________
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `justificatif-${transaction.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* En-tête */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Gestion de Caisse
            </Typography>
            <Alert 
              severity={isOpen ? "info" : "warning"}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setOpenDialog(isOpen ? 'close' : 'open')}
                >
                  {isOpen ? 'Fermer la caisse' : 'Ouvrir la caisse'}
                </Button>
              }
            >
              La caisse est actuellement {isOpen ? "OUVERTE" : "FERMÉE"}
              {isOpen && ` - Solde : ${formatCurrency(currentBalance)}`}
            </Alert>
          </Grid>
        </Grid>

        {/* Actions */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {isOpen && (
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<ArrowDownward />}
                onClick={() => setOpenDialog('withdrawal')}
              >
                Retrait
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              onClick={() => {
                // Export CSV
                const content = [
                  ['Date', 'Type', 'Montant', 'Motif', 'Écart', 'Référence'].join(','),
                  ...getFilteredTransactions().map(t => [
                    new Date(t.date).toLocaleString(),
                    t.type,
                    t.amount,
                    t.reason || '',
                    t.discrepancy || '',
                    t.reference || ''
                  ].join(','))
                ].join('\n');

                const blob = new Blob([content], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>

        {/* Filtres */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Filtres et recherche" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date début"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date fin"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Type d'opération</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    label="Type d'opération"
                  >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="Ouverture">Ouverture</MenuItem>
                    <MenuItem value="Fermeture">Fermeture</MenuItem>
                    <MenuItem value="Retrait">Retrait</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tableau des transactions */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell>Note/Motif</TableCell>
                <TableCell align="right">Écart</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredTransactions()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.type}
                        color={
                          transaction.type === 'Ouverture' ? 'success' :
                          transaction.type === 'Fermeture' ? 'error' : 
                          'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {transaction.reason || '-'}
                    </TableCell>
                    <TableCell align="right">
                      {transaction.discrepancy !== 0 && (
                        <Chip
                          icon={<Warning />}
                          label={formatCurrency(transaction.discrepancy)}
                          color="warning"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Imprimer le justificatif">
                        <IconButton 
                          size="small"
                          onClick={() => generateReport(transaction)}
                        >
                          <Print />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={getFilteredTransactions().length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Lignes par page"
          />
        </TableContainer>

        {/* Dialogue d'ouverture/fermeture */}
        <Dialog
          open={openDialog === 'open' || openDialog === 'close'}
          onClose={() => setOpenDialog('')}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {openDialog === 'open' ? 'Ouverture de caisse' : 'Fermeture de caisse'}
          </DialogTitle>
          <DialogContent>
            <MoneyCounter
              onChange={(total, details) => {
                if (openDialog === 'open') {
                  setInitialCount({ total, details });
                } else {
                  setFinalCount({ total, details });
                }
              }}
              initialValues={openDialog === 'close' ? moneyDetails : {}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog('')}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (openDialog === 'open') {
                  handleOpenRegister(initialCount.total, initialCount.details);
                } else {
                  handleCloseRegister(finalCount.total, finalCount.details);
                }
              }}
              disabled={
                (openDialog === 'open' && (!initialCount?.total)) ||
                (openDialog === 'close' && (!finalCount?.total))
              }
            >
              Valider
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialogue de retrait */}
        <Dialog
          open={openDialog === 'withdrawal'}
          onClose={() => {
            setOpenDialog('');
            resetWithdrawalForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Retrait de caisse</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Solde disponible : {formatCurrency(currentBalance)}
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Montant du retrait"
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motif du retrait"
                  multiline
                  rows={3}
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Référence du justificatif"
                  value={withdrawalReference}
                  onChange={(e) => setWithdrawalReference(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog('');
                resetWithdrawalForm();
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleWithdrawal}
              disabled={
                !withdrawalAmount ||
                !withdrawalReason ||
                !withdrawalReference ||
                parseFloat(withdrawalAmount) > currentBalance
              }
            >
              Valider
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          message={notification.message}
        />
      </Box>
    </Container>
  );
};

export default CashRegisterSystem;