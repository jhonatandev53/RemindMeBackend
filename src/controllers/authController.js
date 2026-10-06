import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/* INICIAR SESIÓN (LOGIN) */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Por favor, ingresa el correo y la contraseña" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mensaje: "Credenciales inválidas (correo no encontrado)" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ mensaje: "Credenciales inválidas (contraseña incorrecta)" });
    }

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      mensaje: "¡Inicio de sesión exitoso! 🔓",
      token,
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión", error: error.message });
  }
};