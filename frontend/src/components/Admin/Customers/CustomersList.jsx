import AdminTable from "../../common/AdminTable"; 

export default function CustomersList({ customers, onEdit, onDelete }) {

  // 1. Definimos las columnas para Clientes
  const columns = [
    { header: 'NIF', key: 'nif' },
    { header: 'Nombre', key: 'name' },
    { header: 'Teléfono', key: 'phone' },
    { header: 'Email', key: 'email'},
  ];

  return (
    <div className="p-6">      
      {/* 2. Llamamos al componente genérico */}
      <AdminTable 
        columns={columns}
        data={customers}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}