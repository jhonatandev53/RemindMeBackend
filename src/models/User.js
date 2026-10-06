import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telegramId: { type: String, default: "" },
  theme: { type: String, default: "dark" }
}, { timestamps: true });

// 🔒 MIDDLEWARE: Cifrar la contraseña automáticamente (sin usar 'next')
userSchema.pre('save', async function () {
  // Si la contraseña no ha sido modificada, terminamos aquí
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);