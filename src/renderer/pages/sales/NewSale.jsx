import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Chip,
  Typography,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Autocomplete,
} from '@mui/material';

import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  CreditCard as CardIcon,
  Money as CashIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  LocalAtm as CouponIcon,
  Receipt as ReceiptIcon,
  Person as CustomerIcon,
  ArrowBack,
  LocationOn as LocationOnIcon,
  TextFields as TextFieldsIcon,
  QrCode as QrCodeIcon,
  InfoOutlined as InfoOutlinedIcon,
  ChildCare as ChildIcon,
  Percent as PercentIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';
// Styled Components inchangés
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

const ProductCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));
const CartPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  height: '100%', 
  position: 'sticky',
  top: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 100px)', 
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
  },
}));

const UserProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));


const ProductDetailModal = ({ open, onClose, product, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {product?.name}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Images du produit */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={product?.images?.[selectedImage] || '/api/placeholder/400/400'}
                alt={product?.name}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </Box>
            {/* Galerie miniature */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {product?.images?.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid primary.main' : 'none',
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Détails du produit */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Référence: {product?.reference}
            </Typography>
            <Typography variant="body1" paragraph>
              {product?.description}
            </Typography>

            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Stock par emplacement:
            </Typography>
            <List>
              {product?.locations?.map((location) => (
                <ListItem 
                  key={location.id}
                  sx={{ 
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    mb: 1 
                  }}
                >
                  <ListItemText
                    primary={location.name}
                    secondary={`Stock: ${location.stock} unités`}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Prix: {product?.price.toFixed(2)} €
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Stock total: {product?.totalStock} unités
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Catégorie: {product?.category}
              </Typography>
            </Box>

            {product?.hasSizes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Tailles disponibles:
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(product.stock).map(([size, stock]) => (
                    <Grid item xs={4} key={size}>
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled={stock === 0}
                        sx={{
                          height: '48px',
                          position: 'relative',
                        }}
                      >
                        {size}
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            color: stock <= 3 ? 'warning.main' : 'inherit',
                          }}
                        >
                          {stock}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        <Button
          variant="contained"
          onClick={() => {
            if (product.hasSizes) {
              onClose();
              // Ouvrir le dialogue de sélection de taille
            } else {
              onAddToCart(product);
              onClose();
            }
          }}
        >
          Ajouter au panier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Composant de gestion des tailles
const SizeDialog = ({ open, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Sélectionner une taille
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          {product?.name}
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {product?.stock && Object.entries(product.stock).map(([size, stock]) => (
            <Grid item xs={4} key={size}>
              <Button
                variant={selectedSize === size ? "contained" : "outlined"}
                fullWidth
                onClick={() => setSelectedSize(size)}
                disabled={stock === 0}
                sx={{
                  height: '48px',
                  position: 'relative',
                  opacity: stock === 0 ? 0.5 : 1,
                }}
              >
                {size}
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    color: stock <= 3 ? 'warning.main' : 'inherit',
                  }}
                >
                  {stock}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            if (selectedSize) {
              onAddToCart(product, selectedSize);
              onClose();
              setSelectedSize(null);
            }
          }}
          disabled={!selectedSize}
        >
          Ajouter au panier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Composant de paiement amélioré
const PaymentDialog = ({ open, onClose, total, onPayment }) => {
  const [paymentStep, setPaymentStep] = useState('amount'); // 'amount', 'client', 'confirm'
  const [splitPayment, setSplitPayment] = useState(false);
  const [cardAmount, setCardAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [cashGiven, setCashGiven] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(false);
  const [childName, setChildName] = useState('');

  // Validation du paiement
  const isValidPayment = !splitPayment || 
    (splitPayment && (Number(cardAmount) + Number(cashAmount)).toFixed(2) === total.toFixed(2));

  const handleNext = () => {
    if (paymentStep === 'amount') {
      if (printInvoice) {
        setPaymentStep('client');
      } else {
        handlePayment();
      }
    } else if (paymentStep === 'client') {
      handlePayment();
    }
  };

  const handlePayment = () => {
    onPayment({
      splitPayment,
      cardAmount: splitPayment ? Number(cardAmount) : total,
      cashAmount: splitPayment ? Number(cashAmount) : 0,
      cashGiven: Number(cashGiven),
      change: Number(cashGiven) - (splitPayment ? Number(cashAmount) : total),
      client: selectedClient,
      printInvoice,
      childName
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {paymentStep === 'amount' ? 'Paiement' : 'Information client'}
      </DialogTitle>
      <DialogContent>
        {paymentStep === 'amount' ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Total à payer: {total.toFixed(2)} €
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={splitPayment}
                    onChange={(e) => {
                      setSplitPayment(e.target.checked);
                      if (!e.target.checked) {
                        setCardAmount(0);
                        setCashAmount(0);
                      }
                    }}
                  />
                }
                label="Paiement mixte (CB + Espèces)"
              />
            </Grid>

            {splitPayment ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Montant CB"
                    type="number"
                    value={cardAmount}
                    onChange={(e) => {
                      setCardAmount(e.target.value);
                      setCashAmount((total - Number(e.target.value)).toFixed(2));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CardIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Montant Espèces"
                    type="number"
                    value={cashAmount}
                    onChange={(e) => {
                      setCashAmount(e.target.value);
                      setCardAmount((total - Number(e.target.value)).toFixed(2));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CashIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CardIcon />}
                      onClick={() => {
                        setCardAmount(total);
                        setCashAmount(0);
                        handleNext();
                      }}
                    >
                      Carte bancaire
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CashIcon />}
                      onClick={() => {
                        setCardAmount(0);
                        setCashAmount(total);
                        setCashGiven(total.toString());
                      }}
                    >
                      Espèces
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {(splitPayment ? Number(cashAmount) > 0 : Number(cashGiven)) > 0 && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Montant reçu en espèces"
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">€</InputAdornment>
                  }}
                />
                {Number(cashGiven) > (splitPayment ? Number(cashAmount) : total) && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    Monnaie à rendre: {(Number(cashGiven) - (splitPayment ? Number(cashAmount) : total)).toFixed(2)} €
                  </Typography>
                )}
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={printInvoice}
                    onChange={(e) => setPrintInvoice(e.target.checked)}
                  />
                }
                label="Imprimer une facture"
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {/* Partie sélection/création client */}
            {/* Je vais continuer avec cette partie dans la prochaine portion */}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        {paymentStep === 'client' && (
          <Button onClick={() => setPaymentStep('amount')}>
            Retour
          </Button>
        )}
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!isValidPayment || (splitPayment && Number(cashAmount) > 0 && Number(cashGiven) < Number(cashAmount))}
        >
          {paymentStep === 'amount' && !printInvoice && 'Valider le paiement'}
          {paymentStep === 'amount' && printInvoice && 'Suivant'}
          {paymentStep === 'client' && 'Valider et imprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// ClientSelector Component
const ClientSelector = ({
  existingClients,
  selectedClient,
  onClientSelect,
  onClientCreate
}) => {
  const [newClientDialog, setNewClientDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Autocomplete
          fullWidth
          options={existingClients}
          value={selectedClient}
          onChange={(_, newValue) => onClientSelect(newValue)}
          getOptionLabel={(option) => option?.name || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Rechercher un client"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <CustomerIcon />
                  </InputAdornment>
                )
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography variant="subtitle2">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.phone} {option.email && `- ${option.email}`}
                </Typography>
              </Box>
            </li>
          )}
        />
        <Button
          variant="outlined"
          startIcon={<CustomerIcon />}
          onClick={() => setNewClientDialog(true)}
        >
          Nouveau
        </Button>
      </Box>

      <Dialog open={newClientDialog} onClose={() => setNewClientDialog(false)}>
        <DialogTitle>Nouveau client</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewClientDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => {
              onClientCreate(newClient);
              setNewClientDialog(false);
              setNewClient({ name: '', email: '', phone: '', address: '' });
            }}
            disabled={!newClient.name || !newClient.phone}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Cart Component
const Cart = ({ items, onUpdateQuantity, onRemoveItem, discounts, onApplyDiscount }) => {
  const theme = useTheme();
  const [discountCode, setDiscountCode] = useState('');

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
        <List>
          {items.map((item) => (
            <ListItem
              key={item.cartId}
              sx={{
                mb: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <ListItemText
                primary={item.displayName}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.price.toFixed(2)} € × {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                      Total: {(item.price * item.quantity).toFixed(2)} €
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item.cartId, -1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item.cartId, 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(item.cartId)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Code promo"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onApplyDiscount(discountCode)}
              startIcon={<CouponIcon />}
              sx={{ height: '40px' }}
            >
              Appliquer
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          {discounts.map((discount, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                color: 'success.main'
              }}
            >
              <Typography>Remise {discount.type}</Typography>
              <Typography>-{discount.amount.toFixed(2)} €</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Composant principal NewSale
export const NewSale = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState(false);
const [genderFilter, setGenderFilter] = useState('all');
const [sizeFilter, setSizeFilter] = useState('all');


const FilterSection = ({
  stockFilter,
  setStockFilter,
  genderFilter,
  setGenderFilter,
  sizeFilter,
  setSizeFilter
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Filtre de stock */}
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Switch
                checked={stockFilter}
                onChange={(e) => setStockFilter(e.target.checked)}
              />
            }
            label="En stock uniquement"
          />
        </Grid>

        {/* Filtre de genre */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              label="Genre"
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="homme">Homme</MenuItem>
              <MenuItem value="femme">Femme</MenuItem>
              <MenuItem value="unisexe">Unisexe</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtre de taille */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Taille</InputLabel>
            <Select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              label="Taille"
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="XS">XS</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

  // Données simulées (comme dans votre code original)
  const categories = [
    { id: 1, name: 'Parfums', color: '#9C27B0' },
    { id: 2, name: 'T-shirts', color: '#1976D2' },
    { id: 3, name: 'Pantalons', color: '#2E7D32' },
    { id: 4, name: 'Robes', color: '#C2185B' },
    { id: 5, name: 'Accessoires', color: '#F57C00' }
  ];

  const products = [
    // Parfums
    {
      id: 1,
      name: 'Light Blue',
      reference: 'PRF-001',
      price: 75.99,
      category: 'Parfums',
      description: 'Eau de toilette pour femme. Notes fraîches et fruitées avec une touche de jasmin.',
      images: ['/api/placeholder/400/400'],
      hasSizes: false,
      totalStock: 15,
      locations: [
        { id: 1, name: 'Vitrine A1', stock: 5 },
        { id: 2, name: 'Stock P1', stock: 10 }
      ]
    },
    {
      id: 2,
      name: 'Sauvage',
      reference: 'PRF-002',
      price: 89.99,
      category: 'Parfums',
      description: 'Eau de parfum pour homme. Notes boisées et épicées.',
      images: ['/api/placeholder/400/400'],
      hasSizes: false,
      totalStock: 12,
      locations: [
        { id: 1, name: 'Vitrine A2', stock: 4 },
        { id: 2, name: 'Stock P1', stock: 8 }
      ]
    },
    {
      id: 3,
      name: 'La Vie Est Belle',
      reference: 'PRF-003',
      price: 95.99,
      category: 'Parfums',
      description: 'Eau de parfum pour femme. Notes florales et gourmandes.',
      images: ['/api/placeholder/400/400'],
      hasSizes: false,
      totalStock: 8,
      locations: [
        { id: 1, name: 'Vitrine A1', stock: 3 },
        { id: 2, name: 'Stock P2', stock: 5 }
      ]
    },
  
    // T-shirts
    {
      id: 4,
      name: 'T-shirt Basic Cotton',
      reference: 'TSH-001',
      price: 19.99,
      category: 'T-shirts',
      description: 'T-shirt basique en coton 100% biologique. Coupe classique et confortable.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 75,
      locations: [
        { id: 1, name: 'Rayon A1', stock: 45 },
        { id: 2, name: 'Réserve B2', stock: 30 }
      ],
      stock: {
        XS: 10,
        S: 15,
        M: 20,
        L: 15,
        XL: 10,
        XXL: 5
      }
    },
    {
      id: 5,
      name: 'T-shirt Premium',
      reference: 'TSH-002',
      price: 29.99,
      category: 'T-shirts',
      description: 'T-shirt premium en coton pima. Coupe ajustée.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 60,
      locations: [
        { id: 1, name: 'Rayon A2', stock: 35 },
        { id: 2, name: 'Réserve B1', stock: 25 }
      ],
      stock: {
        S: 15,
        M: 20,
        L: 15,
        XL: 10
      }
    },
  
    // Pantalons
    {
      id: 6,
      name: 'Jean Slim Stretch',
      reference: 'PNT-001',
      price: 49.99,
      category: 'Pantalons',
      description: 'Jean slim en denim stretch. Confort optimal et style moderne.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 45,
      locations: [
        { id: 1, name: 'Rayon B1', stock: 30 },
        { id: 2, name: 'Réserve C1', stock: 15 }
      ],
      stock: {
        36: 8,
        38: 10,
        40: 12,
        42: 10,
        44: 5
      }
    },
    {
      id: 7,
      name: 'Pantalon Chino',
      reference: 'PNT-002',
      price: 39.99,
      category: 'Pantalons',
      description: 'Pantalon chino en coton. Coupe regular, parfait pour toutes les occasions.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 40,
      locations: [
        { id: 1, name: 'Rayon B2', stock: 25 },
        { id: 2, name: 'Réserve C2', stock: 15 }
      ],
      stock: {
        38: 8,
        40: 12,
        42: 12,
        44: 8
      }
    },
  
    // Robes
    {
      id: 8,
      name: 'Robe d\'Été Fleurie',
      reference: 'ROB-001',
      price: 45.99,
      category: 'Robes',
      description: 'Robe légère à motifs floraux. Parfaite pour l\'été.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 30,
      locations: [
        { id: 1, name: 'Rayon C1', stock: 20 },
        { id: 2, name: 'Réserve D1', stock: 10 }
      ],
      stock: {
        XS: 5,
        S: 8,
        M: 10,
        L: 7
      }
    },
    {
      id: 9,
      name: 'Robe de Soirée',
      reference: 'ROB-002',
      price: 89.99,
      category: 'Robes',
      description: 'Robe élégante pour les occasions spéciales. Tissu satiné.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 20,
      locations: [
        { id: 1, name: 'Rayon C2', stock: 12 },
        { id: 2, name: 'Réserve D2', stock: 8 }
      ],
      stock: {
        S: 5,
        M: 8,
        L: 7
      }
    },
  
    // Accessoires
    {
      id: 10,
      name: 'Ceinture Cuir',
      reference: 'ACC-001',
      price: 25.99,
      category: 'Accessoires',
      description: 'Ceinture en cuir véritable. Boucle classique argentée.',
      images: ['/api/placeholder/400/400'],
      hasSizes: true,
      totalStock: 0,
      locations: [
        { id: 1, name: 'Rayon D1', stock:0 },
        { id: 2, name: 'Réserve E1', stock:0 }
      ],
      stock: {
        '85cm': 0,
        '90cm': 0,
        '95cm': 0
      }
    }
  ];
  

  // Gestionnaires d'événements
  const handleProductClick = (product) => {
    if (product.hasSizes) {
      setSelectedProduct(product);
      setSizeDialogOpen(true);
    } else {
      handleAddToCart(product);
    }
  };

  const handleAddToCart = (product, size = null) => {
    const cartId = size ? `${product.id}-${size}` : product.id;
    const existingItem = cart.find(item => item.cartId === cartId);

    if (existingItem) {
      setCart(cart.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        cartId,
        size,
        quantity: 1,
        displayName: size ? `${product.name} (${size})` : product.name
      }]);
    }
  };

  const handleUpdateQuantity = (cartId, delta) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveItem = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const handlePayment = (paymentDetails) => {
    console.log('Payment processed:', paymentDetails);
    setCart([]);
    setDiscounts([]);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountTotal = discounts.reduce((total, discount) => total + discount.amount, 0);
    return subtotal - discountTotal;
  };
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Filtre de recherche
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch = searchType === 'name'
        ? product.name.toLowerCase().includes(searchValue)
        : product.reference.toLowerCase().includes(searchValue);
  
      // Filtre de catégorie
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
  
      // Filtre de stock
      const matchesStock = !stockFilter || product.totalStock > 0;
  
      // Filtre de genre
      const matchesGender = genderFilter === 'all' || product.gender === genderFilter;
  
      // Filtre de taille
      const matchesSize = sizeFilter === 'all' || 
        (product.stock && product.stock[sizeFilter] && product.stock[sizeFilter] > 0);
  
      return matchesSearch && matchesCategory && matchesStock && matchesGender && matchesSize;
    });
  };
  
  return (
    <Box>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Nouvelle Vente
          </Typography>
        </Box>
        <UserProfile>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <CustomerIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">Vendeur</Typography>
            <Typography variant="body2" color="text.secondary">
              Caisse #1
            </Typography>
          </Box>
        </UserProfile>
      </Header>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Zone produits (70%) */}
          <Grid item xs={12} md={8}>
            <SearchBar
              fullWidth
              placeholder={searchType === 'name' ? "Rechercher un article..." : "Rechercher par référence..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <ToggleButtonGroup
                      value={searchType}
                      exclusive
                      onChange={(e, newValue) => {
                        if (newValue) setSearchType(newValue);
                      }}
                      size="small"
                    >
                      <ToggleButton value="name">
                        <Tooltip title="Recherche par nom">
                          <TextFieldsIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="reference">
                        <Tooltip title="Recherche par référence">
                          <QrCodeIcon />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
   <FilterSection
    stockFilter={stockFilter}
    setStockFilter={setStockFilter}
    genderFilter={genderFilter}
    setGenderFilter={setGenderFilter}
    sizeFilter={sizeFilter}
    setSizeFilter={setSizeFilter}
  />

            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Tout"
                onClick={() => setSelectedCategory(null)}
                variant={!selectedCategory ? 'filled' : 'outlined'}
                color="primary"
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: selectedCategory === category.name ? category.color : 'transparent',
                    color: selectedCategory === category.name ? 'white' : category.color,
                    borderColor: category.color,
                  }}
                />
              ))}
            </Box>

            <Grid container spacing={2}>
  {getFilteredProducts().map((product) => (
      <Grid item xs={12} sm={6} md={4} key={product.id}>
        <ProductCard onClick={() => handleProductClick(product)}>
          <Box
            sx={{
              width: '100%',
              height: 200,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img
              src={"https://www.tiffincurry.ca/wp-content/uploads/2021/02/default-product.png"} // Chemin vers votre image par défaut
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f5f5f5'
              }}
            
            />
          </Box>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography color="primary" variant="h5" sx={{ mb: 2 }}>
              {product.price.toFixed(2)} €
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Réf: {product.reference}
              </Typography>
              <Typography 
                variant="body2" 
                color={product.totalStock > 10 ? 'success.main' : 'warning.main'}
                sx={{ fontWeight: 'medium' }}
              >
                Stock: {product.totalStock} unités
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                size="small"
                icon={<LocationOnIcon fontSize="small" />}
                label={product.locations[0]?.name}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Button
                size="small"
                startIcon={<InfoOutlinedIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(product);
                  setProductDetailOpen(true);
                }}
              >
                Détails
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(product);
                }}
              >
                Ajouter
              </Button>
            </Box>

            {product.hasSizes && (
              <Typography 
                variant="caption" 
                color="primary"
                sx={{ 
                  display: 'block', 
                  mt: 1,
                  fontWeight: 'medium'
                }}
              >
                Sélection de taille requise
              </Typography>
            )}
          </CardContent>
        </ProductCard>
      </Grid>
    ))}
</Grid>

          </Grid>

          {/* Zone panier (30%) */}
          <Grid item xs={12} md={4}>
          <CartPaper elevation={0}>
  {/* En-tête du panier */}
  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
    <Typography variant="h6">
      Panier ({cart.length} articles)
    </Typography>
  </Box>

  {/* Zone de liste avec scroll */}
  <Box 
    sx={{ 
      height: '1000px', // Hauteur fixe pour environ 4 articles
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'background.paper',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'divider',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'action.hover',
      },
    }}
  >
    <List sx={{ px: 2 }}>
      {cart.map((item) => (
        <ListItem
          key={item.cartId}
          sx={{
            mb: 1,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
            borderRadius: 2,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <ListItemText
            primary={
              <Typography fontWeight="medium">
                {item.displayName}
              </Typography>
            }
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.price.toFixed(2)} € × {item.quantity}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  Total: {(item.price * item.quantity).toFixed(2)} €
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleUpdateQuantity(item.cartId, -1)}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton
                size="small"
                onClick={() => handleUpdateQuantity(item.cartId, 1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                edge="end"
                onClick={() => handleRemoveItem(item.cartId)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Box>

  {/* Zone des remises et total */}

              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setPaymentDialogOpen(true)}
                  disabled={cart.length === 0}
                  startIcon={<CartIcon />}
                >
                  Procéder au paiement ({calculateTotal().toFixed(2)} €)
                </Button>
              </Box>
            </CartPaper>
          </Grid>
        </Grid>
      </Box>

      {/* Dialogs */}
      <ProductDetailModal
        open={productDetailOpen}
        onClose={() => setProductDetailOpen(false)}
        product={selectedProduct}
        onAddToCart={(product) => {
          if (product.hasSizes) {
            setProductDetailOpen(false);
            setSizeDialogOpen(true);
          } else {
            handleAddToCart(product);
            setProductDetailOpen(false);
          }
        }}
      />

      <SizeDialog
        open={sizeDialogOpen}
        onClose={() => setSizeDialogOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        total={calculateTotal()}
        onPayment={handlePayment}
      />
    </Box>
  );
};

// Hook personnalisé pour la gestion du panier (optionnel, pour une meilleure organisation)
const useCart = () => {
  const [cart, setCart] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const addToCart = (product, size = null) => {
    const cartId = size ? `${product.id}-${size}` : product.id;
    const existingItem = cart.find(item => item.cartId === cartId);

    if (existingItem) {
      setCart(cart.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        cartId,
        size,
        quantity: 1,
        displayName: size ? `${product.name} (${size})` : product.name
      }]);
    }
  };

  const updateQuantity = (cartId, delta) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountTotal = discounts.reduce((total, discount) => total + discount.amount, 0);
    return subtotal - discountTotal;
  };

  const clearCart = () => {
    setCart([]);
    setDiscounts([]);
  };

  return {
    cart,
    discounts,
    addToCart,
    updateQuantity,
    removeItem,
    setDiscounts,
    calculateTotal,
    clearCart,
  };
};



export default NewSale;