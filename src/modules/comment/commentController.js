import * as commentService from './commentService.js';

export const create = async (req, res) => {
  try {
    const comment = await commentService.createComment({
      ...req.body,
      userId: req.session.userId,
    });
    return res.status(201).json(comment);
  } catch (error) {
    if (error.message === 'Campos obrigatórios ausentes') return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const listByPhoto = async (req, res) => {
  try {
    const comments = await commentService.listCommentsByPhoto(req.params.photoId);
    return res.status(200).json(comments);
  } catch (error) {
    if (error.message === 'Foto inválida') return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    await commentService.deleteComment(req.params.id, req.session.userId);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'Comentário não encontrado') return res.status(404).json({ message: error.message });
    if (error.message === 'Sem permissão para deletar este comentário') return res.status(403).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};