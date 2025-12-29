import AdminTable from "../../common/AdminTable"; // Ajusta la ruta según tu estructura

export default function ShippingMethodsList({ shippingMethods, onEdit, onDelete }) {
  
  // 1. Definimos las columnas
  const columns = [
    { 
      header: 'Nombre', 
      key: 'name' 
    },
    { 
      header: 'Descripción', 
      key: 'description' 
    },
    { 
      header: 'Precio', 
      key: 'price',
      // Usamos render para formatear el número como moneda
      render: (method) => (
        <span className="font-medium">
          ${Number(method.price).toFixed(2)}
        </span>
      )
    },
  ];

  return (
    <div className="p-6">      
      {/* 2. Llamamos al componente genérico */}
      <AdminTable 
        columns={columns}
        data={shippingMethods}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}