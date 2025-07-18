import { Router } from 'express';
import TaskController from '../controllers/task.controller.js';
import { upload } from '../controllers/uploadFile.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
const name = '/task';

router.use(verifyToken);

router.route(name)
    .post(upload.array('files', 5), TaskController.addTask)
    .get(TaskController.show);

router.route(`${name}/:id`)
    .get(TaskController.findById)
    .put(upload.array('files', 5), TaskController.update)
    .delete(TaskController.delete);

export default router;
