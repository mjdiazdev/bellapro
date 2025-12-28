import api from "./api";

/**
 * Rutas base del sistema.
 * Aquí defines todas las entidades del backend.
 */
export const BASE_API_ROUTES = {
  categories: "/categories",
  products: "/products",
  customers: "/customers",
  users: "/users",
  roles: "/roles",
  postalCodes: "/postal-codes",
  provinces: "/provinces",
  cities: "/cities",
  shippingMethods: "/shipping-methods",
  paymentMethods: "/payment-methods",
  orders: "/orders",
  orderItems: "/order-items",
};

/**
 * Obtiene la ruta correspondiente a un recurso
 */
const getRoute = (resource) => {
  const route = BASE_API_ROUTES[resource];
  if (!route) {
    throw new Error(`El recurso "${resource}" no existe en BASE_API_ROUTES`);
  }
  return route;
};

/**
 * ===== FUNCIONES CRUD GENÉRICAS =====
 */

// Listar todos
export const getAll = async (resource, params = {}) => {
  const route = getRoute(resource);
  const res = await api.get(route, { params });
  return res.data;
};

// Obtener por ID
export const getById = async (resource, id) => {
  const route = getRoute(resource);
  const res = await api.get(`${route}/${id}`);
  return res.data;
};

// Crear registro
export const createItem = async (resource, data) => {
  const route = getRoute(resource);
  const res = await api.post(route, data);
  return res.data;
};

// Actualizar registro
export const updateItem = async (resource, id, data) => {
  const route = getRoute(resource);
  const res = await api.put(`${route}/${id}`, data);
  return res.data;
};

// Eliminar
export const deleteItem = async (resource, id) => {
  const route = getRoute(resource);
  const res = await api.delete(`${route}/${id}`);
  return res.data;
};

// apiService.js
export const getAbsolute = (path, params = {}) =>
  api.get(path, { params }).then(r => r.data);

export const getQrData = async (code) => {
  const res = await api.get(`/qr/${code}`);
  return res.data;
};

/**
 * Cierra sesión del usuario autenticado
 */
export const logout = async () => {
  const res = await api.post("/logout");
  return res.data;
};
