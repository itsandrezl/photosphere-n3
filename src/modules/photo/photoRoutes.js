import { Router } from 'express';
import { create, list, getById, update, remove, listByUser, listByCategory } from './photoController.js';

const router = Router();

router.post('/', create);
router.get('/', list);
router.get('/user/:userId', listByUser);
router.get('/category/:categoryId', listByCategory);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
