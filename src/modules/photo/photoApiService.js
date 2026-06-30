import https from 'https';

export const fetchExternalPhotos = (page = 1) => {
  return new Promise((resolve, reject) => {
    const url = `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Erro ao processar resposta da API'));
        }
      });
    }).on('error', reject);
  });
};

export const fetchExternalPhotoById = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error('ID inválido'));
    https.get(`https://jsonplaceholder.typicode.com/photos/${id}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.id) return reject(new Error('Foto externa não encontrada'));
          resolve(parsed);
        } catch {
          reject(new Error('Erro ao processar resposta da API'));
        }
      });
    }).on('error', reject);
  });
};