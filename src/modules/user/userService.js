import bcrypt from 'bcryptjs';
import UserModel from './userModel.js';

export const registerUser = async ({ name, username, email, password }) => {
  if (!name || !email || !password) throw new Error('Campos obrigatórios ausentes');
  const existing = await UserModel.findOne({ where: { email } });
  if (existing) throw new Error('Email já cadastrado');
  const hashedPassword = await bcrypt.hash(password, 10);
  return UserModel.create({ name, username, email, password: hashedPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await UserModel.findOne({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Senha incorreta');
  return user;
};

export const getUserById = async (id) => {
  const user = await UserModel.findByPk(id);
  if (!user) throw new Error('Usuário não encontrado');
  return user;
};

export const updateUser = async (id, data) => {
  const user = await getUserById(id);
  return user.update(data);
};

export const deleteUser = async (id) => {
  const user = await getUserById(id);
  return user.destroy();
};

export const listUsers = async () => {
  return UserModel.findAll({ attributes: { exclude: ['password'] } });
};