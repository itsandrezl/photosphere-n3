import Album from './albumModel.js';

export const createAlbum = async ({ title, description, userId }) => {
  if (!title || !title.trim()) throw new Error('O título do álbum é obrigatório');
  if (title.length > 100) throw new Error('O título não pode ter mais de 100 caracteres');
  if (!userId) throw new Error('O ID do usuário é obrigatório');
  return Album.create({ title: title.trim(), description: description || null, userId });
};

export const getAlbumById = async (id) => {
  const album = await Album.findByPk(id);
  if (!album) throw new Error('Álbum não encontrado');
  return album;
};

export const listAlbumsByUser = async (userId) => {
  return Album.findAll({ where: { userId } });
};

export const updateAlbum = async (id, { title, description }) => {
  const album = await getAlbumById(id);
  if (title !== undefined && title.trim() === '') throw new Error('O título do álbum não pode ser vazio');
  return album.update({ title: title?.trim(), description });
};

export const deleteAlbum = async (id) => {
  const album = await getAlbumById(id);
  await album.destroy();
  return { message: 'Álbum deletado com sucesso' };
};

export default { createAlbum, getAlbumById, listAlbumsByUser, updateAlbum, deleteAlbum };
