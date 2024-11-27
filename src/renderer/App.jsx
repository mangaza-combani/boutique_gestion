import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { NewSale } from './pages/sales/NewSale';
import { SalesHistory } from './pages/sales/SaleHistory';
import {InventoryManagement} from './pages/Inventory/index';
import {CustomerList} from './pages/customers/CustomerList';


// Configuration des flags futurs de React Router
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <BrowserRouter future={router.future}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path='/new-sale' element={
            <PrivateRoute>
              <NewSale />
            </PrivateRoute>
          }/>
          <Route path='/history' element={
            <PrivateRoute>
              <SalesHistory />
            </PrivateRoute>
          }/>

          <Route path='/inventory/*' element={
            <PrivateRoute>
              <InventoryManagement />
            </PrivateRoute>
          }/>
          <Route path='/customers' element={
            <PrivateRoute>
              <CustomerList />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;