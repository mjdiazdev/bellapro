import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { CartProvider } from './context/CartContext';

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

function RequireAuth({children}) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* CLIENTE */}
          <Route path="/" element={<StorePage />} />
          <Route path="/info/:slug" element={<InfoPage />} />

          {/* ADMIN */}
          <Route path="/login" element={<Login/>} />
          <Route path="/admin/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
          <Route path="/admin/categories" element={<RequireAuth><Categories/></RequireAuth>} />
          <Route path="/admin/shipping-methods" element={<RequireAuth><ShippingMethods/></RequireAuth>} />
          <Route path="/admin/distribution-centers" element={<RequireAuth><DistributionCentersList/></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth><Users/></RequireAuth>} />
          <Route path="/admin/products" element={<RequireAuth><Products/></RequireAuth>} />
          <Route path="/admin/customers" element={<RequireAuth><Customers/></RequireAuth>} />
          <Route path="/admin/orders" element={<RequireAuth><Orders/></RequireAuth>} />

          {/* CARRO DE COMPRAS */}
          <Route path="/store" element={<StorePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thanks" element={<Thanks />} />

          {/* ESTA ES LA RUTA DONDE PAYPAL REGRESA AL USUARIO */}
          <Route path="/checkout/payment-confirm" element={<PaymentConfirmPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
