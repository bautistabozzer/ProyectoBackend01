import bcrypt from 'bcrypt';

/**
 * Crea un hash de la contraseña proporcionada
 * @param {string} password - Contraseña en texto plano
 * @returns {string} - Hash de la contraseña
 */
export const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

/**
 * Valida si la contraseña coincide con el hash almacenado
 * @param {string} password - Contraseña en texto plano a validar
 * @param {string} hashedPassword - Hash de la contraseña almacenada
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario
 */
export const isValidPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}; 