// DESTINO: tests/unit/album.service.test.js
// Testes unitários do AlbumService — 15 testes

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do modelo Album ANTES de importar o service
vi.mock('../../src/modules/album/album.model');

import AlbumService from '../../src/modules/album/album.service';
import Album from '../../src/modules/album/album.model';

describe('AlbumService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── createAlbum ───────────────────────────────────────────────────────────

  describe('createAlbum', () => {
    it('deve criar um álbum com sucesso quando dados são válidos', async () => {
      const mockAlbum = { id: 1, title: 'Férias 2024', description: 'Fotos das férias', userId: 1 };
      Album.create = vi.fn().mockResolvedValue(mockAlbum);

      const result = await AlbumService.createAlbum({
        title: 'Férias 2024',
        description: 'Fotos das férias',
        userId: 1,
      });

      expect(Album.create).toHaveBeenCalledWith({
        title: 'Férias 2024',
        description: 'Fotos das férias',
        userId: 1,
      });
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('title', 'Férias 2024');
    });

    it('deve lançar erro quando o título estiver vazio', async () => {
      await expect(
        AlbumService.createAlbum({ title: '', userId: 1 })
      ).rejects.toThrow('O título do álbum é obrigatório');
    });

    it('deve lançar erro quando o título for apenas espaços em branco', async () => {
      await expect(
        AlbumService.createAlbum({ title: '   ', userId: 1 })
      ).rejects.toThrow('O título do álbum é obrigatório');
    });

    it('deve lançar erro quando o título não for fornecido', async () => {
      await expect(
        AlbumService.createAlbum({ userId: 1 })
      ).rejects.toThrow('O título do álbum é obrigatório');
    });

    it('deve lançar erro quando o título exceder 100 caracteres', async () => {
      const longTitle = 'a'.repeat(101);
      await expect(
        AlbumService.createAlbum({ title: longTitle, userId: 1 })
      ).rejects.toThrow('O título não pode ter mais de 100 caracteres');
    });

    it('deve lançar erro quando userId não for fornecido', async () => {
      await expect(
        AlbumService.createAlbum({ title: 'Álbum válido' })
      ).rejects.toThrow('O ID do usuário é obrigatório');
    });

    it('deve criar álbum sem descrição (description null)', async () => {
      const mockAlbum = { id: 2, title: 'Sem descrição', description: null, userId: 1 };
      Album.create = vi.fn().mockResolvedValue(mockAlbum);

      const result = await AlbumService.createAlbum({ title: 'Sem descrição', userId: 1 });

      expect(result).toHaveProperty('description', null);
      expect(Album.create).toHaveBeenCalledWith(
        expect.objectContaining({ description: null })
      );
    });
  });

  // ─── getAlbumById ──────────────────────────────────────────────────────────

  describe('getAlbumById', () => {
    it('deve retornar o álbum quando o ID existir', async () => {
      const mockAlbum = { id: 1, title: 'Férias 2024', userId: 1 };
      Album.findByPk = vi.fn().mockResolvedValue(mockAlbum);

      const result = await AlbumService.getAlbumById(1);

      expect(Album.findByPk).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('title', 'Férias 2024');
    });

    it('deve lançar erro quando o álbum não for encontrado', async () => {
      Album.findByPk = vi.fn().mockResolvedValue(null);

      await expect(AlbumService.getAlbumById(999)).rejects.toThrow(
        'Álbum não encontrado'
      );
    });
  });

  // ─── listAlbumsByUser ──────────────────────────────────────────────────────

  describe('listAlbumsByUser', () => {
    it('deve retornar lista de álbuns do usuário', async () => {
      const mockAlbums = [
        { id: 1, title: 'Álbum 1', userId: 1 },
        { id: 2, title: 'Álbum 2', userId: 1 },
      ];
      Album.findAll = vi.fn().mockResolvedValue(mockAlbums);

      const result = await AlbumService.listAlbumsByUser(1);

      expect(Album.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('title', 'Álbum 1');
    });

    it('deve retornar lista vazia quando usuário não tiver álbuns', async () => {
      Album.findAll = vi.fn().mockResolvedValue([]);

      const result = await AlbumService.listAlbumsByUser(999);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  // ─── updateAlbum ───────────────────────────────────────────────────────────

  describe('updateAlbum', () => {
    it('deve atualizar o álbum com sucesso', async () => {
      const mockAlbum = {
        id: 1,
        title: 'Título Antigo',
        description: 'Descrição antiga',
        update: vi.fn().mockResolvedValue(true),
      };
      Album.findByPk = vi.fn().mockResolvedValue(mockAlbum);

      await AlbumService.updateAlbum(1, { title: 'Título Novo' });

      expect(mockAlbum.update).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Título Novo' })
      );
    });

    it('deve lançar erro ao tentar atualizar álbum inexistente', async () => {
      Album.findByPk = vi.fn().mockResolvedValue(null);

      await expect(
        AlbumService.updateAlbum(999, { title: 'Novo título' })
      ).rejects.toThrow('Álbum não encontrado');
    });

    it('deve lançar erro ao tentar atualizar título para string vazia', async () => {
      const mockAlbum = {
        id: 1,
        title: 'Atual',
        update: vi.fn(),
      };
      Album.findByPk = vi.fn().mockResolvedValue(mockAlbum);

      await expect(
        AlbumService.updateAlbum(1, { title: '' })
      ).rejects.toThrow('O título do álbum não pode ser vazio');
    });
  });

  // ─── deleteAlbum ───────────────────────────────────────────────────────────

  describe('deleteAlbum', () => {
    it('deve deletar o álbum com sucesso e retornar mensagem', async () => {
      const mockAlbum = {
        id: 1,
        destroy: vi.fn().mockResolvedValue(true),
      };
      Album.findByPk = vi.fn().mockResolvedValue(mockAlbum);

      const result = await AlbumService.deleteAlbum(1);

      expect(mockAlbum.destroy).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Álbum deletado com sucesso');
    });

    it('deve lançar erro ao tentar deletar álbum inexistente', async () => {
      Album.findByPk = vi.fn().mockResolvedValue(null);

      await expect(AlbumService.deleteAlbum(999)).rejects.toThrow(
        'Álbum não encontrado'
      );
    });
  });
});