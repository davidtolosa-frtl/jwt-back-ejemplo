// Guarda los refresh tokens vigentes para poder revocarlos (logout).
// En producción esto se guardaría en Redis o en una base de datos.

const validRefreshTokens = new Set();

function add(token) {
  validRefreshTokens.add(token);
}

function isValid(token) {
  return validRefreshTokens.has(token);
}

function remove(token) {
  validRefreshTokens.delete(token);
}

module.exports = { add, isValid, remove };
