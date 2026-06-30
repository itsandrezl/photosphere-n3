import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { fetchExternalPhotos, fetchExternalPhotoById } from '../photoApiService.js';

beforeEach(() => nock.cleanAll());
afterEach(() => nock.cleanAll());

const BASE = 'https://jsonplaceholder.typicode.com';

// ─── fetchExternalPhotos ──────────────────────────────────────────
describe('fetchExternalPhotos', () => {
  it('deve retornar lista de fotos da página 1', async () => {
    nock(BASE)
      .get('/photos')
      .query({ _page: '1', _limit: '10' })
      .reply(200, [
        { id: 1, title: 'Pôr do sol', url: 'https://via.placeholder.com/1.jpg' },
        { id: 2, title: 'Montanha',   url: 'https://via.placeholder.com/2.jpg' },
      ]);

    const result = await fetchExternalPhotos(1);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[0]).toHaveProperty('title', 'Pôr do sol');
  });

  it('deve retornar fotos da página 2', async () => {
    nock(BASE)
      .get('/photos')
      .query({ _page: '2', _limit: '10' })
      .reply(200, [
        { id: 11, title: 'Cidade', url: 'https://via.placeholder.com/11.jpg' },
      ]);

    const result = await fetchExternalPhotos(2);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', 11);
  });

  it('deve lançar erro quando API externa falha', async () => {
    nock(BASE)
      .get('/photos')
      .query({ _page: '1', _limit: '10' })
      .replyWithError('Serviço indisponível');

    await expect(fetchExternalPhotos(1)).rejects.toThrow();
  });
});

// ─── fetchExternalPhotoById ───────────────────────────────────────
describe('fetchExternalPhotoById', () => {
  it('deve retornar foto específica pelo id', async () => {
    nock(BASE)
      .get('/photos/5')
      .reply(200, {
        id: 5,
        title: 'Praia',
        url: 'https://via.placeholder.com/5.jpg',
        thumbnailUrl: 'https://via.placeholder.com/150/5.jpg',
      });

    const result = await fetchExternalPhotoById(5);

    expect(result).toHaveProperty('id', 5);
    expect(result).toHaveProperty('title', 'Praia');
  });

  it('deve lançar erro se foto externa não encontrada', async () => {
    nock(BASE)
      .get('/photos/9999')
      .reply(200, {});  // API retorna objeto vazio — sem id

    await expect(fetchExternalPhotoById(9999)).rejects.toThrow('Foto externa não encontrada');
  });

  it('deve lançar erro se id inválido', async () => {
    await expect(fetchExternalPhotoById(null)).rejects.toThrow('ID inválido');
  });
});