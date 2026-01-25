import React from 'react';

const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-gradient-to-b from-white to-[#FFF5F9]">
      {/* Contenedor de texto */}
      <div className="max-w-md">
        <h2 className="text-gray-500 text-2xl md:text-3xl font-medium mb-2">
          ¡Upssss!
        </h2>
        
        <h1 className="text-black text-7xl md:text-8xl font-black mb-6 tracking-tight">
          ¡404!
        </h1>

        <div className="space-y-1">
          <p className="text-black text-xl md:text-2xl font-bold">
            Algo salió mal.
          </p>
          <p className="text-gray-600 text-lg md:text-xl font-normal">
            No pudimos encontrar la página que buscas.
          </p>
          <p className="text-gray-600 text-lg md:text-xl font-normal">
            Prueba a escanear de nuevamente
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;