import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export const CustomerForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    // Adresse de facturation
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
    // Adresse de livraison
    shippingAddress: {
      sameAsBilling: true,
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
    // Préférences
    preferences: {
      newsletter: true,
      smsNotifications: true,
    },
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Logique de sauvegarde
      navigate('/customers');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {isEdit ? 'Modifier le client' : 'Nouveau client'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Informations de base */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom complet"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Adresse de facturation */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Adresse de facturation
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rue"
                value={formData.billingAddress.street}
                onChange={(e) => setFormData({
                  ...formData,
                  billingAddress: {
                    ...formData.billingAddress,
                    street: e.target.value
                  }
                })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ville"
                value={formData.billingAddress.city}
                onChange={(e) => setFormData({
                  ...formData,
                  billingAddress: {
                    ...formData.billingAddress,
                    city: e.target.value
                  }
                })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Code postal"
                value={formData.billingAddress.postalCode}
                onChange={(e) => setFormData({
                  ...formData,
                  billingAddress: {
                    ...formData.billingAddress,
                    postalCode: e.target.value
                  }
                })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pays"
                value={formData.billingAddress.country}
                onChange={(e) => setFormData({
                  ...formData,
                  billingAddress: {
                    ...formData.billingAddress,
                    country: e.target.value
                  }
                })}
              />
            </Grid>

            {/* Préférences */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Préférences
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferences.newsletter}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        newsletter: e.target.checked
                      }
                    })}
                  />
                }
                label="Inscription à la newsletter"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferences.smsNotifications}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        smsNotifications: e.target.checked
                      }
                    })}
                  />
                }
                label="Notifications SMS"
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes internes sur le client..."
              />
            </Grid>
          </Grid>

          {/* Boutons d'action */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/customers')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {isEdit ? 'Enregistrer' : 'Créer le client'}
            </Button>
          </Box>
        </Paper>
      </form>
    </Box>
  );
};