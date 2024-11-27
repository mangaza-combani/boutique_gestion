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
  Info as InfoIcon,
  LocationOn as LocationOnIcon,
  TextFields as TextFieldsIcon,
  QrCode as QrCodeIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const ProductCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const CartPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  height: 'calc(100vh - 250px)',
  position: 'sticky',
  top: 24,
  display: 'flex',
  flexDirection: 'column',
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

// Composant Modal de détails produit
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

            {/* Stock par emplacement */}
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

            {/* Informations supplémentaires */}
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

            {/* Sélection de taille si nécessaire */}
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

// Dialogue de sélection de taille
const SizeDialog = ({ open, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAdd = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize);
      onClose();
      setSelectedSize(null);
    }
  };

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
          onClick={handleAdd}
          disabled={!selectedSize}
        >
          Ajouter au panier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Dialogue de paiement
const PaymentDialog = ({ open, onClose, total, onPayment }) => {
    const [amountGiven, setAmountGiven] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
  
    const handlePayment = () => {
      onPayment({
        method: paymentMethod,
        amountGiven: parseFloat(amountGiven),
        change: paymentMethod === 'cash' ? parseFloat(amountGiven) - total : 0,
      });
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Paiement - Total: {total.toFixed(2)} €</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                startIcon={<CardIcon />}
                onClick={() => setPaymentMethod('card')}
                sx={{ mb: 1 }}
              >
                Carte Bancaire
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                startIcon={<CashIcon />}
                onClick={() => setPaymentMethod('cash')}
              >
                Espèces
              </Button>
            </Grid>
            {paymentMethod === 'cash' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Montant reçu"
                  type="number"
                  value={amountGiven}
                  onChange={(e) => setAmountGiven(e.target.value)}
                  InputProps={{
                    endAdornment: <Typography>€</Typography>,
                  }}
                />
                {parseFloat(amountGiven) >= total && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    Monnaie à rendre: {(parseFloat(amountGiven) - total).toFixed(2)} €
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={
              !paymentMethod ||
              (paymentMethod === 'cash' && parseFloat(amountGiven) < total)
            }
          >
            Valider le paiement
          </Button>
        </DialogActions>
      </Dialog>
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
    const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
    const [productDetailOpen, setProductDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const [customer, setCustomer] = useState(null);
  
    // Données simulées
    const categories = [
      { id: 1, name: 'T-shirts', color: '#1976D2' },
      { id: 2, name: 'Jeans', color: '#2E7D32' },
      { id: 3, name: 'Robes', color: '#C2185B' },
      { id: 4, name: 'Accessoires', color: '#F57C00' },
      { id: 5, name: 'Chaussures', color: '#7B1FA2' },
    ];
  
    const products = [
      {
        id: 1,
        name: 'T-shirt Basic',
        reference: 'TSH-001',
        price: 19.99,
        category: 'T-shirts',
        description: 'T-shirt basique en coton 100% biologique. Coupe classique et confortable.',
        images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
        hasSizes: true,
        totalStock: 23,
        locations: [
            { id: 1, name: 'Rayon A1', stock: 10 },
            { id: 2, name: 'Réserve B2', stock: 13 }
          ],
          stock: {
            XS: 3,
            S: 5,
            M: 8,
            L: 4,
            XL: 2,
            XXL: 1,
          }
        },
        {
          id: 2,
          name: 'Jean Slim',
          reference: 'JEN-002',
          price: 49.99,
          category: 'Jeans',
          description: 'Jean slim stretch confortable. Coupe moderne et élégante.',
          images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
          hasSizes: true,
          totalStock: 17,
          locations: [
            { id: 1, name: 'Rayon B3', stock: 8 },
            { id: 2, name: 'Réserve C1', stock: 9 }
          ],
          stock: {
            XS: 2,
            S: 4,
            M: 6,
            L: 3,
            XL: 2,
            XXL: 0,
          }
        },
        // Ajoutez plus de produits ici
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
    
      const getFilteredProducts = () => {
        return products.filter(product => {
          const searchValue = searchTerm.toLowerCase();
          const matchesSearch = searchType === 'name'
            ? product.name.toLowerCase().includes(searchValue)
            : product.reference.toLowerCase().includes(searchValue);
          const matchesCategory = !selectedCategory || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });
      };
    
      const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        return subtotal * (1 - discount);
      };
    
      const handleApplyDiscount = () => {
        if (discountCode === 'PROMO10') {
          setDiscount(0.1);
          setDiscountError('');
        } else {
          setDiscountError('Code promo invalide');
          setDiscount(0);
        }
      };
    
      const handlePayment = (paymentDetails) => {
        // Ici, vous pouvez ajouter la logique de traitement du paiement
        console.log('Payment processed:', paymentDetails);
        
        // Réinitialisation après paiement
        setCart([]);
        setDiscount(0);
        setDiscountCode('');
      };
    
      return (
        <Box>
          {/* Header */}
          <Header>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Nouvelle Vente
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <UserProfile>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <CustomerIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Vendeur
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Caisse #1
                  </Typography>
                </Box>
              </UserProfile>
            </Box>
          </Header>
    
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Zone de gauche: Recherche et produits */}
              <Grid item xs={12} md={8}>
                {/* Barre de recherche */}
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                      />
                    </Grid>
                  </Grid>
                </Box>
    
                {/* Catégories */}
                <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
    
                {/* Grille de produits */}
                <Grid container spacing={2}>
                  {getFilteredProducts().map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <ProductCard onClick={() => handleProductClick(product)}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              variant="rounded"
                              src={product.images[0]}
                              sx={{ width: 60, height: 60, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Réf: {product.reference}
                              </Typography>
                              <Typography color="primary" variant="h6">
                                {product.price.toFixed(2)} €
                              </Typography>
                            </Box>
                            <IconButton 
                              sx={{ ml: 'auto' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                                setProductDetailOpen(true);
                              }}
                            >
                              <InfoOutlinedIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {product.hasSizes ? (
                              <Chip
                                size="small"
                                icon={<WarningIcon fontSize="small" />}
                                label="Sélectionner une taille"
                                color="primary"
                                variant="outlined"
                              />
                            ) : (
                              <Chip
                                size="small"
                                label={`Stock total: ${product.totalStock}`}
                                color={product.totalStock > 10 ? 'success' : 'warning'}
                              />
                            )}
                            <Tooltip title="Voir les emplacements">
                              <Chip
                                size="small"
                                icon={<LocationOnIcon fontSize="small" />}
                                label={product.locations[0]?.name}
                                variant="outlined"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(product);
                                  setProductDetailOpen(true);
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </ProductCard>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
    
              {/* Zone de droite: Panier */}
              <Grid item xs={12} md={4}>
                <CartPaper elevation={0}>
                  {/* En-tête du panier */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CartIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Panier en cours
                      </Typography>
                    </Box>
                    {customer ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CustomerIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.name}</Typography>
                      </Box>
                    ) : (
                      <Button
                        startIcon={<CustomerIcon />}
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => {/* Logique pour ajouter un client */}}
                      >
                        Ajouter un client
                      </Button>
                    )}
                  </Box>
    
                  {/* Liste des articles */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
                    <List>
                      {cart.map((item) => (
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
    
                  {/* Pied du panier avec total et actions */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    {/* Code promo */}
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={8}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Code promo"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            error={!!discountError}
                            helperText={discountError}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleApplyDiscount}
                            startIcon={<CouponIcon />}
                            sx={{ height: '40px' }}
                          >
                            Appliquer
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
    
                    {/* Résumé */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Sous-total</Typography>
                        <Typography>
                          {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} €
                        </Typography>
                      </Box>
                      {discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography color="success.main">Réduction</Typography>
                          <Typography color="success.main">
                            -{(cart.reduce((total, item) => total + (item.price * item.quantity), 0) *discount).toFixed(2)} €
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {calculateTotal().toFixed(2)} €
                    </Typography>
                  </Box>
                </Box>

                {/* Bouton de paiement */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setPaymentDialogOpen(true)}
                  disabled={cart.length === 0}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    background: theme.palette.success.main,
                    '&:hover': {
                      background: theme.palette.success.dark,
                    },
                  }}
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

export default NewSale;