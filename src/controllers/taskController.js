import Task from "../models/Task.js";


/* OBTENER TODAS LAS TAREAS */
export const getTasks = async (req, res) => {

    try {
        const tasks = await Task.find().sort({ createdAt: -1 })
        res.status(200).json(tasks)

    } catch (error) {
        res.status(500).json(  {mensaje: 'Error al obtener las tareas', error: error.message} )
    }
}

/* CREAR UNA NUEVA TAREA */
export const createTask = async (req, res) => {

    try {
        const { title, date, time, description } = req.body

        if (!title || !date || !time ) {
            return res.status(400).json( {mensaje: 'El titulo, la fecha y la hora son obligatorios'} )
        }

        const newTask = new Task({title, date, time, description})
        const savedTask = await newTask.save()

        res.status(201).json(savedTask)

    } catch (error) {
        res.status(500).json( {mensaje: 'Error al crear la tarea', error: error.message} )
    }
}

/* ACTUALIZAR UNA TAREA EXISTENTE */

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const taskUpdated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!taskUpdated) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    res.json(taskUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ELIMINAR UNA TAREA */
export const deleteTask = async (req,res) => {

    try {
        
        const { id } = req.params
        const deletedTask = await Task.findByIdAndDelete(id)


        if (!deletedTask) {
            return res.status(404).json( {mensaje: 'Tarea no encontrada'} )
        }

        res.status(200).json( {mensaje: 'Tarea eliminada con exito', id} )

    } catch (error) {

        res.status(500).json( {mensaje: 'Error al eliminar la tarea:', error: error.message} )
    }
}