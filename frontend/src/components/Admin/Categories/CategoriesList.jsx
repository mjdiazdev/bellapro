import { useState } from "react";
import AdminTable from "../../common/AdminTable";
import CategoryDetailsModal from "./CategoryDetailsModal";

export default function CategoriesList({ categories, onEdit, onDelete }) {
  // Estado para el modal de detalles (Lógica específica de esta página)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 1. Definimos las columnas específicas para Categorías
  const columns = [
    { 
      header: 'Nombre', 
      key: 'name' 
    },
    { 
      header: 'Código', 
      key: 'code' 
    },
  ];

  return (
    <div className="p-6">
      {/* 2. Llamamos al componente genérico */}
      <AdminTable 
        columns={columns}
        data={categories}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={(cat) => setSelectedCategory(cat.code)} // Pasamos el objeto completo o el code
      />

      {/* 3. Modales específicos de esta gestión */}
      {selectedCategory && (
        <CategoryDetailsModal
          categoryCode={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}