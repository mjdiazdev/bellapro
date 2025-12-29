import React from "react";
import AdminTable from "../../common/AdminTable"; // Asegúrate de que la ruta sea correcta

export default function DistributionCentersList({ centers, onEdit, onDelete }) {
  // Definición de las columnas para la AdminTable
  const columns = [
    { 
      header: "Nombre del Centro", 
      key: "name" 
    },
    { 
      header: "Contacto", 
      key: "email",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.email}</span>
          <span className="text-xs text-gray-500">{item.phone}</span>
        </div>
      )
    },
    { 
      header: "Dirección", 
      key: "address" 
    },
    { 
      header: "Ubicación", 
      key: "location",
      render: (item) => {
        // Accedemos a la relación anidada que viene del Backend
        const cp = item.postal_code?.code || "N/A";
        const city = item.postal_code?.city?.name || "";
        const province = item.postal_code?.city?.province?.name || "";
        
        return (
          <div className="text-sm">
            <span className="block font-bold text-pink">{cp}</span>
            <span className="text-gray-600 italic">
              {city}{city && province ? ', ' : ''}{province}
            </span>
          </div>
        );
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-inner">
      <AdminTable
        columns={columns}
        data={centers}
        onEdit={onEdit}
        onDelete={onDelete}
        // Puedes agregar onView si deseas ver un mapa o detalles extendidos después
        rowsPerPage={10}
      />
    </div>
  );
}