import { useEffect, useState } from "react";

export default function UsersCreateEdit({ open, data, onClose, onSaved }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: 1,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        email: data.email,
        password: "",
        role: data.role,
      });
    } else {
      setForm({ name: "", email: "", password: "", role: 1 });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSaved(form);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal card p-4 w-96">

        <h3 className="text-lg font-bold mb-3">
          {data ? "Editar Usuario" : "Nuevo Usuario"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            value={form.name}
            placeholder="Nombre"
            className="form-control"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            value={form.email}
            placeholder="Email"
            className="form-control"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            value={form.password}
            placeholder={data ? "Nuevo password (opcional)" : "Password"}
            className="form-control"
            type="password"
            onChange={handleChange}
            required={!data}
          />

          <select
            name="role"
            value={form.role}
            className="form-control"
            onChange={handleChange}
          >
            <option value={1}>Administrador</option>
            <option value={2}>Usuario</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
