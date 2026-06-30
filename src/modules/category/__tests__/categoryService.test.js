import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCategoryModel = vi.hoisted(() => ({
  create: vi.fn(),
  findAll: vi.fn(),
  findByPk: vi.fn(),
  findOne: vi.fn(),
}));

vi.mock('../categoryModel.js', () => ({ default: mockCategoryModel }));

import * as categoryService from '../categoryService.js';

beforeEach(() => vi.clearAllMocks());

// ─── createCategory ──────────────────────────────────────────────
describe('createCategory', () => {
  it('deve criar categoria com dados válidos', async () => {
    mockCategoryModel.findOne.mockResolvedValue(null);
    mockCategoryModel.create.mockResolvedValue({ id: 1, name: 'Natureza' });

    const result = await categoryService.createCategory({ name: 'Natureza' });

    expect(mockCategoryModel.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });

  it('deve lançar erro se nome ausente', async () => {
    await expect(
      categoryService.createCategory({ name: '' }),
    ).rejects.toThrow('Nome da categoria é obrigatório');
  });

  it('deve lançar erro se categoria já existe', async () => {
    mockCategoryModel.findOne.mockResolvedValue({ id: 1, name: 'Natureza' });

    await expect(
      categoryService.createCategory({ name: 'Natureza' }),
    ).rejects.toThrow('Categoria já existe');
  });

  it('não deve chamar create se nome ausente', async () => {
    try {
      await categoryService.createCategory({ name: '' });
    } catch {}

    expect(mockCategoryModel.create).not.toHaveBeenCalled();
  });
});

// ─── getCategoryById ─────────────────────────────────────────────
describe('getCategoryById', () => {
  it('deve retornar categoria pelo id', async () => {
    mockCategoryModel.findByPk.mockResolvedValue({ id: 1, name: 'Natureza' });

    const result = await categoryService.getCategoryById(1);
    expect(result).toHaveProperty('name', 'Natureza');
  });

  it('deve lançar erro se categoria não encontrada', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(null);

    await expect(categoryService.getCategoryById(99)).rejects.toThrow('Categoria não encontrada');
  });
});

// ─── listCategories ──────────────────────────────────────────────
describe('listCategories', () => {
  it('deve retornar lista de categorias', async () => {
    mockCategoryModel.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await categoryService.listCategories();
    expect(result).toHaveLength(2);
  });
});

// ─── updateCategory ──────────────────────────────────────────────
describe('updateCategory', () => {
  it('deve atualizar categoria existente', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ id: 1, name: 'Urbano' });
    mockCategoryModel.findByPk.mockResolvedValue({ id: 1, name: 'Natureza', update: mockUpdate });

    const result = await categoryService.updateCategory(1, { name: 'Urbano' });

    expect(mockUpdate).toHaveBeenCalledWith({ name: 'Urbano' });
    expect(result).toHaveProperty('name', 'Urbano');
  });

  it('deve lançar erro ao atualizar categoria inexistente', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(null);

    await expect(categoryService.updateCategory(99, { name: 'X' })).rejects.toThrow(
      'Categoria não encontrada',
    );
  });
});

// ─── deleteCategory ──────────────────────────────────────────────
describe('deleteCategory', () => {
  it('deve deletar categoria existente', async () => {
    const mockDestroy = vi.fn().mockResolvedValue(undefined);
    mockCategoryModel.findByPk.mockResolvedValue({ id: 1, destroy: mockDestroy });

    await categoryService.deleteCategory(1);
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('deve lançar erro ao deletar categoria inexistente', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(null);

    await expect(categoryService.deleteCategory(99)).rejects.toThrow('Categoria não encontrada');
  });
});