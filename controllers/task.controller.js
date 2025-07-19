import TaskModel from '../models/task.model.js';
import { mongoose } from '../config/db/connection.js';

class TaskController {
  async addTask(req, res) {
    try {
      const { userId, title, description, type, priority, color, dateStart, dateEnd, notificationEmail, assignees, createdBy, tags } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required ' });
      }

      if (!title || !type || !dateStart || !dateEnd) {
        return res.status(400).json({ error: 'Title, type, start date and end date are required' });
      }

      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      if (endDate < startDate) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      const parsedAssignees = assignees ? JSON.parse(assignees) : [];
      const parsedTags = tags ? JSON.parse(tags) : [];

      const files = (req.files || []).map(file => ({
        name: file.originalname,
        url: file.path, // o file.filename si vas a construir una URL pública
        type: getFileType(file.mimetype),
        size: file.size,
        uploadDate: new Date()
      }));

      const newTasks = new TaskModel({
        title,
        description,
        type,
        priority,
        color,
        startDate,
        endDate,
        notificationEmail,
        assignees: parsedAssignees.map(assignee => ({
          name: assignee.name,
          email: assignee.email,
          role: assignee.role,
          userId: assignee.userId
        })),
        files,
        projectId: req.body.projectId ? new mongoose.Types.ObjectId(req.body.projectId) : null,
        createdBy: createdBy || userId,
        tags: parsedTags
      });

      const savedTasks = await newTasks.save();
      if (notificationEmail) {
        // emailController.sendNotificationEmail(notificationEmail, savedTasks);
      }

      res.status(201).json({ "data": savedTasks });
    } catch (error) {
      res.status(400).json({
        error: error.message,
        details: error.errors
      });
    }
  };

  // Obtener todas las tareas
  async show(req, res) {
    try {
      const taskModel = await TaskModel.find();
      if (!taskModel) throw new Error('Task not found');
      return res.status(200).json({ data: taskModel });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener tarea por ID
  async findById(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: 'Task Id is required' });
      }

      const taskModel = await TaskModel.findOne({ _id: id });
      if (!taskModel) throw new Error('Task not found');
      return res.status(200).json({ data: taskModel });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar tarea
  async update(req, res) {
    try {
      const { userId, title, description, type, priority, color, dateStart, dateEnd, notificationEmail, assignees, createdBy, tags } = req.body;

      console.log(userId, title, description, type, priority, color, dateStart, dateEnd, notificationEmail, assignees, createdBy, tags)
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required ' });
      }

      if (!title || !type || !dateStart || !dateEnd) {
        return res.status(400).json({ error: 'Title, type, start date and end date are required' });
      }

      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);

      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      if (endDate < startDate) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      const parsedAssignees = typeof assignees === 'string' ? JSON.parse(assignees) : assignees;
      const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      const files = (req.files || []).map(file => ({
        name: file.originalname,
        url: file.path, // o file.filename si vas a construir una URL pública
        type: getFileType(file.mimetype),
        size: file.size,
        uploadDate: new Date()
      }));

      const taskId = req.params.id;
      const updatedTask = await TaskModel.findOneAndUpdate(
        { _id: taskId },
        {
          title,
          description,
          type,
          priority,
          color,
          startDate,
          endDate,
          notificationEmail,
          assignees: parsedAssignees.map(assignee => ({
            name: assignee.name,
            email: assignee.email,
            role: assignee.role,
            userId: assignee.userId
          })),
          files,
          createdBy: createdBy || userId,
          tags: Array.isArray(parsedTags) ? parsedTags : []
        },
        { new: true } // Para devolver el documento actualizado
      );

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json({ data: updatedTask });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar tarea
  async delete(req, res) {
    try {
      const deletedTask = await TaskModel.findOneAndDelete({
        _id: req.params.id
      });
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ message: 'Task Deleted Successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  }
}

export default new TaskController();

function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf' || mimetype.includes('document')) return 'document';
  return 'other';
}
