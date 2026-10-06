import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: "#3b82f6" // Un color por defecto si no se envía
  },
  completed: {
    type: Boolean,
    default: false
  },
  // 🔑 Clave multiusuario: cada tarea pertenece a un usuario específico
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);