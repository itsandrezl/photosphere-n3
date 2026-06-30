import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPhotoModel = vi.hoisted(() => ({
  create: vi.fn(),
  findAll: vi.fn(),
  findByPk: vi.fn(),
}));

vi.mock('../photoModel.js', () => ({ default: mockPhotoModel }));

import * as photoService from '../photoService.js';

beforeEach(() => vi.clearAllMocks());

// ─── createPhoto ─────────────────────────────────────────────────
describe('createPhoto', () => {
  it('deve criar foto com dados válidos', async () => {
    mockPhotoModel.create.mockResolvedValue({ id: 1, title: 'Pôr do sol', filename: 'foto.jpg' });

    const result = await photoService.createPhoto({
      title: 'Pôr do sol', filename: 'foto.jpg', userId: 1,
    });

    expect(mockPhotoModel.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });

  it('deve lançar erro se título ausente', async () => {
    await expect(
      photoService.createPhoto({ title: '', filename: 'foto.jpg', userId: 1 }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('deve lançar erro se filename ausente', async () => {
    await expect(
      photoService.createPhoto({ title: 'Foto', filename: '', userId: 1 }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('deve lançar erro se userId ausente', async () => {
    await expect(
      photoService.createPhoto({ title: 'Foto', filename: 'foto.jpg', userId: null }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('não deve chamar create se dados inválidos', async () => {
    try {
      await photoService.createPhoto({ title: '', filename: '', userId: null });
    } catch {}

    expect(mockPhotoModel.create).not.toHaveBeenCalled();
  });
});

// ─── getPhotoById ────────────────────────────────────────────────
describe('getPhotoById', () => {
  it('deve retornar foto pelo id', async () => {
    mockPhotoModel.findByPk.mockResolvedValue({ id: 1, title: 'Pôr do sol' });

    const result = await photoService.getPhotoById(1);
    expect(result).toHaveProperty('title', 'Pôr do sol');
  });

  it('deve lançar erro se foto não encontrada', async () => {
    mockPhotoModel.findByPk.mockResolvedValue(null);

    await expect(photoService.getPhotoById(99)).rejects.toThrow('Foto não encontrada');
  });
});

// ─── listPhotos ──────────────────────────────────────────────────
describe('listPhotos', () => {
  it('deve retornar lista de fotos', async () => {
    mockPhotoModel.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await photoService.listPhotos();
    expect(result).toHaveLength(2);
  });
});

// ─── updatePhoto ─────────────────────────────────────────────────
describe('updatePhoto', () => {
  it('deve atualizar foto do próprio usuário', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ id: 1, title: 'Novo título' });
    mockPhotoModel.findByPk.mockResolvedValue({ id: 1, userId: 1, update: mockUpdate });

    const result = await photoService.updatePhoto(1, 1, { title: 'Novo título' });
    expect(mockUpdate).toHaveBeenCalledWith({ title: 'Novo título' });
    expect(result).toHaveProperty('title', 'Novo título');
  });

  it('deve lançar erro se usuário não é dono da foto', async () => {
    mockPhotoModel.findByPk.mockResolvedValue({ id: 1, userId: 2, update: vi.fn() });

    await expect(photoService.updatePhoto(1, 99, { title: 'X' })).rejects.toThrow(
      'Sem permissão para editar esta foto',
    );
  });
});

// ─── deletePhoto ─────────────────────────────────────────────────
describe('deletePhoto', () => {
  it('deve deletar foto do próprio usuário', async () => {
    const mockDestroy = vi.fn().mockResolvedValue(undefined);
    mockPhotoModel.findByPk.mockResolvedValue({ id: 1, userId: 1, destroy: mockDestroy });

    await photoService.deletePhoto(1, 1);
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('deve lançar erro se usuário não é dono', async () => {
    mockPhotoModel.findByPk.mockResolvedValue({ id: 1, userId: 2, destroy: vi.fn() });

    await expect(photoService.deletePhoto(1, 99)).rejects.toThrow(
      'Sem permissão para deletar esta foto',
    );
  });
});

// ─── listPhotosByCategory ────────────────────────────────────────
describe('listPhotosByCategory', () => {
  it('deve retornar fotos de uma categoria', async () => {
    mockPhotoModel.findAll.mockResolvedValue([{ id: 1, categoryId: 3 }]);

    const result = await photoService.listPhotosByCategory(3);
    expect(result).toHaveLength(1);
  });

  it('deve lançar erro se categoryId inválido', async () => {
    await expect(photoService.listPhotosByCategory(null)).rejects.toThrow('Categoria inválida');
  });
});

// ─── listPhotosByUser ─────────────────────────────────────────────
describe('listPhotosByUser', () => {
  it('deve retornar fotos de um usuário específico', async () => {
    mockPhotoModel.findAll.mockResolvedValue([
      { id: 1, userId: 1 },
      { id: 2, userId: 1 },
    ]);

    const result = await photoService.listPhotosByUser(1);

    expect(mockPhotoModel.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(result).toHaveLength(2);
  });
});