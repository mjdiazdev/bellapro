import React, { useState, useEffect } from "react";
import RadioCard from "../../common/variant/RadioCard";
import { Truck, Bolt, Gift } from "lucide-react";
import { getAbsolute } from "../../../services/apiService"; 

const iconMap = {
  "Envío Estándar": <Truck className="w-4 h-4 text-gray-500" />,
  "Envío Express": <Bolt className="w-4 h-4 text-gray-500" />,
  "Envío Gratuito": <Gift className="w-4 h-4 text-gray-500" />
};

const ShippingMethod = ({ selectedShipping, setSelectedShipping, onMethodsLoaded, postalCode }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. LIMPIEZA INMEDIATA: Si se borra el código postal, reseteamos TODO
    if (!postalCode || postalCode.trim() === "") {
      setMethods([]);
      setSelectedShipping(null); // MUY IMPORTANTE: Quitamos la selección anterior
      if (onMethodsLoaded) onMethodsLoaded([]);
      return;
    }

    const loadShippingMethods = async () => {
      setLoading(true);
      try {
        const res = await getAbsolute(`/distribution-centers/shipping-methods?postal_code=${postalCode}`);
        
        const rawData = res.data?.data || res.data || [];

        if (Array.isArray(rawData) && rawData.length > 0) {
          const formattedMethods = rawData.map(method => ({
            id: method.pivot?.id || method.id,
            name: method.name,
            description: method.description,
            price: method.price
          }));

          setMethods(formattedMethods);

          if (onMethodsLoaded) {
            onMethodsLoaded(formattedMethods);
          }

          // Auto-selección inteligente: solo si el actual ya no es válido
          if (!selectedShipping || !formattedMethods.some(m => m.id === selectedShipping)) {
            setSelectedShipping(formattedMethods[0].id);
          }
        } else {
          // Si el API responde vacío para ese CP específico
          setMethods([]);
          setSelectedShipping(null);
          if (onMethodsLoaded) onMethodsLoaded([]);
        }
      } catch (error) {
        console.error("Error cargando métodos:", error);
        setMethods([]);
        setSelectedShipping(null);
      } finally {
        setLoading(false);
      }
    };

    loadShippingMethods();
  }, [postalCode, setSelectedShipping]); // Añadimos setSelectedShipping a las dependencias por seguridad

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Método de envío</h2>

      {/* 2. Feedback visual cuando no hay CP */}
      {(!postalCode || postalCode.trim() === "") && (
        <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-2 shadow-sm">
          <span className="text-lg">⚠️</span>
          <p>Por favor, ingresa un <b>código postal</b> válido para calcular tus opciones y costos de envío.</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
           <div className="w-4 h-4 border-2 border-pink border-t-transparent rounded-full animate-spin"></div>
           <p className="text-sm text-gray-500 italic">Buscando el centro logístico más cercano...</p>
        </div>
      )}

      <div className="space-y-3 mt-4">
        {/* Solo mostramos la lista si hay código postal Y no estamos cargando */}
        {!loading && postalCode && postalCode.trim() !== "" && (
          <>
            {methods.length === 0 ? (
              <p className="text-sm text-red-500 italic bg-red-50 p-3 rounded-lg border border-red-100">
                Lo sentimos, no hay repartos disponibles para el código postal <b>{postalCode}</b>.
              </p>
            ) : (
              methods.map((method) => (
                <RadioCard
                  key={method.id}
                  title={method.name}
                  subtitle={method.description}
                  price={Number(method.price) === 0 ? "Gratis" : `€${Number(method.price).toFixed(2)}`}
                  icon={iconMap[method.name] || <Truck className="w-4 h-4 text-gray-500" />}
                  value={method.id}
                  selected={selectedShipping === method.id}
                  onChange={() => setSelectedShipping(method.id)}
                />
              ))
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ShippingMethod;