import Task from "../models/Task.js";

/* OBTENER TODAS LAS TAREAS (Solo las del usuario autenticado) */
export const getTasks = async (req, res) => {
  try {
    // 🔑 Filtramos por el usuario logueado usando el ID del token
    const userId = req.user.id || req.user._id;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las tareas", error: error.message });
  }
};

/* CREAR UNA NUEVA TAREA */
export const createTask = async (req, res) => {
  try {
    const { title, date, time, description, color, completed = false } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ mensaje: "El titulo, la fecha y la hora son obligatorios" });
    }

    const userId = req.user.id || req.user._id;

    const newTask = new Task({ 
      title, 
      date, 
      time, 
      description, 
      color, 
      completed,
      user: userId // 🔑 Asignamos la tarea al usuario actual
    });
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la tarea", error: error.message });
  }
};

/* ACTUALIZAR UNA TAREA EXISTENTE */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    // 1. Buscamos la tarea asegurándonos de que pertenezca al usuario autenticado
    const existingTask = await Task.findOne({ _id: id, user: userId });

    if (!existingTask) {
      return res.status(404).json({ mensaje: "Tarea no encontrada o no autorizada" });
    }

    // 2. Si la tarea está completada actualmente, verificamos si están intentando CAMBIAR el contenido
    if (existingTask.completed) {
      const isChangingTitle = req.body.title !== undefined && req.body.title !== existingTask.title;
      const isChangingDesc = req.body.description !== undefined && req.body.description !== existingTask.description;
      const isChangingDate = req.body.date !== undefined && req.body.date !== existingTask.date;
      const isChangingTime = req.body.time !== undefined && req.body.time !== existingTask.time;

      // Si intentan modificar los textos/fechas MIENTRAS sigue completada, lo bloqueamos
      if (isChangingTitle || isChangingDesc || isChangingDate || isChangingTime) {
        return res.status(400).json({ 
          mensaje: "No se puede editar el contenido de una tarea completada. Debes desmarcarla primero." 
        });
      }
    }

    // 3. Actualizamos verificando tanto el ID de la tarea como el del usuario
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: id, user: userId }, 
      req.body, 
      { new: true }
    );
    
    res.status(200).json(taskUpdated);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la tarea", error: error.message });
  }
};

/* ELIMINAR UNA TAREA */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    // 1. Buscamos la tarea asegurándonos de que pertenezca al usuario autenticado
    const existingTask = await Task.findOne({ _id: id, user: userId });

    if (!existingTask) {
      return res.status(404).json({ mensaje: "Tarea no encontrada o no autorizada" });
    }

    // 2. Validamos si está completada
    if (existingTask.completed) {
      return res.status(400).json({ 
        mensaje: "No se puede eliminar una tarea completada. Debes desmarcarla primero." 
      });
    }

    await Task.findOneAndDelete({ _id: id, user: userId });
    res.status(200).json({ mensaje: "Tarea eliminada con exito", id });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la tarea:", error: error.message });
  }
};