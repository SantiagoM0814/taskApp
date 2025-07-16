import TaskModel from '../models/task.model.js';

class TaskController {
    async create(req, res) {
    try {
      const task = new TaskModel(req.body);
      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener todas las tareas
  async getAll(req, res) {
    try {
      const tasks = await TaskModel.find().populate('peopleInvolved.createdBy');
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener tarea por ID
  async getById(req, res) {
    try {
      const task = await Task.findById(req.params.id).populate('peopleInvolved.createdBy');
      if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar tarea
  async update(req, res) {
    try {
      const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar tarea
  async delete(req, res) {
    try {
      const deleted = await Task.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.status(200).json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TaskController();