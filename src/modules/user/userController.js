import * as userService from './userService.js';

export const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Email já cadastrado') return res.status(409).json({ message: error.message });
    if (error.message === 'Campos obrigatórios ausentes') return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);
    req.session.userId = user.id;
    return res.status(200).json({ message: 'Login realizado com sucesso', user });
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    if (error.message === 'Senha incorreta') return res.status(401).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const update = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const remove = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const list = async (req, res) => {
  try {
    const users = await userService.listUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};