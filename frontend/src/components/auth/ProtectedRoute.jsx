import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const storedData = JSON.parse(localStorage.getItem('user'));
  const userRole = storedData?.user?.role_name || 'guest';

  // Si el rol del usuario está en la lista de permitidos, dejamos pasar (Outlet)
  // De lo contrario, lo devolvemos a la página de pedidos
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/orders" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;