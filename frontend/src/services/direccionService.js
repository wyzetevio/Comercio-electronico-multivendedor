import api from "../utils/api";

export const listarDirecciones = async (usuarioId) => {
  const { data } = await api.get(`/direcciones/usuario/${usuarioId}`);
  return data;
};

export const guardarDireccion = async (direccionData, usuarioId) => {
  const { data } = await api.post(`/direcciones?usuarioId=${usuarioId}`, direccionData);
  return data;
};

export const eliminarDireccion = async (idDireccion) => {
  await api.delete(`/direcciones/${idDireccion}`);
};
