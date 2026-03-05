import React, { useState } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react"; // Añadimos Trash2 para el icono
import ProductItem from "./ProductItem";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import Button from "../../common/variant/Button";
import Modal from "../../common/Modal";

export default function CartDrawer({ open, onClose }) {
  // Extraemos clearCart del contexto
  const { cartProducts, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [stockModal, setStockModal] = useState({ open: false, title: '', message: '' });

  const handleStockAlert = (title, message) => {
    setStockModal({ open: true, title, message });
  };

  const productsInCart = cartProducts.filter(p => p.quantity > 0);
  const itemsCount = productsInCart.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] transition-opacity" 
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Tu Carrito</h2>
            <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {/* BOTÓN VACIAR (Solo si hay productos) */}
          <div className="flex items-center gap-2">
            {productsInCart.length > 0 && (
              <button 
                onClick={clearCart}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors mr-2 group"
                title="Vaciar carrito"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors group"
            >
              <X className="h-5 w-5 text-gray-500 group-hover:text-pink-600" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 custom-scrollbar">
          {productsInCart.length > 0 ? (
            <div className="space-y-3">
              {productsInCart.map(product => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onStockAlert={handleStockAlert}
                  onAdd={() => addToCart(product)}
                  onRemove={() => removeFromCart(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
              <div className="bg-pink-50 p-8 rounded-full">
                <ShoppingBag className="h-12 w-12 text-pink-300" />
              </div>
              <div>
                <p className="text-gray-800 font-bold text-lg">Tu carrito está vacío</p>
                <p className="text-gray-400 text-sm">Agrega productos para verlos aquí.</p>
              </div>
              <Button onClick={onClose} variant="outline">
                Continuar comprando
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {productsInCart.length > 0 && (
          <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] space-y-3">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-500 text-sm font-medium">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-gray-900">
                <span>Total</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                fullWidth 
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }} 
                className="py-4 text-lg shadow-lg shadow-pink-200"
              >
                Finalizar pedido
              </Button>
              
            </div>
          </div>
        )}
      </div>

      <Modal 
        open={stockModal.open} 
        title={stockModal.title} 
        onClose={() => setStockModal({ ...stockModal, open: false })}
      >
        <div className="py-2">
          <p className="text-gray-600 leading-relaxed">{stockModal.message}</p>
        </div>
      </Modal>
    </>
  );
}