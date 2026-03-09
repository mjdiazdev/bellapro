import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { 
  LayoutDashboard, Layers, ShoppingBag, Users, Briefcase, 
  Truck, Package, ClipboardList, HelpCircle, Menu 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// 1. Definimos la navegación fuera para que sea una constante limpia
const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', roles: ['admin', 'coordinador'] },
  { name: 'Categorías', icon: Layers, path: '/admin/categories', roles: ['admin'] },
  { name: 'Productos', icon: ShoppingBag, path: '/admin/products', roles: ['admin'] },
  { name: 'Clientes', icon: Briefcase, path: '/admin/customers', roles: ['admin'] },
  { name: 'Métodos de envío', icon: Truck, path: '/admin/shipping-methods', roles: ['admin'] },
  { name: 'Centros de distribución', icon: Package, path: '/admin/distribution-centers', roles: ['admin'] },
  { name: 'Pedidos', icon: ClipboardList, path: '/admin/orders', roles: ['admin', 'coordinador'] },
  { name: 'Usuarios', icon: Users, path: '/admin/users', roles: ['admin'] },
];

/*const bottomNavigation = [
  { name: 'Ayuda', icon: HelpCircle, path: '/help' },
];*/

const NavItem = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center p-3 mx-4 rounded-xl transition-colors duration-150 ${
          isActive ? 'bg-gray-50 text-pink-500 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`
      }
    >
      <Icon className="h-5 w-5 mr-3" />
      <span className="text-sm">{item.name}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // 2. El useEffect DEBE estar aquí adentro
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('user'));
    
    // Extraemos el rol del objeto que definimos en el AuthController
    // Intentamos buscarlo en diferentes posiciones por seguridad
    const role = storedData?.user?.role_name || 
                 storedData?.role_name || 
                 storedData?.user?.roles?.[0]?.name || 
                 'guest';

    console.log("Rol cargado en Sidebar:", role);
    setUserRole(role);
  }, []);

  // 3. Filtramos la navegación
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Botón Móvil */}
      <button
        className="p-2 m-2 rounded-md bg-white shadow-md md:hidden fixed z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-xl transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 z-50 flex flex-col`}
      >
        <div className="flex items-center justify-start p-6 pb-8 border-b border-gray-100">
          <Logo className="h-8" />
        </div>

        <nav className="flex-1 space-y-2 pt-4 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="mx-6 border-t border-gray-100 my-4" />

        <nav className="space-y-2 pb-4">
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
          
          <div className="px-8 py-2">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Sesión: {userRole}
             </span>
          </div>
        </nav>
      </div>

      {/* Overlay Móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;