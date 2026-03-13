// ============================================================
// auth.js - Middleware de autenticación centralizado
// Antes la contraseña estaba repetida en cada módulo.
// Ahora se define una sola vez aquí y se importa donde se necesite.
// Si en algún momento cambia la contraseña, solo se modifica este archivo.
// ============================================================

const CONTRASENA = "sena2025";

const verificarContrasena = (req, res, next) => {
  const password = req.headers['password'];
  if (!password || password !== CONTRASENA) {
    return res.status(401).json({ error: "Incorrect password, or password not sent" });
  }
  next();
};

module.exports = verificarContrasena;