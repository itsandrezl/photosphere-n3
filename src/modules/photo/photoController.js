import * as photoService from './photoService.js';

export const create = async (req, res) => {
  try {
    const filename = req.file?.filename || req.body.filename;
    const userId = req.session?.userId || req.body.userId;
    const photo = await photoService.createPhoto({ ...req.body, filename, userId });
    return res.status(201).json(photo);
  } catch (error) {
    if (error.message === 'Campos obrigatórios ausentes') return res.status(400).json({ error: error.message });
    if (error.message === 'Arquivo de imagem obrigatório') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const list = async (req, res) => {
  try {
    const photos = await photoService.listPhotos();
    return res.status(200).json(photos);
  } catch {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getById = async (req, res) => {
  try {
    const photo = await photoService.getPhotoById(req.params.id);
    return res.status(200).json(photo);
  } catch (error) {
    if (error.message === 'Foto não encontrada') return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.session?.userId || req.body.userId;
    const photo = await photoService.updatePhoto(req.params.id, userId, req.body);
    return res.status(200).json(photo);
  } catch (error) {
    if (error.message === 'Foto não encontrada') return res.status(404).json({ error: error.message });
    if (error.message === 'Sem permissão para editar esta foto') return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.session?.userId || req.body.userId;
    await photoService.deletePhoto(req.params.id, userId);
    return res.status(200).json({ message: 'Foto deletada com sucesso' });
  } catch (error) {
    if (error.message === 'Foto não encontrada') return res.status(404).json({ error: error.message });
    if (error.message === 'Sem permissão para deletar esta foto') return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listByUser = async (req, res) => {
  try {
    const photos = await photoService.listPhotosByUser(req.params.userId);
    return res.status(200).json(photos);
  } catch {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listByCategory = async (req, res) => {
  try {
    const photos = await photoService.listPhotosByCategory(req.params.categoryId);
    return res.status(200).json(photos);
  } catch (error) {
    if (error.message === 'Categoria inválida') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
