import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'; // <--- Importamos rutas de auth

const app = express();

app.use(cors());
app.use(express.json());


app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor despierto ' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);     // Maneja POST /api/users/register, GET /api/users, etc.
app.use('/api/auth', authRoutes);     // Maneja POST /api/auth/login

export default app;