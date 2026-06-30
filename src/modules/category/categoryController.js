import * as categoryService from './categoryService.js';

export const create = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (error) {
    if (error.message === 'Nome da categoria é obrigatório') return res.status(400).json({ message: error.message });
    if (error.message === 'Categoria já existe') return res.status(409).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const list = async (req, res) => {
  try {
    const categories = await categoryService.listCategories();
    return res.status(200).json(categories);
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return res.status(200).json(category);
  } catch (error) {
    if (error.message === 'Categoria não encontrada') return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json(category);
  } catch (error) {
    if (error.message === 'Categoria não encontrada') return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'Categoria não encontrada') return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};