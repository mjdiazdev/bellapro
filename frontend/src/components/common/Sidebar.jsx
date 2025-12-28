import React, { useState } from 'react';
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { LayoutDashboard, Users, Briefcase, Package, ClipboardList, BarChart3, HelpCircle, Minimize2, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/products' },
  { name: 'Usuarios', icon: Users, path: '/admin/users' },
  { name: 'Clientes', icon: Briefcase, path: '/admin/customers' },
  { name: 'Centros de distribución', icon: Package, path: '/admin/shipping-methods' },
  { name: 'Pedidos', icon: ClipboardList, path: '/admin/orders' },
  { name: 'Estadísticas', icon: BarChart3, path: '/admin/stats' },
];

const bottomNavigation = [
  { name: 'Ayuda', icon: HelpCircle, path: '/help' },
  { name: 'Ocultar navegación', icon: Minimize2, path: '/hide' },
];

const NavItem = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center p-3 mx-4 rounded-xl transition-colors duration-150 ${
          isActive ? 'bg-gray-50 text-pink font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
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

  return (
    <>
      <button
        className="p-2 m-2 rounded-md bg-white shadow-md md:hidden fixed z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-xl transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 z-50`}
      >
        <div className="flex items-center justify-start p-6 pb-8 border-b border-gray-100">
          <Logo className="h-8" />
        </div>

        <nav className="flex-1 space-y-2 pt-4 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="mx-6 border-t border-gray-100 my-4" />

        <nav className="space-y-2 pb-4">
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>

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
