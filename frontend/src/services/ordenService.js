import api from "../utils/api";

/**
 * Crea una nueva orden.
 *
 * @param {Object} orden Datos de la orden.
 * @returns {Promise<Object>} Orden creada.
 */
export const crearOrden = async (orden) => {
  const { data } = await api.post("/ordenes", orden);
  return data;
};

/**
 * Genera una orden a partir del carrito del usuario (Checkout).
 *
 * @param {number} idUsuario ID del usuario.
 * @param {number} idDireccion ID de la dirección de envío.
 * @returns {Promise<Object>} Orden creada.
 */
export const realizarCheckout = async (idUsuario, idDireccion) => {
  const { data } = await api.post("/ordenes/checkout", null, {
    params: {
      usuarioId: idUsuario,
      direccionId: idDireccion,
    },
  });

  return data;
};

/**
 * Obtiene una orden por su ID.
 *
 * @param {number} idOrden ID de la orden.
 * @returns {Promise<Object>} Orden encontrada.
 */
export const obtenerOrden = async (idOrden) => {
  const { data } = await api.get(`/ordenes/${idOrden}`);
  return data;
};

/**
 * Obtiene todas las órdenes de un usuario.
 *
 * @param {number} idUsuario ID del usuario.
 * @returns {Promise<Array>} Lista de órdenes.
 */
export const obtenerOrdenesUsuario = async (idUsuario) => {
  const { data } = await api.get(`/ordenes/usuario/${idUsuario}`);
  return data;
};

/**
 * Obtiene las subórdenes de una orden.
 *
 * @param {number} idOrden ID de la orden.
 * @returns {Promise<Array>} Lista de subórdenes.
 */
export const obtenerSubordenes = async (idOrden) => {
  const { data } = await api.get(`/ordenes/${idOrden}/subordenes`);
  return data;
};

/**
 * Marca una orden como pagada.
 *
 * @param {number} idOrden ID de la orden.
 * @returns {Promise<Object>} Orden actualizada.
 */
export const marcarOrdenPagada = async (idOrden) => {
  const { data } = await api.put(`/ordenes/${idOrden}/pagar`);
  return data;
};

/**
 * Cancela una orden.
 *
 * @param {number} idOrden ID de la orden.
 * @returns {Promise<Object>} Orden cancelada.
 */
export const cancelarOrden = async (idOrden) => {
  const { data } = await api.put(`/ordenes/${idOrden}/cancelar`);
  return data;
};

/**
 * Marca una orden como completada.
 *
 * @param {number} idOrden ID de la orden.
 * @returns {Promise<Object>} Orden completada.
 */
export const completarOrden = async (idOrden) => {
  const { data } = await api.put(`/ordenes/${idOrden}/completar`);
  return data;
};
