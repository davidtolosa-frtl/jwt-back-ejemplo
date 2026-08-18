const { Router } = require("express");
const authenticateToken = require("../middleware/authenticateToken");

const router = Router();

// Ruta protegida: requiere un access token válido en el header Authorization
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Acceso concedido a ruta protegida",
    user: req.user,
  });
});

module.exports = router;
