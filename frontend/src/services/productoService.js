import api from "../utils/api";

/**
 * Obtener todos los productos activos
 */
export const obtenerProductos = async () => {
  const response = await api.get("/productos");
  return response.data;
};

/**
 * Obtener un producto por ID
 */
export const obtenerProducto = async (idProducto) => {
  const response = await api.get(`/productos/${idProducto}`);
  return response.data;
};

/**
 * Obtener productos de una tienda
 */
export const obtenerProductosTienda = async (idTienda) => {
  const response = await api.get(`/productos/tienda/${idTienda}`);
  return response.data;
};

/**
 * Obtener productos por categoría
 */
export const obtenerProductosCategoria = async (idCategoria) => {
  const response = await api.get(`/productos/categoria/${idCategoria}`);
  return response.data;
};

/**
 * Obtener productos por nombre de categoría
 */
export const obtenerProductosPorNombreCategoria = async (nombre) => {
  const response = await api.get(`/productos/categoria/nombre/${nombre}`);
  return response.data;
};

/**
 * Buscar productos por nombre
 */
export const buscarProductos = async (nombre) => {
  const response = await api.get("/productos/buscar", {
    params: { nombre },
  });

  return response.data;
};

/**
 * Filtrar productos por rango de precio
 */
export const filtrarPorPrecio = async (min, max) => {
  const response = await api.get("/productos/precio", {
    params: { min, max },
  });

  return response.data;
};

/**
 * Crear producto
 */
export const crearProducto = async (idTienda, idCategoria, producto) => {
  const response = await api.post("/productos", producto, {
    params: {
      idTienda,
      idCategoria,
    },
  });

  return response.data;
};

/**
 * Actualizar producto
 */
export const actualizarProducto = async (idProducto, producto) => {
  const response = await api.put(`/productos/${idProducto}`, producto);

  return response.data;
};

/**
 * Actualizar stock
 */
export const actualizarStock = async (idProducto, stock) => {
  const response = await api.put(`/productos/${idProducto}/stock`, null, {
    params: { stock },
  });

  return response.data;
};

/**
 * Activar producto
 */
export const activarProducto = async (idProducto) => {
  const response = await api.put(`/productos/${idProducto}/activar`);

  return response.data;
};

/**
 * Desactivar producto
 */
export const desactivarProducto = async (idProducto) => {
  const response = await api.put(`/productos/${idProducto}/desactivar`);

  return response.data;
};

/**
 * Eliminar producto
 */
export const eliminarProducto = async (idProducto) => {
  await api.delete(`/productos/${idProducto}`);
};
