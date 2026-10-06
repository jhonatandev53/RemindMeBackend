// src/routes/taskRoutes.js
import { Router } from "express";
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from "../controllers/taskController.js"; // 👈 Importamos los 4 controladores[cite: 7, 11]
import { protect } from "../middleware/authMiddleware.js"; //[cite: 7, 9]

const router = Router();

router.get('/', protect, getTasks);       // Obtener tareas[cite: 7]
router.post('/', protect, createTask);    // Crear tarea[cite: 7]
router.put('/:id', protect, updateTask);  // 👈 ¡Faltaba registrar la ruta para actualizar!
router.delete('/:id', protect, deleteTask); // 👈 ¡Faltaba registrar la ruta para eliminar!

export default router;