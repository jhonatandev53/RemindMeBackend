import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Verificamos si los headers traen el token bajo el estándar "Bearer TOKEN..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraemos solo el token (quitando la palabra "Bearer")
      token = req.headers.authorization.split(' ')[1];

      // Decodificamos el token usando nuestra clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario en la BD por el ID que venía dentro del token (excluyendo el password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ mensaje: "No autorizado, usuario no encontrado" });
      }

      next(); // ¡Todo bien! Dejamos continuar la petición hacia el controlador
    } catch (error) {
      console.error(error);
      return res.status(401).json({ mensaje: "No autorizado, token fallido o expirado" });
    }
  }

  if (!token) {
    return res.status(401).json({ mensaje: "No autorizado, no se encontró ningún token" });
  }
};