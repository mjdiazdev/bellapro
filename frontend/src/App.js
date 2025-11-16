import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


function RequireAuth({children}){
const token = localStorage.getItem('token');
return token ? children : <Navigate to="/login" />;
}


export default function App(){
return (
<BrowserRouter>
<Routes>
<Route path="/login" element={<Login/>} />
<Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
<Route path="/" element={<Navigate to="/dashboard" />} />
</Routes>
</BrowserRouter>
);
}