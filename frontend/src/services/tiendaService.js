import api from "../utils/api";

/**
 * Listar todas las tiendas
 */
export const listarTiendas = async () => {
  const response = await api.get("/tiendas");
  return response.data;
};

/**
 * Obtener una tienda por ID
 */
export const obtenerTienda = async (idTienda) => {
  const response = await api.get(`/tiendas/${idTienda}`);
  return response.data;
};

/**
 * Crear una tienda
 */
export const crearTienda = async (idUsuario, tienda) => {
  const response = await api.post("/tiendas", tienda, {
    params: {
      idUsuario,
    },
  });

  return response.data;
};

/**
 * Actualizar una tienda
 */
export const actualizarTienda = async (idTienda, tienda) => {
  const response = await api.put(`/tiendas/${idTienda}`, tienda);

  return response.data;
};

/**
 * Eliminar una tienda
 */
export const eliminarTienda = async (idTienda) => {
  await api.delete(`/tiendas/${idTienda}`);
};
