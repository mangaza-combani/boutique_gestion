import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Snackbar,
  Chip,
  Tooltip,
  CircularProgress,
  InputAdornment,
  Divider,
} from '@mui/material';

import {
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  Print as PrintIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Style as StyleIcon,
  People as UsersIcon,
  ReceiptLong as ReceiptIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

// Configuration des types de commerce
const businessTypes = [
  { id: 'restaurant', label: 'Restaurant', icon: <RestaurantIcon /> },
  { id: 'retail', label: 'Commerce de détail', icon: <StoreIcon /> },
  { id: 'phone', label: 'Téléphonie', icon: <PhoneIcon /> }
];

// Composant principal
const AdminPanel = () => {
  const [currentTab, setCurrentTab] = useState('store');
  const [openDialog, setOpenDialog] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // États pour les différents modules
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [businessSettings, setBusinessSettings] = useState({
    name: '',
    type: '',
    address: '',
    phone: '',
    email: '',
    tax: '',
  });

  // Composant de gestion des utilisateurs
  const UserManagementContent = () => {
    const [newUser, setNewUser] = useState({
      username: '',
      email: '',
      role: '',
      password: '',
    });

    const handleAddUser = () => {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setOpenDialog('');
      setNewUser({ username: '', email: '', role: '', password: '' });
    };

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Gestion des Utilisateurs</Typography>
          <Button
            startIcon={<PersonAddIcon />}
            variant="contained"
            onClick={() => setOpenDialog('user')}
          >
            Nouvel Utilisateur
          </Button>
        </Box>

        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} md={4} key={user.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                  <Chip 
                    label={user.role}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openDialog === 'user'}
          onClose={() => setOpenDialog('')}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Nouvel Utilisateur</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom d'utilisateur"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <MenuItem value="admin">Administrateur</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="cashier">Caissier</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog('')}>Annuler</Button>
            <Button
              variant="contained"
              onClick={handleAddUser}
              disabled={!newUser.username || !newUser.email || !newUser.role || !newUser.password}
            >
              Créer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // Composant de gestion des catégories
  const CategoryManagementContent = () => {
    const [newCategory, setNewCategory] = useState({
      name: '',
      parent: null,
      type: '',
    });

    const handleAddCategory = () => {
      setCategories([...categories, { ...newCategory, id: Date.now() }]);
      setOpenDialog('');
      setNewCategory({ name: '', parent: null, type: '' });
    };

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Gestion des Catégories</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpenDialog('category')}
          >
            Nouvelle Catégorie
          </Button>
        </Box>

        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{category.name}</Typography>
                  {category.parent && (
                    <Typography color="textSecondary">
                      Parent: {categories.find(c => c.id === category.parent)?.name}
                    </Typography>
                  )}
                  <Chip 
                    label={category.type}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openDialog === 'category'}
          onClose={() => setOpenDialog('')}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Nouvelle Catégorie</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom de la catégorie"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  >
                    {businessTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {type.icon}
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie parente</InputLabel>
                  <Select
                    value={newCategory.parent || ''}
                    onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
                  >
                    <MenuItem value="">Aucune</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog('')}>Annuler</Button>
            <Button
              variant="contained"
              onClick={handleAddCategory}
              disabled={!newCategory.name || !newCategory.type}
            >
              Créer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // Composant de configuration des imprimantes
  const PrinterConfigContent = () => {
    const [newPrinter, setNewPrinter] = useState({
      name: '',
      type: '',
      isDefault: false,
    });

    const handleAddPrinter = () => {
      setPrinters([...printers, { ...newPrinter, id: Date.now() }]);
      setOpenDialog('');
      setNewPrinter({ name: '', type: '', isDefault: false });
    };

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Configuration des Imprimantes</Typography>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            onClick={() => setOpenDialog('printer')}
          >
            Ajouter une imprimante
          </Button>
        </Box>

        <Grid container spacing={2}>
          {printers.map((printer) => (
            <Grid item xs={12} md={4} key={printer.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{printer.name}</Typography>
                  <Typography color="textSecondary">{printer.type}</Typography>
                  {printer.isDefault && (
                    <Chip 
                      label="Par défaut"
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small">Test</Button>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openDialog === 'printer'}
          onClose={() => setOpenDialog('')}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Ajouter une imprimante</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom de l'imprimante"
                  value={newPrinter.name}
                  onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newPrinter.type}
                    onChange={(e) => setNewPrinter({ ...newPrinter, type: e.target.value })}
                  >
                    <MenuItem value="receipt">Tickets de caisse</MenuItem>
                    <MenuItem value="document">Documents</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newPrinter.isDefault}
                      onChange={(e) => setNewPrinter({ ...newPrinter, isDefault: e.target.checked })}
                    />
                  }
                  label="Imprimante par défaut"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog('')}>Annuler</Button>
            <Button
              variant="contained"
              onClick={handleAddPrinter}
              disabled={!newPrinter.name || !newPrinter.type}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // Configuration du commerce
  const BusinessSettingsContent = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Configuration du Commerce</Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du commerce"
                value={businessSettings.name}
                onChange={(e) => setBusinessSettings({ ...businessSettings, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type de commerce</InputLabel>
                <Select
                  value={businessSettings.type}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, type: e.target.value })}
                >
                  {businessTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={businessSettings.address}
                onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={businessSettings.phone}
                onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={businessSettings.email}
                onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TVA (%)"
                type="number"
                value={businessSettings.tax}
                onChange={(e) => setBusinessSettings({ ...businessSettings, tax: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" startIcon={<SaveIcon />}>
                  Sauvegarder
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Paramètres avancés */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Paramètres avancés</Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Mode multi-caisse"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Système de fidélité"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Gestion des tables (Restaurant)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Commandes en ligne"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  // Personnalisation des documents
  const DocumentContent = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('receipt');
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Personnalisation des Documents</Typography>
        
        <Tabs
          value={selectedTemplate}
          onChange={(e, newValue) => setSelectedTemplate(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab value="receipt" label="Ticket de caisse" />
          <Tab value="invoice" label="Facture" />
          <Tab value="quote" label="Devis" />
        </Tabs>

        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={15}
                label="Template"
                defaultValue={`
                  {{businessName}}
                  {{businessAddress}}
                  
                  Date: {{date}}
                  Numéro: {{number}}
                  
                  {{items}}
                  
                  Total: {{total}}
                  TVA: {{tax}}
                `.trim()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Variables disponibles
                </Typography>
                <List dense>
                  <ListItem>
                    <Chip size="small" label="{{businessName}}" />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      Nom du commerce
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Chip size="small" label="{{date}}" />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      Date de la transaction
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Chip size="small" label="{{items}}" />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      Liste des articles
                    </Typography>
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ mr: 1 }}
              >
                Sauvegarder
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
              >
                Aperçu
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  // Rendu principal
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* En-tête */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Administration
        </Typography>

        {/* Navigation */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<StoreIcon />} label="Commerce" value="store" />
            <Tab icon={<CategoryIcon />} label="Catégories" value="categories" />
            <Tab icon={<UsersIcon />} label="Utilisateurs" value="users" />
            <Tab icon={<PrintIcon />} label="Imprimantes" value="printers" />
            <Tab icon={<ReceiptIcon />} label="Documents" value="documents" />
            <Tab icon={<StyleIcon />} label="Apparence" value="theme" />
          </Tabs>
        </Paper>

        {/* Contenu des onglets */}
        {currentTab === 'store' && <BusinessSettingsContent />}
        {currentTab === 'categories' && <CategoryManagementContent />}
        {currentTab === 'users' && <UserManagementContent />}
        {currentTab === 'printers' && <PrinterConfigContent />}
        {currentTab === 'documents' && <DocumentContent />}

        {/* Notifications */}
        <Snackbar
          open={notification.show}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, show: false })}
        >
          <Alert severity={notification.type} onClose={() => setNotification({ ...notification, show: false })}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default AdminPanel;