import api from "../utils/api";

/**
 * Registra un pago para una orden.
 *
 * @param {number} idOrden ID de la orden.
 * @param {string} metodoPago Método de pago.
 * @returns {Promise<Object>} Pago registrado.
 */
export const registrarPago = async (idOrden, metodoPago) => {
  const { data } = await api.post("/pagos", null, {
    params: {
      idOrden,
      metodoPago,
    },
  });

  return data;
};

/**
 * Obtiene un pago por su ID.
 *
 * @param {number} idPago ID del pago.
 * @returns {Promise<Object>} Pago encontrado.
 */
export const obtenerPago = async (idPago) => {
  const { data } = await api.get(`/pagos/${idPago}`);
  return data;
};

/**
 * Obtiene todos los pagos asociados a una orden.
 *
 * @param {number} idOrden ID de la orden.
 * @returns {Promise<Array>} Lista de pagos.
 */
export const obtenerPagosOrden = async (idOrden) => {
  const { data } = await api.get(`/pagos/orden/${idOrden}`);
  return data;
};

/**
 * Aprueba un pago.
 *
 * @param {number} idPago ID del pago.
 * @returns {Promise<Object>} Pago actualizado.
 */
export const aprobarPago = async (idPago) => {
  const { data } = await api.put(`/pagos/${idPago}/aprobar`);
  return data;
};

/**
 * Rechaza un pago.
 *
 * @param {number} idPago ID del pago.
 * @returns {Promise<Object>} Pago actualizado.
 */
export const rechazarPago = async (idPago) => {
  const { data } = await api.put(`/pagos/${idPago}/rechazar`);
  return data;
};

/**
 * Reembolsa un pago.
 *
 * @param {number} idPago ID del pago.
 * @returns {Promise<Object>} Pago actualizado.
 */
export const reembolsarPago = async (idPago) => {
  const { data } = await api.put(`/pagos/${idPago}/reembolsar`);
  return data;
};
