import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCommentModel = vi.hoisted(() => ({
  create: vi.fn(),
  findAll: vi.fn(),
  findByPk: vi.fn(),
}));

vi.mock('../commentModel.js', () => ({ default: mockCommentModel }));

import * as commentService from '../commentService.js';

beforeEach(() => vi.clearAllMocks());

// ─── createComment ───────────────────────────────────────────────
describe('createComment', () => {
  it('deve criar comentário com dados válidos', async () => {
    mockCommentModel.create.mockResolvedValue({ id: 1, content: 'Linda foto!', userId: 1, photoId: 2 });

    const result = await commentService.createComment({ content: 'Linda foto!', userId: 1, photoId: 2 });

    expect(mockCommentModel.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });

  it('deve lançar erro se content ausente', async () => {
    await expect(
      commentService.createComment({ content: '', userId: 1, photoId: 2 }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('deve lançar erro se userId ausente', async () => {
    await expect(
      commentService.createComment({ content: 'Ótima!', userId: null, photoId: 2 }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('deve lançar erro se photoId ausente', async () => {
    await expect(
      commentService.createComment({ content: 'Ótima!', userId: 1, photoId: null }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('não deve chamar create se dados inválidos', async () => {
    try {
      await commentService.createComment({ content: '', userId: null, photoId: null });
    } catch {}

    expect(mockCommentModel.create).not.toHaveBeenCalled();
  });
});

// ─── listCommentsByPhoto ─────────────────────────────────────────
describe('listCommentsByPhoto', () => {
  it('deve retornar comentários de uma foto', async () => {
    mockCommentModel.findAll.mockResolvedValue([{ id: 1, photoId: 2 }, { id: 2, photoId: 2 }]);

    const result = await commentService.listCommentsByPhoto(2);
    expect(result).toHaveLength(2);
  });

  it('deve lançar erro se photoId inválido', async () => {
    await expect(commentService.listCommentsByPhoto(null)).rejects.toThrow('Foto inválida');
  });
});

// ─── getCommentById ──────────────────────────────────────────────
describe('getCommentById', () => {
  it('deve retornar comentário pelo id', async () => {
    mockCommentModel.findByPk.mockResolvedValue({ id: 1, content: 'Linda!' });

    const result = await commentService.getCommentById(1);
    expect(result).toHaveProperty('content', 'Linda!');
  });

  it('deve lançar erro se comentário não encontrado', async () => {
    mockCommentModel.findByPk.mockResolvedValue(null);

    await expect(commentService.getCommentById(99)).rejects.toThrow('Comentário não encontrado');
  });
});

// ─── deleteComment ───────────────────────────────────────────────
describe('deleteComment', () => {
  it('deve deletar comentário do próprio usuário', async () => {
    const mockDestroy = vi.fn().mockResolvedValue(undefined);
    mockCommentModel.findByPk.mockResolvedValue({ id: 1, userId: 1, destroy: mockDestroy });

    await commentService.deleteComment(1, 1);
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('deve lançar erro se usuário não é dono do comentário', async () => {
    mockCommentModel.findByPk.mockResolvedValue({ id: 1, userId: 2, destroy: vi.fn() });

    await expect(commentService.deleteComment(1, 99)).rejects.toThrow(
      'Sem permissão para deletar este comentário',
    );
  });

  it('deve lançar erro se comentário não encontrado', async () => {
    mockCommentModel.findByPk.mockResolvedValue(null);

    await expect(commentService.deleteComment(99, 1)).rejects.toThrow('Comentário não encontrado');
  });
});