import express from 'express';
import session from 'express-session';
import sequelize from './config/database.js';

import userRoutes from './modules/user/userRoutes.js';
import photoRoutes from './modules/photo/photoRoutes.js';
import albumRoutes from './modules/album/albumRoutes.js';
import categoryRoutes from './modules/category/categoryRoutes.js';
import commentRoutes from './modules/comment/commentRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('public/uploads'));

app.use(session({
  secret: 'photosphere-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);
// Ajustado para /albums para bater exatamente com os testes de integração
app.use('/albums', albumRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ message });
});

export default app;

// Iniciar servidor (só quando rodado diretamente, não nos testes)
// Adicionada checagem de segurança para o process.argv[1]
if (process.argv[1] && process.argv[1].includes('app.js')) {
  const PORT = 3000;

  // Importar models para registrar tabelas no Sequelize
  await import('./modules/user/userModel.js');
  await import('./modules/photo/photoModel.js');
  await import('./modules/album/albumModel.js');
  await import('./modules/category/categoryModel.js');
  await import('./modules/comment/commentModel.js');

  sequelize.sync({ alter: true })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 PhotoSphere rodando em http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Erro ao conectar no banco:', err.message);
    });
}