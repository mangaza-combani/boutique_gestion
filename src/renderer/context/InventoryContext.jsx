import React, { createContext, useContext, useState, useCallback } from 'react';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 'P001',
      name: 'T-shirt Basic',
      reference: 'TSH-001',
      category: 'T-shirts',
      purchasePrice: 10.99,
      sellingPrice: 19.99,
      margin: 9,
      stock: {
        XS: 10,
        S: 15,
        M: 20,
        L: 15,
        XL: 10,
        XXL: 5
      },
      totalStock: 75,
      minStock: 20,
      maxStock: 100,
      supplier: 'Textile Pro',
      location: 'A-123',
      lastInventory: '2024-03-20',
      images: ['/api/placeholder/400/400'],
      movements: [
        {
          id: 'MVT-001',
          date: '2024-03-20',
          type: 'purchase',
          quantity: 50,
          price: 10.99,
          reference: 'PO-001',
          note: 'Réapprovisionnement initial'
        }
      ]
    },
    // Autres produits...
  ]);

  const [movements] = useState([
    {
      id: 'MVT-001',
      productId: 'P001',
      date: '2024-03-20',
      type: 'purchase',
      quantity: 50,
      price: 10.99,
      reference: 'PO-001'
    },
    // Autres mouvements...
  ]);

  const [categories] = useState([
    { id: 1, name: 'T-shirts', color: '#1976D2' },
    { id: 2, name: 'Pantalons', color: '#2E7D32' },
    { id: 3, name: 'Robes', color: '#C2185B' },
    // Autres catégories...
  ]);

  const addMovement = useCallback((movement) => {
    setProducts(currentProducts => {
      return currentProducts.map(product => {
        if (product.id === movement.productId) {
          const newQuantity = movement.type === 'purchase' 
            ? product.totalStock + movement.quantity
            : product.totalStock - movement.quantity;

          return {
            ...product,
            totalStock: newQuantity,
            movements: [...product.movements, movement]
          };
        }
        return product;
      });
    });
  }, []);

  const updateInventory = useCallback((productId, newStock) => {
    setProducts(currentProducts => {
      return currentProducts.map(product => {
        if (product.id === productId) {
          const difference = newStock - product.totalStock;
          const movement = {
            id: `MVT-${Date.now()}`,
            date: new Date().toISOString(),
            type: 'adjustment',
            quantity: Math.abs(difference),
            adjustment: difference > 0 ? 'increase' : 'decrease',
            note: 'Ajustement d\'inventaire'
          };

          return {
            ...product,
            totalStock: newStock,
            lastInventory: new Date().toISOString(),
            movements: [...product.movements, movement]
          };
        }
        return product;
      });
    });
  }, []);

  const value = {
    products,
    movements,
    categories,
    addMovement,
    updateInventory
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};