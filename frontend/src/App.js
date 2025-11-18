import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClienteHome from './pages/ClienteHome'; // 👉 NUEVO

function RequireAuth({children}) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* CLIENTE */}
        <Route path="/" element={<ClienteHome />} />

        {/* ADMIN */}
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />

      </Routes>
    </BrowserRouter>
  );
}
