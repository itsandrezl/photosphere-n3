import CommentModel from './commentModel.js';

export const createComment = async ({ content, userId, photoId }) => {
  if (!content || !userId || !photoId) throw new Error('Campos obrigatórios ausentes');
  return CommentModel.create({ content, userId, photoId });
};

export const listCommentsByPhoto = async (photoId) => {
  if (!photoId) throw new Error('Foto inválida');
  return CommentModel.findAll({ where: { photoId } });
};

export const deleteComment = async (id, userId) => {
  const comment = await CommentModel.findByPk(id);
  if (!comment) throw new Error('Comentário não encontrado');
  if (comment.userId !== Number(userId)) throw new Error('Sem permissão para deletar este comentário');
  return comment.destroy();
};

export const getCommentById = async (id) => {
  const comment = await CommentModel.findByPk(id);
  if (!comment) throw new Error('Comentário não encontrado');
  return comment;
};