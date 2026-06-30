import { Router } from 'express';
import { register, login, getById, update, remove, list } from './userController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', list);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;