const { Router } = require("express");
const bcrypt = require("bcryptjs");
const usersStore = require("../db/usersStore");
const refreshTokenStore = require("../db/refreshTokenStore");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username y password son requeridos" });
  }

  if (usersStore.findByUsername(username)) {
    return res.status(409).json({ error: "El usuario ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = usersStore.createUser({ username, passwordHash });

  res.status(201).json({ id: user.id, username: user.username });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username y password son requeridos" });
  }

  const user = usersStore.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokenStore.add(refreshToken);

  res.json({ accessToken, refreshToken });
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token no provisto" });
  }

  if (!refreshTokenStore.isValid(refreshToken)) {
    return res.status(403).json({ error: "Refresh token inválido o revocado" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = usersStore.findById(payload.sub);
    if (!user) {
      return res.status(403).json({ error: "Usuario no encontrado" });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    refreshTokenStore.remove(refreshToken);
    return res.status(403).json({ error: "Refresh token inválido o expirado" });
  }
});

router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    refreshTokenStore.remove(refreshToken);
  }

  res.status(204).send();
});

module.exports = router;
