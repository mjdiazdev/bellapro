import { useState, useEffect } from "react";
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, X, ChevronDown, ChevronUp } from "lucide-react";
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ConfirmModal from "../../../components/common/ConfirmModal";
import AlertModal from "../../../components/common/AlertModal";
import api from "../../../services/api";

const EMPTY_FORM = {
  code: "", type: "percentage", value: "", scope: "all",
  product_ids: [], min_order_amount: "", max_uses: "", expires_at: "", active: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons]     = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [toDelete, setToDelete]   = useState(null);
  const [alert, setAlert]         = useState({ open: false, type: "error", message: "" });

  const showAlert = (message, type = "error") => setAlert({ open: true, type, message });
  const closeAlert = () => setAlert(prev => ({ ...prev, open: false }));

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/coupons");
      setCoupons(res.data.coupons ?? []);
    } catch {
      showAlert("Error al cargar los cupones.");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data ?? res.data.products ?? []);
    } catch {
      // no bloquea la página
    }
  };

  useEffect(() => {
    loadCoupons();
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (coupon) => {
    setEditId(coupon.id);
    setForm({
      code:             coupon.code,
      type:             coupon.type,
      value:            coupon.value,
      scope:            coupon.scope,
      product_ids:      coupon.product_ids ?? [],
      min_order_amount: coupon.min_order_amount ?? "",
      max_uses:         coupon.max_uses ?? "",
      expires_at:       coupon.expires_at ? coupon.expires_at.substring(0, 10) : "",
      active:           coupon.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) {
      return showAlert("El código y el valor son obligatorios.", "warning");
    }
    if (form.scope === "products" && form.product_ids.length === 0) {
      return showAlert("Selecciona al menos un producto para este cupón.", "warning");
    }

    const payload = {
      ...form,
      value:            Number(form.value),
      min_order_amount: form.min_order_amount !== "" ? Number(form.min_order_amount) : null,
      max_uses:         form.max_uses !== "" ? Number(form.max_uses) : null,
      expires_at:       form.expires_at || null,
      product_ids:      form.scope === "products" ? form.product_ids : [],
    };

    try {
      setSaving(true);
      if (editId) {
        await api.put(`/coupons/${editId}`, payload);
        showAlert("Cupón actualizado correctamente.", "success");
      } else {
        await api.post("/coupons", payload);
        showAlert("Cupón creado correctamente.", "success");
      }
      setShowForm(false);
      await loadCoupons();
    } catch (err) {
      showAlert(err.response?.data?.message || "Error al guardar el cupón.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await api.post(`/coupons/${coupon.id}/toggle`);
      await loadCoupons();
    } catch {
      showAlert("Error al cambiar el estado.");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/coupons/${toDelete.id}`);
      setToDelete(null);
      await loadCoupons();
    } catch {
      showAlert("Error al eliminar el cupón.");
    }
  };

  const toggleProduct = (id) => {
    setForm(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(id)
        ? prev.product_ids.filter(pid => pid !== id)
        : [...prev.product_ids, id],
    }));
  };

  const typeLabel  = (type, value) => type === "percentage" ? `${value}%` : `€${Number(value).toFixed(2)}`;
  const scopeLabel = (scope) => scope === "all" ? "Todo el carrito" : "Productos concretos";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 p-6 pt-20">
          <div className="space-y-6">

            {/* Cabecera */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-pink-400" />
                Cupones de descuento
              </h1>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-pink-600 transition"
              >
                <Plus className="w-4 h-4" /> Nuevo cupón
              </button>
            </div>

            {/* Formulario */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-800">
                    {editId ? "Editar cupón" : "Crear nuevo cupón"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Código <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        placeholder="VERANO25"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Tipo <span className="text-red-400">*</span></label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                      >
                        <option value="percentage">Porcentaje (%)</option>
                        <option value="fixed">Importe fijo (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        Valor <span className="text-red-400">*</span>
                        <span className="text-gray-400 ml-1">{form.type === "percentage" ? "(%)" : "(€)"}</span>
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.value}
                        onChange={(e) => setForm({ ...form, value: e.target.value })}
                        placeholder={form.type === "percentage" ? "10" : "5.00"}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Aplica a</label>
                      <select
                        value={form.scope}
                        onChange={(e) => setForm({ ...form, scope: e.target.value, product_ids: [] })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                      >
                        <option value="all">Todo el carrito</option>
                        <option value="products">Productos concretos</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Ticket mínimo (€)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.min_order_amount}
                        onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                        placeholder="0.00 (sin mínimo)"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Usos máximos</label>
                      <input
                        type="number"
                        min="1"
                        value={form.max_uses}
                        onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                        placeholder="Ilimitado"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Fecha de expiración</label>
                      <input
                        type="date"
                        value={form.expires_at}
                        onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.active}
                          onChange={(e) => setForm({ ...form, active: e.target.checked })}
                          className="w-4 h-4 accent-pink-500"
                        />
                        Activo al crear
                      </label>
                    </div>
                  </div>

                  {/* Selector de productos */}
                  {form.scope === "products" && (
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">
                        Productos <span className="text-red-400">*</span>
                        <span className="text-gray-400 ml-1">({form.product_ids.length} seleccionados)</span>
                      </label>
                      <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1">
                        {products.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-2">Cargando productos...</p>
                        ) : (
                          products.map(product => (
                            <label key={product.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg">
                              <input
                                type="checkbox"
                                checked={form.product_ids.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                                className="accent-pink-500"
                              />
                              <span className="text-gray-700">{product.name}</span>
                              <span className="text-gray-400 ml-auto">€{Number(product.price).toFixed(2)}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 transition">
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-pink-500 text-white text-sm font-medium rounded-full hover:bg-pink-600 disabled:opacity-50 transition"
                    >
                      {saving ? "Guardando..." : editId ? "Guardar cambios" : "Crear cupón"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">
                  Cupones <span className="text-xs font-normal text-gray-400 ml-1">({coupons.length})</span>
                </h2>
              </div>

              {loading ? (
                <p className="text-center text-gray-400 py-10 text-sm animate-pulse">Cargando...</p>
              ) : coupons.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">No hay cupones. Crea el primero arriba.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-pink-500 text-white text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Código</th>
                      <th className="px-6 py-3 text-left">Descuento</th>
                      <th className="px-6 py-3 text-left hidden md:table-cell">Aplica a</th>
                      <th className="px-6 py-3 text-center hidden sm:table-cell">Usos</th>
                      <th className="px-6 py-3 text-center">Estado</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {coupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-mono font-semibold text-gray-800">{coupon.code}</td>
                        <td className="px-6 py-4 text-pink-600 font-medium">{typeLabel(coupon.type, coupon.value)}</td>
                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{scopeLabel(coupon.scope)}</td>
                        <td className="px-6 py-4 text-center text-gray-500 hidden sm:table-cell">
                          {coupon.uses_count}{coupon.max_uses ? `/${coupon.max_uses}` : ""}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggle(coupon)}
                            title={coupon.active ? "Desactivar" : "Activar"}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                              coupon.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            {coupon.active
                              ? <><ToggleRight className="w-3.5 h-3.5" /> Activo</>
                              : <><ToggleLeft className="w-3.5 h-3.5" /> Inactivo</>
                            }
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(coupon)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              title="Editar"
                            >
                              <Tag className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setToDelete(coupon)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar"
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

      <AlertModal open={alert.open} type={alert.type} message={alert.message} onClose={closeAlert} />
      <ConfirmModal
        open={!!toDelete}
        message={`¿Eliminar el cupón "${toDelete?.code}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
