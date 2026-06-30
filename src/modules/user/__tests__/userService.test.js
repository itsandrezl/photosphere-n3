import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted garante que o mock existe ANTES do vi.mock ser executado
const mockUserModel = vi.hoisted(() => ({
  findOne: vi.fn(),
  findByPk: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
}));

const mockBcrypt = vi.hoisted(() => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn(),
}));

vi.mock('../userModel.js', () => ({ default: mockUserModel }));
vi.mock('bcryptjs', () => ({ default: mockBcrypt }));

import * as userService from '../userService.js';

beforeEach(() => vi.clearAllMocks());

// ─── registerUser ────────────────────────────────────────────────
describe('registerUser', () => {
  it('deve criar usuário com senha criptografada', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({
      id: 1, name: 'Ana', email: 'ana@test.com',
    });

    const result = await userService.registerUser({
      name: 'Ana', email: 'ana@test.com', password: '123456',
    });

    expect(mockUserModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'hashed_password' }),
    );
    expect(result).toHaveProperty('id', 1);
  });

  it('deve lançar erro se email já cadastrado', async () => {
    mockUserModel.findOne.mockResolvedValue({ id: 1 });

    await expect(
      userService.registerUser({ name: 'Ana', email: 'ana@test.com', password: '123456' }),
    ).rejects.toThrow('Email já cadastrado');
  });

  it('deve lançar erro se campos obrigatórios ausentes', async () => {
    await expect(
      userService.registerUser({ name: '', email: '', password: '' }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });

  it('não deve chamar create se email já existe', async () => {
    mockUserModel.findOne.mockResolvedValue({ id: 1 });

    try {
      await userService.registerUser({ name: 'X', email: 'x@x.com', password: '123' });
    } catch {}

    expect(mockUserModel.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro se somente name está ausente', async () => {
    await expect(
      userService.registerUser({ name: '', email: 'a@a.com', password: '123' }),
    ).rejects.toThrow('Campos obrigatórios ausentes');
  });
});

// ─── loginUser ───────────────────────────────────────────────────
describe('loginUser', () => {
  it('deve retornar usuário em login válido', async () => {
    mockUserModel.findOne.mockResolvedValue({ id: 1, email: 'ana@test.com', password: 'hashed' });
    mockBcrypt.compare.mockResolvedValue(true);

    const result = await userService.loginUser({ email: 'ana@test.com', password: '123456' });
    expect(result).toHaveProperty('id', 1);
  });

  it('deve lançar erro se usuário não encontrado', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    await expect(
      userService.loginUser({ email: 'x@x.com', password: '123' }),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('deve lançar erro se senha incorreta', async () => {
    mockUserModel.findOne.mockResolvedValue({ id: 1, password: 'hashed' });
    mockBcrypt.compare.mockResolvedValue(false);

    await expect(
      userService.loginUser({ email: 'ana@test.com', password: 'errada' }),
    ).rejects.toThrow('Senha incorreta');
  });
});

// ─── getUserById ─────────────────────────────────────────────────
describe('getUserById', () => {
  it('deve retornar usuário pelo id', async () => {
    mockUserModel.findByPk.mockResolvedValue({ id: 1, name: 'Ana' });

    const result = await userService.getUserById(1);
    expect(result).toHaveProperty('name', 'Ana');
  });

  it('deve lançar erro se usuário não existe', async () => {
    mockUserModel.findByPk.mockResolvedValue(null);

    await expect(userService.getUserById(99)).rejects.toThrow('Usuário não encontrado');
  });
});

// ─── updateUser ──────────────────────────────────────────────────
describe('updateUser', () => {
  it('deve atualizar dados do usuário', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ id: 1, name: 'Novo Nome' });
    mockUserModel.findByPk.mockResolvedValue({ id: 1, update: mockUpdate });

    const result = await userService.updateUser(1, { name: 'Novo Nome' });

    expect(mockUpdate).toHaveBeenCalledWith({ name: 'Novo Nome' });
    expect(result).toHaveProperty('name', 'Novo Nome');
  });

  it('deve lançar erro ao atualizar usuário inexistente', async () => {
    mockUserModel.findByPk.mockResolvedValue(null);

    await expect(userService.updateUser(99, { name: 'X' })).rejects.toThrow('Usuário não encontrado');
  });
});

// ─── deleteUser ──────────────────────────────────────────────────
describe('deleteUser', () => {
  it('deve deletar usuário existente', async () => {
    const mockDestroy = vi.fn().mockResolvedValue(undefined);
    mockUserModel.findByPk.mockResolvedValue({ id: 1, destroy: mockDestroy });

    await userService.deleteUser(1);
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('deve lançar erro ao deletar usuário inexistente', async () => {
    mockUserModel.findByPk.mockResolvedValue(null);

    await expect(userService.deleteUser(99)).rejects.toThrow('Usuário não encontrado');
  });
});

// ─── listUsers ───────────────────────────────────────────────────
describe('listUsers', () => {
  it('deve retornar lista de usuários sem senha', async () => {
    mockUserModel.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await userService.listUsers();

    expect(result).toHaveLength(2);
    expect(mockUserModel.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: expect.objectContaining({ exclude: ['password'] }),
      }),
    );
  });
});