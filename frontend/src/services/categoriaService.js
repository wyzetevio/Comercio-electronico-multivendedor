import api from "../utils/api";

/**
 * Obtiene todas las categorías.
 *
 * @returns {Promise<Array>}
 */
export const obtenerCategorias = async () => {
  const { data } = await api.get("/categorias");
  return data;
};

/**
 * Obtiene una categoría por su ID.
 *
 * @param {number} idCategoria
 * @returns {Promise<Object>}
 */
export const obtenerCategoria = async (idCategoria) => {
  const { data } = await api.get(`/categorias/${idCategoria}`);
  return data;
};

/**
 * Crea una nueva categoría.
 *
 * @param {Object} categoria
 * @returns {Promise<Object>}
 */
export const crearCategoria = async (categoria) => {
  const { data } = await api.post("/categorias", categoria);
  return data;
};

/**
 * Actualiza una categoría.
 *
 * @param {number} idCategoria
 * @param {Object} categoria
 * @returns {Promise<Object>}
 */
export const actualizarCategoria = async (idCategoria, categoria) => {
  const { data } = await api.put(`/categorias/${idCategoria}`, categoria);
  return data;
};

/**
 * Desactiva una categoría.
 *
 * @param {number} idCategoria
 * @returns {Promise<Object>}
 */
export const desactivarCategoria = async (idCategoria) => {
  const { data } = await api.put(`/categorias/${idCategoria}/desactivar`);
  return data;
};
