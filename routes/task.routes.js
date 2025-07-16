import { Router } from 'express';
import TaskController from '../controllers/task.controller.js';

const router = Router();
const name = '/task';

router.route(name)
    .post(TaskController.create)
    .get(TaskController.getAll);

router.route(`${name}/:id`)
    .get(TaskController.getById)
    .put(TaskController.update)
    .delete(TaskController.delete);

export default router;
