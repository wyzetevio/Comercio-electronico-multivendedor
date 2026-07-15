import api from "../utils/api";

export const obtenerCupones = async () => {
    const { data } = await api.get("/cupones");
    return data;
};

export const obtenerCuponesActivos = async () => {
    const { data } = await api.get("/cupones/activos");
    return data;
};

export const crearCupon = async (cupon) => {
    const { data } = await api.post("/cupones", cupon);
    return data;
};

export const alternarEstadoCupon = async (idCupon) => {
    const { data } = await api.put(`/cupones/${idCupon}/toggle`);
    return data;
};

export const eliminarCupon = async (idCupon) => {
    await api.delete(`/cupones/${idCupon}`);
};

export const validarCupon = async (codigo) => {
    const { data } = await api.get(`/cupones/validar/${codigo}`);
    return data;
};
