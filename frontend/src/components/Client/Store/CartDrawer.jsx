import React from "react";
import { X, ShoppingBag } from "lucide-react"; // Añadimos ShoppingBag para el estado vacío
import ProductItem from "./ProductItem";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom"; // Para redirigir al checkout
import Button from "../../common/variant/Button";

export default function CartDrawer({ open, onClose }) {
  const { cartProducts, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const productsInCart = cartProducts.filter(p => p.quantity > 0);
  const items = productsInCart.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45]" 
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Tu Carrito</h2>
            <span className="bg-pink/10 text-pink text-xs font-bold px-2 py-1 rounded-full">
              {items} {items === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {productsInCart.length ? (
            <div className="space-y-2">
              {productsInCart.map(product => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onAdd={() => addToCart(product)}
                  onRemove={() => removeFromCart(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-gray-50 p-6 rounded-full">
                <ShoppingBag className="h-12 w-12 text-gray-300" />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Tu carrito está vacío</p>
                <p className="text-gray-400 text-sm">¡Agrega algunos productos para comenzar!</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con Totales y Botón */}
        {productsInCart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Button fullWidth onClick={() => {
                onClose();
                navigate("/checkout");
              }} className="mt-4">
              Finalizar pedido
            </Button>
          </div>
        )}
      </div>
    </>
  );
}