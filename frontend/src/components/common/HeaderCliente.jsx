import React, { useState } from "react";
import MenuOverlay from "./MenuOverlay";
import "../../assets/css/Header.css";
import logo from "../../assets/logo.svg";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bp-header px-3 d-flex justify-content-between align-items-center">
        {/* Logo */}
        <img src={logo} alt="BellaPro" className="bp-logo" />

        {/* Botón menú */}
        <button className="bp-menu-btn" onClick={() => setOpen(true)}>
          <i className="fas fa-bars"></i>
        </button>
      </header>

      {/* Overlay */}
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
