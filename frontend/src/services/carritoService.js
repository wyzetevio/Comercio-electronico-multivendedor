import api from "../utils/api";

/**
 * Obtiene todos los carritos.
 *
 * @returns {Promise<Array>} Lista de carritos.
 */
export const obtenerCarritos = async () => {
  const { data } = await api.get("/carritos");
  return data;
};

/**
 * Obtiene un carrito por su ID.
 *
 * @param {number} idCarrito ID del carrito.
 * @returns {Promise<Object>} Carrito.
 */
export const obtenerCarrito = async (idCarrito) => {
  const { data } = await api.get(`/carritos/${idCarrito}`);
  return data;
};

/**
 * Crea un nuevo carrito.
 *
 * @param {Object} carrito Datos del carrito.
 * @returns {Promise<Object>} Carrito creado.
 */
export const crearCarrito = async (carrito) => {
  const { data } = await api.post("/carritos", carrito);
  return data;
};

/**
 * Actualiza un carrito.
 *
 * @param {number} idCarrito ID del carrito.
 * @param {Object} carrito Datos actualizados.
 * @returns {Promise<Object>} Carrito actualizado.
 */
export const actualizarCarrito = async (idCarrito, carrito) => {
  const { data } = await api.put(`/carritos/${idCarrito}`, carrito);
  return data;
};

/**
 * Elimina un carrito.
 *
 * @param {number} idCarrito ID del carrito.
 * @returns {Promise<void>}
 */
export const eliminarCarrito = async (idCarrito) => {
  await api.delete(`/carritos/${idCarrito}`);
};

/**
 * Obtiene el carrito de un usuario.
 *
 * @param {number} idUsuario ID del usuario.
 * @returns {Promise<Object>} Carrito del usuario.
 */
export const obtenerCarritoUsuario = async (idUsuario) => {
  const { data } = await api.get(`/carritos/usuario/${idUsuario}`);
  return data;
};

/**
 * Agrega un producto al carrito.
 *
 * @param {number} idUsuario ID del usuario.
 * @param {number} idProducto ID del producto.
 * @param {number} cantidad Cantidad a agregar.
 * @returns {Promise<Object>} Carrito actualizado.
 */
export const agregarProductoAlCarrito = async (
  idUsuario,
  idProducto,
  cantidad,
) => {
  const { data } = await api.post("/carritos/agregar", null, {
    params: {
      usuarioId: idUsuario,
      productoId: idProducto,
      cantidad,
    },
  });

  return data;
};

/**
 * Actualiza la cantidad de un producto del carrito.
 *
 * @param {number} idCarritoItem ID del item del carrito.
 * @param {number} cantidad Nueva cantidad.
 * @returns {Promise<Object>} Item actualizado.
 */
export const actualizarCantidadItem = async (idCarritoItem, cantidad) => {
  const { data } = await api.put(`/carritos/item/${idCarritoItem}`, null, {
    params: {
      cantidad,
    },
  });

  return data;
};

/**
 * Elimina un producto del carrito.
 *
 * @param {number} idCarritoItem ID del item del carrito.
 * @returns {Promise<void>}
 */
export const eliminarItemCarrito = async (idCarritoItem) => {
  await api.delete(`/carritos/item/${idCarritoItem}`);
};

/**
 * Vacía completamente un carrito.
 *
 * @param {number} idCarrito ID del carrito.
 * @returns {Promise<void>}
 */
export const vaciarCarrito = async (idCarrito) => {
  await api.delete(`/carritos/${idCarrito}/vaciar`);
};

/**
 * Calcula el total del carrito.
 *
 * @param {number} idCarrito ID del carrito.
 * @returns {Promise<number>} Total del carrito.
 */
export const calcularTotalCarrito = async (idCarrito) => {
  const { data } = await api.get(`/carritos/${idCarrito}/total`);
  return data;
};
