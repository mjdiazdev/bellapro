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
    // Si no hay código postal, no intentamos cargar nada
    if (!postalCode) {
      setMethods([]);
      return;
    }

    const loadShippingMethods = async () => {
      setLoading(true);
      try {
        const res = await getAbsolute(`/distribution-centers/shipping-methods?postal_code=${postalCode}`);
        
        // Verificamos si res.data tiene la propiedad data (Laravel Resource) o es el array directo
        const rawData = res.data?.data || res.data || [];
        
        console.log("Datos crudos recibidos:", rawData); // MIRA ESTO EN CONSOLA

        if (Array.isArray(rawData) && rawData.length > 0) {
          const formattedMethods = rawData.map(method => ({
            id: method.pivot?.id || method.id, // Priorizamos el ID del pivote
            name: method.name,
            description: method.description,
            price: method.price
          }));

          setMethods(formattedMethods);

          // Notificar al padre después de actualizar el estado local
          if (onMethodsLoaded) {
            onMethodsLoaded(formattedMethods);
          }

          // Auto-selección inteligente
          if (!selectedShipping || !formattedMethods.some(m => m.id === selectedShipping)) {
            setSelectedShipping(formattedMethods[0].id);
          }
        } else {
          setMethods([]);
          if (onMethodsLoaded) onMethodsLoaded([]);
        }
      } catch (error) {
        console.error("Error cargando métodos:", error);
        setMethods([]);
      } finally {
        setLoading(false);
      }
    };

    loadShippingMethods();
  }, [postalCode]); // Se dispara cada vez que cambia el código postal

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Método de envío</h2>

      {!postalCode && (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
          ⚠️ Por favor, selecciona una ciudad y código postal para ver opciones de envío.
        </p>
      )}

      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">Buscando el centro logístico más cercano...</p>
      )}

      <div className="space-y-3">
        {!loading && postalCode && methods.length === 0 && (
          <p className="text-sm text-red-500 italic">
            Lo sentimos, no hay repartos disponibles para el código postal {postalCode}.
          </p>
        )}

        {methods.map((method) => (
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
        ))}
      </div>
    </section>
  );
};

export default ShippingMethod;