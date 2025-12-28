import { useState } from "react";

export default function CustomersList({ customers, onEdit, onDelete }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="p-6 rounded-lg">
      <table className="w-full text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-50">
          <tr>
            <th className="p-3">NIF</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Email</th>
            <th className="p-3">Acciones</th>

          </tr>
        </thead>
        <tbody>
          {customers.map(p => (
            <tr key={p.id} className="border-b border-border">
              <td className="p-3">{p.nif}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.phone}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3 flex gap-3">
                <button className="text-pink font-medium" onClick={() => onEdit(p.id)}>Editar</button>
                <button className="text-red-400 font-medium" onClick={() => onDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
