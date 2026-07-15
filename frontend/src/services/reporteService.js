import api from "../utils/api";

export const obtenerEstadisticasAdmin = async () => {
  const { data } = await api.get("/reportes/stats");
  return data;
};
