import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Admin/Login/LoginForm';
import Footer from '../components/common/Footer';

export default function Login() {
  // Mantenemos tus estados originales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Nuevo: para feedback visual

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post('/login', { email, password });
      
      // Guardado de sesión original
      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      // Redirección
      navigate('/admin/dashboard');
    } catch (err) {
      // Manejo de error original potenciado
      setError(err.response?.data?.message || 'Error en las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizamos pasando las funciones al componente de BellaPro
  return (
    <div className="d-flex">
      <LoginForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        submit={submit}
        isLoading={isLoading}
      />  
    
      <Footer/>
    </div>
 
  );
  
}