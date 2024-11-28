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
import {CustomerManagement} from './pages/customers';
import {SaleDetails} from './pages/sales/SaleDetails';
import CashRegisterSystem from './pages/caisse/CashRegisterSystem.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';



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
            <Route path='/sales/:id' element={
            <PrivateRoute>
              <SaleDetails/>
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
          <Route path='/customers/*' element={
            <PrivateRoute>
              <CustomerManagement/>
            </PrivateRoute>
          } />
          <Route path='/cash-register' element={
            <PrivateRoute>
              <CashRegisterSystem/>
            </PrivateRoute>
          } />
          <Route path='/admin' element={
            <PrivateRoute>
              <AdminPanel/>
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;