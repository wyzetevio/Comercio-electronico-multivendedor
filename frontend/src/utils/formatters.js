/**
 * Formatea un precio en soles peruanos.
 *
 * @param {number} precio
 * @returns {string}
 */
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(precio);
};

/**
 * Formatea una fecha al formato dd/mm/yyyy.
 *
 * @param {string|Date} fecha
 * @returns {string}
 */
export const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-PE");
};

/**
 * Formatea fecha y hora.
 *
 * @param {string|Date} fecha
 * @returns {string}
 */
export const formatearFechaHora = (fecha) => {
  return new Date(fecha).toLocaleString("es-PE");
};

/**
 * Convierte la primera letra de un texto a mayúscula.
 *
 * @param {string} texto
 * @returns {string}
 */
export const capitalizarTexto = (texto) => {
  if (!texto) return "";

  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Convierte un texto a formato título.
 *
 * Ejemplo:
 * "laptop gamer asus" -> "Laptop Gamer Asus"
 *
 * @param {string} texto
 * @returns {string}
 */
export const capitalizarCadaPalabra = (texto) => {
  if (!texto) return "";

  return texto
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(),
    )
    .join(" ");
};

/**
 * Acorta un texto largo agregando "...".
 *
 * @param {string} texto
 * @param {number} longitud
 * @returns {string}
 */
export const acortarTexto = (texto, longitud = 100) => {
  if (!texto) return "";

  return texto.length > longitud ? `${texto.substring(0, longitud)}...` : texto;
};

/**
 * Formatea un número con separador de miles.
 *
 * @param {number} numero
 * @returns {string}
 */
export const formatearNumero = (numero) => {
  return new Intl.NumberFormat("es-PE").format(numero);
};

/**
 * Convierte un estado a un texto legible.
 *
 * Ejemplo:
 * "PENDIENTE_PAGO" -> "Pendiente Pago"
 *
 * @param {string} estado
 * @returns {string}
 */
export const formatearEstado = (estado) => {
  if (!estado) return "";

  return estado
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
};

/**
 * Obtiene las iniciales de un nombre.
 *
 * Ejemplo:
 * "Juan Pérez Gómez" -> "JPG"
 *
 * @param {string} nombre
 * @returns {string}
 */
export const obtenerIniciales = (nombre) => {
  if (!nombre) return "";

  return nombre
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
};
