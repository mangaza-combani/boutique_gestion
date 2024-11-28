import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import StockOverview from '../../components/Inventory/StockOverview';
import ProductDetails from '../../components/Inventory/ProductDetails';
import StockMovements from '../../components/Inventory/StockMovements';
import Inventory from '../../components/Inventory/Inventory';
import { InventoryProvider } from '../../context/InventoryContext';
import AddProduct from '../../components/Inventory/AddProduct';

export const InventoryManagement = () => {
  return (
    <InventoryProvider>
      <Routes>
        <Route path="/" element={<StockOverview />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/movements" element={<StockMovements />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/inventory" element={<Inventory />} />
      

      </Routes>
    </InventoryProvider>
  );
};

