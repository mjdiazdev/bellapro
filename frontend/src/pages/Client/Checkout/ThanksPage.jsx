import React from 'react';
import Header from '../../../components/common/HeaderClient';
import Footer from '../../../components/common/Footer';
import Thanks from '../../../components/Client/Checkout/Thanks'; // Ajusta la ruta según donde guardes el componente

export default function ThanksPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
        <div className="max-w-[1150px] w-full mx-auto">
          <div className="p-8 md:p-16 min-h-[500px] flex items-center justify-center">
            <Thanks />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}