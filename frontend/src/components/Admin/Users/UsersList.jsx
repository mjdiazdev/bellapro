import AdminTable from "../../common/AdminTable";

export default function UsersList({ users, onEdit, onDelete }) {
  
  // 1. Definimos las columnas
  const columns = [
    { 
      header: 'Nombre', 
      key: 'name' 
    },
    { 
      header: 'Email', 
      key: 'email' 
    },
    { 
      header: 'Rol', 
      key: 'role',
      // Transformamos el ID del rol en un texto amigable o una etiqueta
      render: (u) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
          u.role === 1 
            ? "bg-purple-900/30  border border-purple-500/50" 
            : "bg-blue-900/30  border border-blue-500/50"
        }`}>
          {u.role === 1 ? "Administrador" : "Usuario"}
        </span>
      )
    },
  ];

  return (
    <div className="p-6">      
      {/* 2. Llamamos al componente genérico */}
      <AdminTable 
        columns={columns}
        data={users}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}