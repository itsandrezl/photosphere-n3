import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlbumService from '../service'; // Ajuste o caminho conforme sua nomenclatura
import AlbumModel from '../model'; 

// Mock do Model para isolar o banco de dados
vi.mock('../model');

describe('Album Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Sucesso na criação
  it('deve criar um álbum com sucesso', async () => {
    AlbumModel.create.mockResolvedValue({ id: 1, title: 'Férias' });
    const album = await AlbumService.createAlbum({ title: 'Férias' });
    expect(album.title).toBe('Férias');
  });

  // 2. Falha na criação sem título
  it('deve lançar erro se o título não for fornecido', async () => {
    await expect(AlbumService.createAlbum({})).rejects.toThrow('Título é obrigatório');
  });

  // 3. Listagem de álbuns
  it('deve retornar uma lista de álbuns', async () => {
    AlbumModel.findAll.mockResolvedValue([{ id: 1, title: 'Férias' }]);
    const albums = await AlbumService.getAllAlbums();
    expect(albums).toHaveLength(1);
  });

  // 4. Busca por ID com sucesso
  it('deve encontrar um álbum pelo ID', async () => {
    AlbumModel.findByPk.mockResolvedValue({ id: 1, title: 'Férias' });
    const album = await AlbumService.getAlbumById(1);
    expect(album.id).toBe(1);
  });

  // 5. Falha na busca por ID inexistente
  it('deve lançar erro ao buscar ID inexistente', async () => {
    AlbumModel.findByPk.mockResolvedValue(null);
    await expect(AlbumService.getAlbumById(99)).rejects.toThrow('Álbum não encontrado');
  });

  // 6. Atualização com sucesso
  it('deve atualizar um álbum existente', async () => {
    AlbumModel.update.mockResolvedValue([1]);
    const updated = await AlbumService.updateAlbum(1, { title: 'Viagem' });
    expect(updated).toBe(true);
  });

  // 7. Falha na atualização de ID inexistente
  it('deve lançar erro ao atualizar álbum inexistente', async () => {
    AlbumModel.update.mockResolvedValue([0]);
    await expect(AlbumService.updateAlbum(99, { title: 'Viagem' })).rejects.toThrow('Álbum não encontrado para atualização');
  });

  // 8. Exclusão com sucesso
  it('deve deletar um álbum existente', async () => {
    AlbumModel.destroy.mockResolvedValue(1);
    const deleted = await AlbumService.deleteAlbum(1);
    expect(deleted).toBe(true);
  });

  // 9. Falha na exclusão de ID inexistente
  it('deve lançar erro ao deletar álbum inexistente', async () => {
    AlbumModel.destroy.mockResolvedValue(0);
    await expect(AlbumService.deleteAlbum(99)).rejects.toThrow('Álbum não encontrado para exclusão');
  });

  // 10. Validação de formato de dados
  it('deve rejeitar título do álbum muito curto', async () => {
    await expect(AlbumService.createAlbum({ title: 'A' })).rejects.toThrow('Título deve ter mais de 3 caracteres');
  });
});