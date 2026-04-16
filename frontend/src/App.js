import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/common/ScrollToTop';

import Login from './pages/Login';
import Categories from './pages/Admin/Categories/CategoriesListPage';
import ShippingMethods from './pages/Admin/ShippingMethods/ShippingMethodsListPage';
import Users from './pages/Admin/Users/UsersListPage';
import StorePage from './pages/Client/Store/StorePage';
import CheckoutPage from './pages/Client/Checkout/CheckoutPage';
import PaymentConfirmPage from './pages/Client/Checkout/PaymentConfirmPage';
import Products from './pages/Admin/Products/ProductsListPage';
import Customers from './pages/Admin/Customers/CustomersListPage';
import Orders from './pages/Admin/Orders/OrdersListPage';
import DistributionCentersList from './pages/Admin/DistributionCenters/DistributionCentersPage';
import Thanks from './pages/Client/Checkout/ThanksPage';
import InfoPage from './pages/Client/Info/InfoPage';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/Admin/Dashboard/DashboardPage';
/**
 * Componente de Seguridad Mejorado
 * Revisa Token y Roles permitidos
 */
function RequireAuth({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const storedData = JSON.parse(localStorage.getItem('user'));
  
  // Extraemos el rol del usuario (asumiendo la estructura que corregimos en el AuthController)
  const userRole = storedData?.user?.role_name || storedData?.role_name || 'guest';

  // 1. Si no hay token, al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay roles definidos y el usuario no tiene uno permitido, rebotar a Pedidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/orders" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <Routes>
          {/* CLIENTE */}
          <Route path="/" element={<StorePage />} />
          <Route path="/info/:slug" element={<InfoPage />} />

          {/* ADMIN & LOGIN */}
          <Route path="/login" element={<Login/>} />

          {/* RUTAS PARA TODOS LOS AUTENTICADOS (Admin y Coordinador) */}
          <Route path="/admin/orders" element={
            <RequireAuth allowedRoles={['admin', 'coordinador']}>
              <Orders/>
            </RequireAuth>
          } />

          {/* RUTAS EXCLUSIVAS DE ADMINISTRADOR */}
          <Route path="/admin/dashboard" element={
            <RequireAuth allowedRoles={['admin', 'coordinador']}>
              <Dashboard/>
            </RequireAuth>
          } />
          <Route path="/admin/categories" element={
            <RequireAuth allowedRoles={['admin']}>
              <Categories/>
            </RequireAuth>
          } />
          <Route path="/admin/shipping-methods" element={
            <RequireAuth allowedRoles={['admin']}>
              <ShippingMethods/>
            </RequireAuth>
          } />
          <Route path="/admin/distribution-centers" element={
            <RequireAuth allowedRoles={['admin']}>
              <DistributionCentersList/>
            </RequireAuth>
          } />
          <Route path="/admin/users" element={
            <RequireAuth allowedRoles={['admin']}>
              <Users/>
            </RequireAuth>
          } />
          <Route path="/admin/products" element={
            <RequireAuth allowedRoles={['admin']}>
              <Products/>
            </RequireAuth>
          } />
          <Route path="/admin/customers" element={
            <RequireAuth allowedRoles={['admin']}>
              <Customers/>
            </RequireAuth>
          } />

          {/* CARRO DE COMPRAS & OTROS */}
          <Route path="/store" element={<StorePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/checkout/payment-confirm" element={<PaymentConfirmPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}