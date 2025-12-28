/**
 * Componente visual de listado de usuarios
 * Solo UI – no contiene lógica del backend.
 */

export default function UsersList({ users, onEdit, onDelete }) {
  return (
    <div className="p-6 rounded-lg">

      <table className="w-full text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-50">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-200">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role === 1 ? "Administrador" : "Usuario"}</td>

              <td className="p-3 flex gap-3">
                <button
                  className="text-pink font-medium"
                  onClick={() => onEdit(u.id)}
                >
                  Editar
                </button>

                <button
                  className="text-red-400 font-medium"
                  onClick={() => onDelete(u.id)}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
