import { Router } from 'express';
import { create, list, getById, update, remove } from './categoryController.js';

const router = Router();

router.post('/', create);
router.get('/', list);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;