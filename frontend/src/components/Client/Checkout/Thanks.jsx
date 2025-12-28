import React from 'react';
import { Check } from 'lucide-react';
import Button from '../../../components/common/variant/Button';
import { useNavigate } from 'react-router-dom';

export default function Thanks() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      {/* Texto Superior */}
      <p className="text-gray-500 text-lg mb-2">
        Tu pedido ha sido recibido con éxito
      </p>

      {/* Título Principal */}
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
        ¡Gracias por tu compra!
      </h1>

      {/* Descripción */}
      <p className="text-gray-600 text-base md:text-lg max-w-md mb-10 leading-relaxed">
        En breve recibirás un correo con los detalles y la confirmación del envío.
      </p>

      {/* Botón (Usando tu componente común) */}
      <div className="w-full max-w-xs mb-16">
        <Button 
          fullWidth 
          onClick={() => navigate('/')} 
          className="bg-pink-400 hover:bg-pink-500 text-white rounded-full py-3"
        >
          Escanear otra página
        </Button>
      </div>

      {/* Icono de Check inferior */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-pink-200 bg-pink-50">
        <Check className="w-10 h-10 text-pink-500" strokeWidth={3} />
      </div>
    </div>
  );
}