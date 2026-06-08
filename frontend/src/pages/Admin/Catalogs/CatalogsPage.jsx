import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Download, FileText, Eye, EyeOff } from "lucide-react";
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ConfirmModal from "../../../components/common/ConfirmModal";
import AlertModal from "../../../components/common/AlertModal";
import api from "../../../services/api";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CatalogsPage() {
  const [catalogs, setCatalogs]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete]   = useState(null);
  const [alert, setAlert]         = useState({ open: false, type: "error", message: "" });

  const [form, setForm] = useState({ name: "", description: "", active: true });
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const showAlert = (message, type = "error") => setAlert({ open: true, type, message });
  const closeAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ── Cargar catálogos ────────────────────────────────────────────────
  const loadCatalogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/catalogs/all");
      setCatalogs(res.data.catalogs ?? []);
    } catch {
      showAlert("Error al cargar los catálogos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCatalogs(); }, []);

  // ── Subir nuevo catálogo ────────────────────────────────────────────
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showAlert("El nombre del catálogo es obligatorio.", "warning");
    if (!file) return showAlert("Selecciona un archivo PDF para subir.", "warning");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("active", form.active ? "1" : "0");
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/catalogs", formData);
      setForm({ name: "", description: "", active: true });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      showAlert("Catálogo subido correctamente.", "success");
      await loadCatalogs();
    } catch (err) {
      showAlert(err.response?.data?.message || "Error al subir el catálogo.");
    } finally {
      setUploading(false);
    }
  };

  // ── Toggle activo / inactivo ────────────────────────────────────────
  const handleToggleActive = async (catalog) => {
    try {
      await api.post(`/catalogs/${catalog.id}`, {
        name:   catalog.name,
        active: !catalog.active,
      });
      await loadCatalogs();
    } catch {
      showAlert("Error al actualizar el catálogo. Inténtalo de nuevo.");
    }
  };

  // ── Eliminar catálogo ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/catalogs/${toDelete.id}`);
      setToDelete(null);
      await loadCatalogs();
    } catch {
      showAlert("Error al eliminar el catálogo. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header />

        <main className="flex-1 p-6 pt-20">
          <div className="space-y-8">

            {/* ── Formulario de subida ──────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <Upload className="w-5 h-5 text-pink-400" />
                Subir nuevo catálogo
              </h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Nombre <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ej: Catálogo Primavera 2026"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Descripción (opcional)
                    </label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Breve descripción del catálogo"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">
                      Archivo PDF <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0] ?? null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-600 mt-4 sm:mt-6 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 accent-pink-500"
                    />
                    Publicar al subir
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center gap-2 bg-pink-500 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Subiendo..." : "Subir catálogo"}
                  </button>
                </div>
              </form>
            </div>

            {/* ── Listado de catálogos ──────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Catálogos
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    ({catalogs.length})
                  </span>
                </h2>
              </div>

              {loading ? (
                <p className="text-center text-gray-400 py-10 text-sm animate-pulse">
                  Cargando...
                </p>
              ) : catalogs.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">
                  No hay catálogos. Sube el primero arriba.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Nombre</th>
                      <th className="px-6 py-3 text-left hidden sm:table-cell">Descripción</th>
                      <th className="px-6 py-3 text-center">Estado</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {catalogs.map((catalog) => (
                      <tr key={catalog.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {catalog.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                          {catalog.description || "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleActive(catalog)}
                            title={catalog.active ? "Desactivar" : "Activar"}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                              catalog.active
                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            {catalog.active ? (
                              <><Eye className="w-3 h-3" /> Activo</>
                            ) : (
                              <><EyeOff className="w-3 h-3" /> Inactivo</>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`${BACKEND_URL}/api/catalogs/${catalog.id}/download`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                              title="Descargar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => setToDelete(catalog)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar catálogo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </main>

        <Footer />
      </div>

      <AlertModal
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />

      {/* Modal de confirmación de borrado */}
      <ConfirmModal
        open={!!toDelete}
        message={`¿Estás seguro de que quieres eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
