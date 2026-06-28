import api from "../utils/api";

/**
 * Inicia sesión de un usuario.
 *
 * @param {Object} credenciales
 * @param {string} credenciales.email
 * @param {string} credenciales.password
 * @returns {Promise<Object>}
 */
export const login = async (credenciales) => {
  const { data } = await api.post("/auth/login", credenciales);
  return data;
};

/**
 * Cierra la sesión del usuario.
 *
 * No realiza una petición al backend porque el JWT es Stateless.
 * La limpieza del localStorage la realiza AuthContext.
 */
export const logout = () => {
  return true;
};
