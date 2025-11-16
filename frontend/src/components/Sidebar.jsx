import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-light vh-100 p-3" style={{ width: 240 }}>
      <h5 className="mb-4">BellaPro</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            <i className="fas fa-tachometer-alt me-2" /> Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/usuarios" className="nav-link">
            <i className="fas fa-users me-2" /> Usuarios
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
