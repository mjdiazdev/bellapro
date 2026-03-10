import React from 'react';
import Button from '../../../components/common/variant/Button';
import { useCart } from '../../../context/CartContext';

export default function CartSidebar({ onCheckout }) {
  const { cartProducts } = useCart();

  // Filtrar productos que realmente están en el carrito
  const productsInCart = cartProducts.filter(p => p.quantity > 0);

  // Totales
  const items = productsInCart.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = subtotal; // puedes añadir impuestos/envío si quieres

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4">Lista de compras</h2>
      <hr />

      <div className="space-y-3 text-sm pt-4">
        <div className="flex justify-between">
          <span>Items</span>
          <span className="font-bold">{items}</span>
        </div>

        <div className="flex justify-between">
          <span>Sub Total</span>
          <span className="font-bold">€{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t pt-3 mt-3 text-base font-semibold">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <Button fullWidth onClick={onCheckout} className="mt-4">
        Realizar pedido
      </Button>
    </aside>
  );
}
