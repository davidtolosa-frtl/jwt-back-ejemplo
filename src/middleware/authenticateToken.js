const { verifyAccessToken } = require("../utils/tokens");

// Espera el header: Authorization: Bearer <token>
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de acceso no provisto" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = authenticateToken;
