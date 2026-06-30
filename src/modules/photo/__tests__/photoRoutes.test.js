// DESTINO: src/modules/photo/__tests__/photoRoutes.test.js
// Testes de integração HTTP para rotas de Photo — 12 testes

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock do photoService ANTES de importar o app
vi.mock('../photoService.js');

import * as photoService from '../photoService.js';
import app from '../../../app.js';

beforeEach(() => vi.clearAllMocks());

// ─── POST /api/photos ──────────────────────────────────────────────────────

describe('POST /api/photos', () => {
  it('deve criar foto e retornar 201', async () => {
    photoService.createPhoto.mockResolvedValue({
      id: 1, title: 'Pôr do sol', filename: 'foto.jpg', userId: 1,
    });

    const res = await request(app)
      .post('/api/photos')
      .send({ title: 'Pôr do sol', filename: 'foto.jpg', userId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'Pôr do sol');
  });

  it('deve retornar 400 quando campos obrigatórios ausentes', async () => {
    photoService.createPhoto.mockRejectedValue(new Error('Campos obrigatórios ausentes'));

    const res = await request(app)
      .post('/api/photos')
      .send({ title: '', userId: 1 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Campos obrigatórios ausentes');
  });

  it('deve retornar 400 quando userId ausente', async () => {
    photoService.createPhoto.mockRejectedValue(new Error('Campos obrigatórios ausentes'));

    const res = await request(app)
      .post('/api/photos')
      .send({ title: 'Foto', filename: 'x.jpg' });

    expect(res.status).toBe(400);
  });
});

// ─── GET /api/photos ───────────────────────────────────────────────────────

describe('GET /api/photos', () => {
  it('deve retornar 200 com lista de fotos', async () => {
    photoService.listPhotos.mockResolvedValue([
      { id: 1, title: 'Foto 1' },
      { id: 2, title: 'Foto 2' },
    ]);

    const res = await request(app).get('/api/photos');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('deve retornar 200 com lista vazia', async () => {
    photoService.listPhotos.mockResolvedValue([]);

    const res = await request(app).get('/api/photos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ─── GET /api/photos/:id ───────────────────────────────────────────────────

describe('GET /api/photos/:id', () => {
  it('deve retornar 200 com a foto encontrada', async () => {
    photoService.getPhotoById.mockResolvedValue({ id: 1, title: 'Pôr do sol' });

    const res = await request(app).get('/api/photos/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('deve retornar 404 quando foto não existir', async () => {
    photoService.getPhotoById.mockRejectedValue(new Error('Foto não encontrada'));

    const res = await request(app).get('/api/photos/999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Foto não encontrada');
  });
});

// ─── PUT /api/photos/:id ───────────────────────────────────────────────────

describe('PUT /api/photos/:id', () => {
  it('deve retornar 200 ao atualizar com sucesso', async () => {
    photoService.updatePhoto.mockResolvedValue({ id: 1, title: 'Novo título' });

    const res = await request(app)
      .put('/api/photos/1')
      .send({ userId: 1, title: 'Novo título' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Novo título');
  });

  it('deve retornar 403 quando usuário não é dono da foto', async () => {
    photoService.updatePhoto.mockRejectedValue(
      new Error('Sem permissão para editar esta foto'),
    );

    const res = await request(app)
      .put('/api/photos/1')
      .send({ userId: 99, title: 'X' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Sem permissão para editar esta foto');
  });
});

// ─── DELETE /api/photos/:id ────────────────────────────────────────────────

describe('DELETE /api/photos/:id', () => {
  it('deve retornar 200 ao deletar com sucesso', async () => {
    photoService.deletePhoto.mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/photos/1')
      .send({ userId: 1 });

    expect(res.status).toBe(200);
  });

  it('deve retornar 403 quando usuário não é dono', async () => {
    photoService.deletePhoto.mockRejectedValue(
      new Error('Sem permissão para deletar esta foto'),
    );

    const res = await request(app)
      .delete('/api/photos/1')
      .send({ userId: 99 });

    expect(res.status).toBe(403);
  });
});

// ─── GET /api/photos/user/:userId ──────────────────────────────────────────

describe('GET /api/photos/user/:userId', () => {
  it('deve retornar 200 com fotos do usuário', async () => {
    photoService.listPhotosByUser.mockResolvedValue([
      { id: 1, userId: 1 },
      { id: 2, userId: 1 },
    ]);

    const res = await request(app).get('/api/photos/user/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// ─── GET /api/photos/category/:categoryId ──────────────────────────────────

describe('GET /api/photos/category/:categoryId', () => {
  it('deve retornar 200 com fotos da categoria', async () => {
    photoService.listPhotosByCategory.mockResolvedValue([
      { id: 1, categoryId: 2 },
    ]);

    const res = await request(app).get('/api/photos/category/2');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('deve retornar 400 quando categoryId inválido', async () => {
    photoService.listPhotosByCategory.mockRejectedValue(
      new Error('Categoria inválida'),
    );

    const res = await request(app).get('/api/photos/category/0');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Categoria inválida');
  });
});