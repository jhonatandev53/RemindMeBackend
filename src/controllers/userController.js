import User from "../models/User.js";
import jwt from 'jsonwebtoken';

// 🔑 Función auxiliar para generar el Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/* REGISTRAR UN NUEVO USUARIO */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, telegramId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ mensaje: "El nombre, el correo y la contraseña son obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo electrónico ya se encuentra registrado" });
    }

    const newUser = new User({ 
      name, 
      email, 
      password, 
      telegramId: telegramId || "" 
    });
    
    const savedUser = await newUser.save();
    
    // Generamos el token JWT para el usuario recién registrado
    const token = generateToken(savedUser._id);

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      mensaje: "¡Usuario registrado con éxito y sesión iniciada! 🔒🚀", 
      token, 
      user: userResponse 
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario", error: error.message });
  }
};

/* OBTENER PERFIL DE USUARIO */
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    
    const user = await User.findOne(query).select('-password');
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el perfil", error: error.message });
  }
};

/* ACTUALIZAR PERFIL / TELEGRAM CHAT ID */
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ mensaje: "Usuario no encontrado para actualizar" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el perfil", error: error.message });
  }
};