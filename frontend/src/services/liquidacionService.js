import api from "../utils/api";

/**
 * Crea una nueva liquidación para un vendedor.
 *
 * @param {number} idVendedor ID del vendedor.
 * @param {Array<number>} idsSubordenes Lista de IDs de las subórdenes.
 * @returns {Promise<Object>} Liquidación creada.
 */
export const crearLiquidacion = async (idVendedor, idsSubordenes) => {
  const { data } = await api.post("/liquidaciones", idsSubordenes, {
    params: {
      idVendedor,
    },
  });

  return data;
};

/**
 * Obtiene una liquidación por su ID.
 *
 * @param {number} idLiquidacion ID de la liquidación.
 * @returns {Promise<Object>} Liquidación encontrada.
 */
export const obtenerLiquidacion = async (idLiquidacion) => {
  const { data } = await api.get(`/liquidaciones/${idLiquidacion}`);
  return data;
};

/**
 * Obtiene todas las liquidaciones de un vendedor.
 *
 * @param {number} idVendedor ID del vendedor.
 * @returns {Promise<Array>} Lista de liquidaciones.
 */
export const obtenerLiquidacionesVendedor = async (idVendedor) => {
  const { data } = await api.get(`/liquidaciones/vendedor/${idVendedor}`);
  return data;
};

/**
 * Marca una liquidación como pagada.
 *
 * @param {number} idLiquidacion ID de la liquidación.
 * @returns {Promise<Object>} Liquidación actualizada.
 */
export const marcarLiquidacionPagada = async (idLiquidacion) => {
  const { data } = await api.put(`/liquidaciones/${idLiquidacion}/pagar`);
  return data;
};

/**
 * Rechaza una liquidación.
 *
 * @param {number} idLiquidacion ID de la liquidación.
 * @returns {Promise<Object>} Liquidación actualizada.
 */
export const rechazarLiquidacion = async (idLiquidacion) => {
  const { data } = await api.put(`/liquidaciones/${idLiquidacion}/rechazar`);
  return data;
};
