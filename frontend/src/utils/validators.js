/**
 * Valida que un campo no esté vacío.
 *
 * @param {string} valor
 * @returns {boolean}
 */
export const esRequerido = (valor) => {
  return valor !== null && valor !== undefined && String(valor).trim() !== "";
};

/**
 * Valida un correo electrónico.
 *
 * @param {string} email
 * @returns {boolean}
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida una contraseña.
 * Debe tener al menos 8 caracteres.
 *
 * @param {string} password
 * @returns {boolean}
 */
export const validarPassword = (password) => {
  return password.length >= 8;
};

/**
 * Valida un número telefónico.
 * Acepta únicamente 9 dígitos.
 *
 * @param {string} telefono
 * @returns {boolean}
 */
export const validarTelefono = (telefono) => {
  return /^[0-9]{9}$/.test(telefono);
};

/**
 * Valida un precio.
 *
 * @param {number|string} precio
 * @returns {boolean}
 */
export const validarPrecio = (precio) => {
  return !isNaN(precio) && Number(precio) > 0;
};

/**
 * Valida el stock.
 *
 * @param {number|string} stock
 * @returns {boolean}
 */
export const validarStock = (stock) => {
  return Number.isInteger(Number(stock)) && Number(stock) >= 0;
};

/**
 * Valida un nombre.
 *
 * @param {string} nombre
 * @returns {boolean}
 */
export const validarNombre = (nombre) => {
  return nombre.trim().length >= 3;
};

/**
 * Valida una descripción.
 *
 * @param {string} descripcion
 * @returns {boolean}
 */
export const validarDescripcion = (descripcion) => {
  return descripcion.trim().length >= 10;
};

/**
 * Valida una URL.
 *
 * @param {string} url
 * @returns {boolean}
 */
export const validarURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Compara dos contraseñas.
 *
 * @param {string} password
 * @param {string} confirmarPassword
 * @returns {boolean}
 */
export const confirmarPassword = (password, confirmarPassword) => {
  return password === confirmarPassword;
};
