import CategoryModel from './categoryModel.js';

export const createCategory = async ({ name, description }) => {
  if (!name) throw new Error('Nome da categoria é obrigatório');
  const existing = await CategoryModel.findOne({ where: { name } });
  if (existing) throw new Error('Categoria já existe');
  return CategoryModel.create({ name, description });
};

export const listCategories = async () => {
  return CategoryModel.findAll();
};

export const getCategoryById = async (id) => {
  const category = await CategoryModel.findByPk(id);
  if (!category) throw new Error('Categoria não encontrada');
  return category;
};

export const updateCategory = async (id, data) => {
  const category = await getCategoryById(id);
  return category.update(data);
};

export const deleteCategory = async (id) => {
  const category = await getCategoryById(id);
  return category.destroy();
};