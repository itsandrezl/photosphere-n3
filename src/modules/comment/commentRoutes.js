import { Router } from 'express';
import { create, listByPhoto, remove } from './commentController.js';

const router = Router();

router.post('/', create);
router.get('/photo/:photoId', listByPhoto);
router.delete('/:id', remove);

export default router;