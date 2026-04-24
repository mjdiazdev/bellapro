import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/HeaderClient';
import ProductItem from '../../../components/Client/Store/ProductItem';
import CartSidebar from '../../../components/Client/Store/CartSidebar';
import Footer from '../../../components/common/Footer';
import { Search, Download } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getQrData } from "../../../services/apiService";
import { useCart } from "../../../context/CartContext";
import Modal from '../../../components/common/Modal';

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
      setCatalogProducts([]); // <-- LIMPIAMOS el catálogo anterior para dar feedback visual
      try {
        const res = await getQrData(qrCode);
        setCategory(res.data.category);

        const newCatalog = res.data.products.map(p => ({
          id: p.id,
          name: p.name,
          reference: p.reference,
          price: Number(p.price),
          image: p.image_url,
          stock: p.stock ? p.stock.stock : 0
        }));

        setCatalogProducts(newCatalog);
        
        // Forzamos el scroll arriba cuando cargan los productos
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error("Error loading QR data", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [qrCode]); // Este qrCode detectará el cambio desde la URL

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

  const [stockModal, setStockModal] = useState({ open: false, title: '', message: '' });

  const handleStockAlert = (title, message) => {
    setStockModal({ open: true, title, message });
  };
  

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      {/* Header ahora no recibe props de carrito, todo se maneja desde CartContext */}
      <Header />

      <div className="max-w-[1150px] mx-auto px-4 pt-20"> 
        <div className="bg-[#fffafc] rounded-3xl p-6 md:p-8 shadow-sm">

          {/* BANNER CATÁLOGO */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-pink-50 border border-pink/20 rounded-2xl px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Descarga nuestro catálogo completo</p>
              <p className="text-xs text-gray-500 mt-0.5">Todos nuestros productos en un solo documento</p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 bg-pink text-white text-sm font-medium px-5 py-2.5 rounded-full opacity-50 cursor-not-allowed"
              title="Próximamente disponible"
            >
              <Download className="h-4 w-4" />
              Descargar catálogo
            </button>
          </div>

          {/* BUSCADOR SUPERIOR */}
          <div className="sticky top-[72px] z-30 bg-[#fffafc] pb-4 -mx-2 px-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-11 pr-4 rounded-full border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:border-pink shadow-sm bg-white"
              />
            </div>
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
                    // 1. Buscamos si este producto ya está en el carrito para saber su cantidad
                    const cartProduct = cartProducts.find(p => p.id === product.id);
                    const currentQuantity = cartProduct?.quantity || 0;

                    return (
                      <ProductItem
                        key={product.id}
                        id={`product-${product.id}`}
                        onStockAlert={handleStockAlert}
                        // Pasamos el producto combinado con su cantidad actual en el carro
                        product={{
                          ...product,
                          quantity: currentQuantity
                        }}
                        isMatch={searchTerm !== "" && (
                          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.reference.toLowerCase().includes(searchTerm.toLowerCase())
                        )}
                        onAdd={() => addToCart(product)}
                        onRemove={() => removeFromCart(product.id)}
                      />
                    );
                  })}
                </>
              )}
            </div>

            {/* CARRITO */}
            <div className="sticky top-[135px] h-fit transition-all duration-300 pt-2">
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
      {/* MODAL GLOBAL - Siempre al final del componente principal */}
      <Modal 
        open={stockModal.open} 
        title={stockModal.title} 
        onClose={() => setStockModal({ ...stockModal, open: false })}
      >
        <div className="text-gray-600">
          <p>{stockModal.message}</p>
        </div>
      </Modal>
      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a
        href="https://wa.me/34692101856"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.847L.057 23.882a.5.5 0 0 0 .611.611l6.053-1.456A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.51-5.17-1.401l-.371-.217-3.843.925.942-3.825-.234-.38A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

      <Footer />
    </div>
  );
}
