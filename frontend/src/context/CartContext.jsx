import React, { createContext, useContext, useState, useEffect } from "react";

// Creamos el contexto
const CartContext = createContext();

// Este componente envuelve la app
export function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const addToCart = (product) => {
    setCartProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartProducts(prev =>
      prev.map(p => 
        p.id === id ? { ...p, quantity: Math.max(p.quantity - 1, 0) } : p
      )
    );
  };

  // 🔹 Nuevo método para vaciar el carrito
  const clearCart = () => setCartProducts([]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addToCart,
        removeFromCart,
        clearCart // exportamos el método
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar el carrito fácilmente
export function useCart() {
  return useContext(CartContext);
}
