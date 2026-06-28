import api from "../utils/api";

/**
 * Crea un nuevo envío para una suborden.
 *
 * @param {number} idSuborden ID de la suborden.
 * @param {string} empresaEnvio Empresa encargada del envío.
 * @param {number} costoEnvio Costo del envío.
 * @returns {Promise<Object>} Envío creado.
 */
export const crearEnvio = async (idSuborden, empresaEnvio, costoEnvio) => {
  const { data } = await api.post("/envios", null, {
    params: {
      idSuborden,
      empresaEnvio,
      costoEnvio,
    },
  });

  return data;
};

/**
 * Obtiene un envío por su ID.
 *
 * @param {number} idEnvio ID del envío.
 * @returns {Promise<Object>} Envío encontrado.
 */
export const obtenerEnvio = async (idEnvio) => {
  const { data } = await api.get(`/envios/${idEnvio}`);
  return data;
};

/**
 * Obtiene el envío asociado a una suborden.
 *
 * @param {number} idSuborden ID de la suborden.
 * @returns {Promise<Object>} Envío de la suborden.
 */
export const obtenerEnvioSuborden = async (idSuborden) => {
  const { data } = await api.get(`/envios/suborden/${idSuborden}`);
  return data;
};

/**
 * Marca un envío como "En tránsito".
 *
 * @param {number} idEnvio ID del envío.
 * @param {string} codigoTracking Código de seguimiento.
 * @returns {Promise<Object>} Envío actualizado.
 */
export const marcarEnvioEnTransito = async (idEnvio, codigoTracking) => {
  const { data } = await api.put(`/envios/${idEnvio}/transito`, null, {
    params: {
      codigoTracking,
    },
  });

  return data;
};

/**
 * Marca un envío como entregado.
 *
 * @param {number} idEnvio ID del envío.
 * @returns {Promise<Object>} Envío actualizado.
 */
export const marcarEnvioEntregado = async (idEnvio) => {
  const { data } = await api.put(`/envios/${idEnvio}/entregar`);
  return data;
};

/**
 * Marca un envío como devuelto.
 *
 * @param {number} idEnvio ID del envío.
 * @returns {Promise<Object>} Envío actualizado.
 */
export const devolverEnvio = async (idEnvio) => {
  const { data } = await api.put(`/envios/${idEnvio}/devolver`);
  return data;
};
