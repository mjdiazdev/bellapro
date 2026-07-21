import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { QrCode, ShoppingCart, Menu as MenuIcon } from "lucide-react"; 
import QRScanModal from "./QRScanModal";
import CartDrawer from "../Client/Store/CartDrawer";
import MenuOverlay from "./MenuOverlay"; 
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [openQR, setOpenQR] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile] = useState(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  const { cartProducts, addToCart, removeFromCart } = useCart();
  const totalItems = cartProducts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <>
      <header className="w-full bg-pink-50 fixed top-0 left-0 z-50 shadow-sm">
        <div className="max-w-[1150px] mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          
          {/* Logo con tamaño responsivo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              {/* h-6 para móviles, md:h-8 para tablets en adelante */}
              <Logo className="h-6 md:h-8 w-auto" />
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* En móvil invita a escanear; en escritorio (sin cámara) invita a indicar la página */}
            <button
              onClick={() => setOpenQR(true)}
              className="flex items-center border border-pink space-x-1 md:space-x-2 bg-pink-50 text-pink px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-pink-100 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-[10px] md:text-sm tracking-tight">
                {isMobile ? "Escanear página" : "Indica la página"}
              </span>
            </button>

            {/* Carrito */}
            <button 
              onClick={() => setOpenCart(true)} 
              className="relative p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-pink text-white text-[9px] md:text-[10px] font-bold h-4 w-4 md:h-5 md:w-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Menú Hamburgesa */}
            <MenuIcon 
              className="h-6 w-6 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" 
              onClick={() => setOpenMenu(true)}
            />
          </div>
        </div>
      </header>
      
      {/* Modales y Drawers se mantienen igual */}
      <QRScanModal open={openQR} onClose={() => setOpenQR(false)} />
      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        products={cartProducts}
        handleAdd={addToCart}
        handleRemove={removeFromCart}
      />
      <MenuOverlay open={openMenu} onClose={() => setOpenMenu(false)} />
    </>
  );
}