import * as AlbumService from './albumService.js';

export const createAlbum = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const album = await AlbumService.createAlbum({ title, description, userId });
    return res.status(201).json(album);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAlbum = async (req, res) => {
  try {
    const album = await AlbumService.getAlbumById(Number(req.params.id));
    return res.status(200).json(album);
  } catch (error) {
    if (error.message === 'Álbum não encontrado') return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const listAlbums = async (req, res) => {
  try {
    const albums = await AlbumService.listAlbumsByUser(Number(req.params.userId));
    return res.status(200).json(albums);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const album = await AlbumService.updateAlbum(Number(req.params.id), { title, description });
    return res.status(200).json(album);
  } catch (error) {
    if (error.message === 'Álbum não encontrado') return res.status(404).json({ error: error.message });
    return res.status(400).json({ error: error.message });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const result = await AlbumService.deleteAlbum(Number(req.params.id));
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Álbum não encontrado') return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
