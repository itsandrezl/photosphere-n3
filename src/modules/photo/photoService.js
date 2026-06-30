import PhotoModel from './photoModel.js';

export const createPhoto = async ({ title, description, filename, userId, albumId, categoryId }) => {
  if (!title || !filename || !userId) throw new Error('Campos obrigatórios ausentes');
  return PhotoModel.create({ title, description, filename, userId, albumId, categoryId });
};

export const listPhotos = async () => {
  return PhotoModel.findAll();
};

export const getPhotoById = async (id) => {
  const photo = await PhotoModel.findByPk(id);
  if (!photo) throw new Error('Foto não encontrada');
  return photo;
};

export const updatePhoto = async (id, userId, data) => {
  const photo = await getPhotoById(id);
  if (photo.userId !== Number(userId)) throw new Error('Sem permissão para editar esta foto');
  return photo.update(data);
};

export const deletePhoto = async (id, userId) => {
  const photo = await getPhotoById(id);
  if (photo.userId !== Number(userId)) throw new Error('Sem permissão para deletar esta foto');
  return photo.destroy();
};

export const listPhotosByUser = async (userId) => {
  return PhotoModel.findAll({ where: { userId } });
};

export const listPhotosByCategory = async (categoryId) => {
  if (!categoryId) throw new Error('Categoria inválida');
  return PhotoModel.findAll({ where: { categoryId } });
};