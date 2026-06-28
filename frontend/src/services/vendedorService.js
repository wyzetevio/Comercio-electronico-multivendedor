import api from "../utils/api";

/**
 * Obtiene la lista de todos los vendedores.
 *
 * @returns {Promise<Array>} Lista de vendedores.
 */
export const obtenerVendedores = async () => {
  const { data } = await api.get("/vendedores");
  return data;
};

/**
 * Obtiene un vendedor por su ID.
 *
 * @param {number} idVendedor ID del vendedor.
 * @returns {Promise<Object>} Datos del vendedor.
 */
export const obtenerVendedor = async (idVendedor) => {
  const { data } = await api.get(`/vendedores/${idVendedor}`);
  return data;
};

/**
 * Verifica un vendedor.
 *
 * @param {number} idVendedor ID del vendedor.
 * @returns {Promise<Object>} Vendedor verificado.
 */
export const verificarVendedor = async (idVendedor) => {
  const { data } = await api.put(`/vendedores/${idVendedor}/verificar`);
  return data;
};

/**
 * Suspende un vendedor.
 *
 * @param {number} idVendedor ID del vendedor.
 * @returns {Promise<Object>} Vendedor suspendido.
 */
export const suspenderVendedor = async (idVendedor) => {
  const { data } = await api.put(`/vendedores/${idVendedor}/suspender`);
  return data;
};

/**
 * Activa nuevamente un vendedor.
 *
 * @param {number} idVendedor ID del vendedor.
 * @returns {Promise<Object>} Vendedor activado.
 */
export const activarVendedor = async (idVendedor) => {
  const { data } = await api.put(`/vendedores/${idVendedor}/activar`);
  return data;
};
