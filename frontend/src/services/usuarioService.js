import api from "../utils/api";

/**
 * Registra un nuevo cliente.
 *
 * @param {Object} usuario Datos del usuario.
 * @returns {Promise<Object>} Usuario registrado.
 */
export const registrarCliente = async (usuario) => {
  const { data } = await api.post("/usuarios/registro", usuario);
  return data;
};

/**
 * Obtiene la información de un usuario por su ID.
 *
 * @param {number} idUsuario ID del usuario.
 * @returns {Promise<Object>} Datos del usuario.
 */
export const obtenerUsuario = async (idUsuario) => {
  const { data } = await api.get(`/usuarios/${idUsuario}`);
  return data;
};

/**
 * Actualiza la información de un usuario.
 *
 * @param {number} idUsuario ID del usuario.
 * @param {Object} usuario Nuevos datos del usuario.
 * @returns {Promise<Object>} Usuario actualizado.
 */
export const actualizarUsuario = async (idUsuario, usuario) => {
  const { data } = await api.put(`/usuarios/${idUsuario}`, usuario);
  return data;
};

/**
 * Desactiva la cuenta de un usuario.
 *
 * @param {number} idUsuario ID del usuario.
 * @returns {Promise<Object>} Usuario desactivado.
 */
export const desactivarUsuario = async (idUsuario) => {
  const { data } = await api.put(`/usuarios/${idUsuario}/desactivar`);
  return data;
};

/**
 * Convierte un usuario registrado en vendedor.
 *
 * @param {number} idUsuario ID del usuario.
 * @returns {Promise<Object>} Vendedor creado.
 */
export const convertirEnVendedor = async (idUsuario) => {
  const { data } = await api.post(`/usuarios/${idUsuario}/vendedor`);
  return data;
};
export const obtenerClientes = async () => {
  const { data } = await api.get("/usuarios/clientes");
  return data;
};
export const cambiarEstadoCuenta = async (idUsuario) => {
  const { data } = await api.put(`/usuarios/${idUsuario}/toggle-estado`);
  return data;
};
