import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../../../app'; // Importe a instância do Express
import AlbumService from '../service';

vi.mock('../service');

describe('Album API Integration', () => {
  // 1. POST /albums - Sucesso
  it('POST /albums - deve criar um álbum e retornar 201', async () => {
    AlbumService.createAlbum.mockResolvedValue({ id: 1, title: 'Praia' });
    const res = await request(app).post('/albums').send({ title: 'Praia' });
    expect(res.statusCode).toBe(201);
  });

  // 2. POST /albums - Falha sem título
  it('POST /albums - deve retornar 400 se faltar título', async () => {
    AlbumService.createAlbum.mockRejectedValue(new Error('Título é obrigatório'));
    const res = await request(app).post('/albums').send({});
    expect(res.statusCode).toBe(400);
  });

  // 3. GET /albums - Sucesso
  it('GET /albums - deve listar álbuns e retornar 200', async () => {
    AlbumService.getAllAlbums.mockResolvedValue([{ id: 1, title: 'Praia' }]);
    const res = await request(app).get('/albums');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 4. GET /albums/:id - Sucesso
  it('GET /albums/:id - deve retornar álbum específico com 200', async () => {
    AlbumService.getAlbumById.mockResolvedValue({ id: 1, title: 'Praia' });
    const res = await request(app).get('/albums/1');
    expect(res.statusCode).toBe(200);
  });

  // 5. GET /albums/:id - Falha (Não encontrado)
  it('GET /albums/:id - deve retornar 404 se não existir', async () => {
    AlbumService.getAlbumById.mockRejectedValue(new Error('Álbum não encontrado'));
    const res = await request(app).get('/albums/99');
    expect(res.statusCode).toBe(404);
  });

  // 6. PUT /albums/:id - Sucesso
  it('PUT /albums/:id - deve atualizar e retornar 200', async () => {
    AlbumService.updateAlbum.mockResolvedValue(true);
    const res = await request(app).put('/albums/1').send({ title: 'Campo' });
    expect(res.statusCode).toBe(200);
  });

  // 7. PUT /albums/:id - Falha
  it('PUT /albums/:id - deve retornar 404 se falhar na atualização', async () => {
    AlbumService.updateAlbum.mockRejectedValue(new Error('Álbum não encontrado para atualização'));
    const res = await request(app).put('/albums/99').send({ title: 'Campo' });
    expect(res.statusCode).toBe(404);
  });

  // 8. DELETE /albums/:id - Sucesso
  it('DELETE /albums/:id - deve deletar e retornar 204', async () => {
    AlbumService.deleteAlbum.mockResolvedValue(true);
    const res = await request(app).delete('/albums/1');
    expect(res.statusCode).toBe(204);
  });

  // 9. DELETE /albums/:id - Falha
  it('DELETE /albums/:id - deve retornar 404 se ID não existir', async () => {
    AlbumService.deleteAlbum.mockRejectedValue(new Error('Álbum não encontrado para exclusão'));
    const res = await request(app).delete('/albums/99');
    expect(res.statusCode).toBe(404);
  });

  // 10. POST /albums - Título muito curto
  it('POST /albums - deve retornar 400 para título inválido', async () => {
    AlbumService.createAlbum.mockRejectedValue(new Error('Título deve ter mais de 3 caracteres'));
    const res = await request(app).post('/albums').send({ title: 'A' });
    expect(res.statusCode).toBe(400);
  });
});