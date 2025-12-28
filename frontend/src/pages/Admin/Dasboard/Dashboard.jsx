import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user from localStorage', err);
        setUser(null);
      }
    }
  }, []);

  // Cargar datos del dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard-data');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Error during logout', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="d-flex">
      <Sidebar />
      <Footer/>
    </div>
  );
}
