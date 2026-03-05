import React from "react";
import AdminTable from "../../common/AdminTable";

export default function DistributionCentersList({ centers, onEdit, onDelete }) {
  // Definición de las columnas actualizadas
  const columns = [
    { 
      header: "Nombre del Centro", 
      key: "name",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{item.name}</span>
          <span className="text-[10px] uppercase text-pink-500 font-semibold">
            ID: {String(item.id).padStart(4, '0')}
          </span>
        </div>
      )
    },
    { 
      header: "Contacto del Centro", 
      key: "email",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.email}</span>
          <span className="text-xs text-gray-500">{item.phone}</span>
        </div>
      )
    },
    { 
      header: "Encargado / Coordinador", 
      key: "coordinator",
      render: (item) => {
        // Accedemos a la relación 'coordinator' que definimos en el modelo
        const coordinator = item.coordinator;
        
        return (
          <div className="flex flex-col">
            {coordinator ? (
              <>
                <span className="font-semibold text-gray-700">{coordinator.name}</span>
                <span className="text-xs text-gray-400 italic">{coordinator.email}</span>
              </>
            ) : (
              <span className="text-xs text-red-400 italic">Sin coordinador asignado</span>
            )}
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
        rowsPerPage={10}
      />
    </div>
  );
}