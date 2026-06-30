import { Router } from 'express';
import { createAlbum, getAlbum, listAlbums, updateAlbum, deleteAlbum } from './albumController.js';

const router = Router();

router.post('/', createAlbum);
router.get('/user/:userId', listAlbums);
router.get('/:id', getAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
