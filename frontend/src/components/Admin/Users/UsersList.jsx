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
      render: (u) => {
        // Definimos estilos según el ID del rol
        let label = "Usuario";
        let styles = "bg-blue-900/30 border border-blue-500/50";

        if (u.role === 1) {
          label = "Administrador";
          styles = "bg-purple-900/30 border border-purple-500/50 ";
        } else if (u.role === 3) {
          label = "Coordinador";
          styles = "bg-pink-900/30 border border-pink-500/50";
        }

        return (
          <span className={`px-2 py-1 rounded-md text-xs font-bold ${styles}`}>
            {label}
          </span>
        );
      }
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