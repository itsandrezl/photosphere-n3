import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import * as userService from '../userService.js';

vi.mock('../userService.js');

beforeEach(() => vi.clearAllMocks());

describe('POST /api/users/register', () => {
  it('deve retornar 201 ao registrar usuário', async () => {
    userService.registerUser.mockResolvedValue({ id: 1, name: 'Ana', email: 'ana@test.com' });

    const res = await request(app).post('/api/users/register')
      .send({ name: 'Ana', email: 'ana@test.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('deve retornar 409 se email já cadastrado', async () => {
    userService.registerUser.mockRejectedValue(new Error('Email já cadastrado'));

    const res = await request(app).post('/api/users/register')
      .send({ name: 'Ana', email: 'ana@test.com', password: '123456' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email já cadastrado');
  });

  it('deve retornar 400 se campos ausentes', async () => {
    userService.registerUser.mockRejectedValue(new Error('Campos obrigatórios ausentes'));

    const res = await request(app).post('/api/users/register').send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /api/users/login', () => {
  it('deve retornar 200 em login válido', async () => {
    userService.loginUser.mockResolvedValue({ id: 1, email: 'ana@test.com' });

    const res = await request(app).post('/api/users/login')
      .send({ email: 'ana@test.com', password: '123456' });

    expect(res.status).toBe(200);
  });

  it('deve retornar 401 em senha incorreta', async () => {
    userService.loginUser.mockRejectedValue(new Error('Senha incorreta'));

    const res = await request(app).post('/api/users/login')
      .send({ email: 'ana@test.com', password: 'errada' });

    expect(res.status).toBe(401);
  });

  it('deve retornar 404 se usuário não encontrado', async () => {
    userService.loginUser.mockRejectedValue(new Error('Usuário não encontrado'));

    const res = await request(app).post('/api/users/login')
      .send({ email: 'x@x.com', password: '123' });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/users/:id', () => {
  it('deve retornar 200 com dados do usuário', async () => {
    userService.getUserById.mockResolvedValue({ id: 1, name: 'Ana' });

    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Ana');
  });

  it('deve retornar 404 se usuário não existe', async () => {
    userService.getUserById.mockRejectedValue(new Error('Usuário não encontrado'));

    const res = await request(app).get('/api/users/99');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/users/:id', () => {
  it('deve retornar 204 ao deletar usuário', async () => {
    userService.deleteUser.mockResolvedValue(undefined);

    const res = await request(app).delete('/api/users/1');
    expect(res.status).toBe(204);
  });

  it('deve retornar 404 ao deletar usuário inexistente', async () => {
    userService.deleteUser.mockRejectedValue(new Error('Usuário não encontrado'));

    const res = await request(app).delete('/api/users/99');
    expect(res.status).toBe(404);
  });
});