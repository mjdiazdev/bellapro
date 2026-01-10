import React, { useState, useEffect } from 'react'; 
import Header from '../../../components/common/HeaderClient';
import ProductItem from '../../../components/Client/Store/ProductItem';
import CartSidebar from '../../../components/Client/Store/CartSidebar';
import Footer from '../../../components/common/Footer';
import { Search } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getQrData } from "../../../services/apiService";
import { useCart } from "../../../context/CartContext";

export default function StorePage() {
  const [catalogProducts, setCatalogProducts] = useState([]); // productos de la categoría actual
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get("qr");
  const navigate = useNavigate();

  // Accedemos al carrito global
  const { cartProducts, addToCart, removeFromCart } = useCart();

  // Cargar productos desde QR
  useEffect(() => {
    if (!qrCode) return;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await getQrData(qrCode);
        setCategory(res.data.category);

      const newCatalog = res.data.products.map(p => ({
        id: p.id,
        name: p.name,
        reference: p.reference,
        price: Number(p.price),
        image: p.image_url
      }));

        // Solo cargamos el catálogo de la categoría actual
        setCatalogProducts(newCatalog);

      } catch (error) {
        console.error("Error loading QR data", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [qrCode]);

  // Lógica para buscar y hacer scroll (Efecto tipo Ctrl+F)
  useEffect(() => {
    if (searchTerm.trim() === "") return;

    // En tu useEffect de búsqueda dentro de StorePage.jsx
    const foundProduct = catalogProducts.find(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.reference && p.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (foundProduct) {
      const element = document.getElementById(`product-${foundProduct.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchTerm, catalogProducts]);

  // Totales basados en el carrito
  const items = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      {/* Header ahora no recibe props de carrito, todo se maneja desde CartContext */}
      <Header />

      <div className="max-w-[1150px] mx-auto px-4 pt-20"> 
        <div className="bg-[#fffafc] rounded-3xl p-6 md:p-8 shadow-sm">

          {/* BUSCADOR SUPERIOR */}
          <div className="mb-6 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Actualizamos el estado
              className="w-full h-10 pl-11 pr-4 rounded-full border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-pink"
            />
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

            {/* CATALOGO */}
            <div className="space-y-4">
              {/* Agregamos el uso de loading aquí */}
              {loading ? (
                <p className="text-center text-gray-500 animate-pulse py-10">Cargando productos...</p>
              ) : (
                <>
                  {category && <h2 className="text-xl font-bold text-gray-800 mb-4">{category.name}</h2>}

                  {catalogProducts.map(product => {
                    const cartProduct = cartProducts.find(p => p.id === product.id);
                    const isMatch = searchTerm !== "" && (
                      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.reference.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    return (
                      <ProductItem
                        key={product.id}
                        id={`product-${product.id}`}
                        isMatch={isMatch}
                        product={{
                          ...product,
                          quantity: cartProduct?.quantity || 0
                        }}
                        onAdd={() => addToCart(product)}
                        onRemove={() => removeFromCart(product.id)}
                      />
                    );
                  })}
                </>
              )}
            </div>

            {/* CARRITO */}
            <div className="sticky top-24 h-fit">
              <CartSidebar
                items={items}
                subtotal={subtotal}
                total={total}
                onCheckout={() => navigate("/checkout")} // redirige a checkout
              />
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
