import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();

// ─── Tema ────────────────────────────────────────────────────────────────────
const THEME = {
  bg: '1A1A2E',        // Azul-noturno
  accent: '16213E',
  blue: '0F3460',
  gold: 'E94560',
  white: 'FFFFFF',
  gray: 'B0B0C0',
  code: '0D1B2A',
  green: '4CAF50',
  red: 'E94560',
};

pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'André Felipe';
pptx.subject = 'PhotoSphere — N3 TDD';

// ─── Helper: slide base ──────────────────────────────────────────────────────
function addSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: THEME.bg };

  // Faixa lateral esquerda
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.15, h: 5.63,
    fill: { color: THEME.gold },
  });

  if (title) {
    slide.addText(title, {
      x: 0.3, y: 0.2, w: 12.5, h: 0.7,
      fontSize: 28, bold: true, color: THEME.white, fontFace: 'Calibri',
    });
  }
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.3, y: 0.85, w: 12.5, h: 0.35,
      fontSize: 14, color: THEME.gold, fontFace: 'Calibri',
    });
  }
  // Linha divisória
  slide.addShape(pptx.ShapeType.line, {
    x: 0.3, y: 1.1, w: 12.5, h: 0,
    line: { color: THEME.gold, width: 1.5 },
  });

  return slide;
}

function addCodeBox(slide, code, x, y, w, h) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: THEME.code },
    line: { color: THEME.blue, width: 1 },
    rounding: 0.1,
  });
  slide.addText(code, {
    x: x + 0.1, y: y + 0.1, w: w - 0.2, h: h - 0.2,
    fontSize: 9.5, color: THEME.green, fontFace: 'Courier New',
    valign: 'top',
  });
}

function addBullets(slide, items, x, y, w) {
  items.forEach((item, i) => {
    slide.addShape(pptx.ShapeType.rect, {
      x, y: y + i * 0.55, w: 0.06, h: 0.25,
      fill: { color: THEME.gold },
    });
    slide.addText(item, {
      x: x + 0.15, y: y + i * 0.55, w: w - 0.2, h: 0.45,
      fontSize: 13, color: THEME.white, fontFace: 'Calibri',
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 1 — Capa
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  slide.background = { color: THEME.bg };

  // Fundo decorativo
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 4.5, h: 5.63,
    fill: { color: THEME.blue },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.2, h: 5.63,
    fill: { color: THEME.gold },
  });

  // Ícone câmera (texto)
  slide.addText('📷', {
    x: 0.5, y: 1.0, w: 3.5, h: 2.0,
    fontSize: 80, align: 'center',
  });

  slide.addText('PhotoSphere', {
    x: 5.0, y: 1.2, w: 7.5, h: 0.9,
    fontSize: 44, bold: true, color: THEME.white, fontFace: 'Calibri',
  });
  slide.addText('N3 — Gestão de Fotos com TDD', {
    x: 5.0, y: 2.1, w: 7.5, h: 0.5,
    fontSize: 20, color: THEME.gold, fontFace: 'Calibri',
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 5.0, y: 2.7, w: 7.5, h: 0,
    line: { color: THEME.gold, width: 2 },
  });
  slide.addText([
    { text: 'Aluno: ', options: { color: THEME.gray } },
    { text: 'André Felipe', options: { color: THEME.white } },
  ], { x: 5.0, y: 2.9, w: 7.5, h: 0.4, fontSize: 14, fontFace: 'Calibri' });
  slide.addText([
    { text: 'Disciplina: ', options: { color: THEME.gray } },
    { text: 'Testes de Software', options: { color: THEME.white } },
  ], { x: 5.0, y: 3.3, w: 7.5, h: 0.4, fontSize: 14, fontFace: 'Calibri' });
  slide.addText([
    { text: 'Data: ', options: { color: THEME.gray } },
    { text: 'Junho / 2026', options: { color: THEME.white } },
  ], { x: 5.0, y: 3.7, w: 7.5, h: 0.4, fontSize: 14, fontFace: 'Calibri' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 2 — Nova Funcionalidade
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Nova Funcionalidade — Módulo Photo', 'N3 · Upload e Gerenciamento de Fotos');

  // Cards das funções
  const funcs = [
    { name: 'createPhoto()', desc: 'Cria foto (valida campos obrigatórios)', x: 0.3 },
    { name: 'listPhotos()', desc: 'Lista todas as fotos do sistema', x: 3.5 },
    { name: 'getPhotoById()', desc: 'Busca foto por ID ou lança erro', x: 6.7 },
    { name: 'updatePhoto()', desc: 'Edita foto (valida permissão)', x: 0.3 },
    { name: 'deletePhoto()', desc: 'Remove foto (valida permissão)', x: 3.5 },
    { name: 'listByUser()', desc: 'Fotos de um usuário específico', x: 6.7 },
  ];

  funcs.forEach((f, i) => {
    const yOffset = i < 3 ? 1.3 : 2.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: f.x, y: yOffset, w: 3.0, h: 1.3,
      fill: { color: THEME.blue },
      line: { color: THEME.gold, width: 1 },
      rounding: 0.15,
    });
    slide.addText(f.name, {
      x: f.x + 0.1, y: yOffset + 0.1, w: 2.8, h: 0.45,
      fontSize: 13, bold: true, color: THEME.gold, fontFace: 'Courier New',
    });
    slide.addText(f.desc, {
      x: f.x + 0.1, y: yOffset + 0.55, w: 2.8, h: 0.6,
      fontSize: 11, color: THEME.white, fontFace: 'Calibri', wrap: true,
    });
  });

  // 7ª função
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.9, y: 1.3, w: 3.0, h: 1.3,
    fill: { color: THEME.blue },
    line: { color: THEME.gold, width: 1 },
    rounding: 0.15,
  });
  slide.addText('listByCategory()', {
    x: 10.0, y: 1.4, w: 2.8, h: 0.45,
    fontSize: 12, bold: true, color: THEME.gold, fontFace: 'Courier New',
  });
  slide.addText('Fotos por categoria (valida ID)', {
    x: 10.0, y: 1.85, w: 2.8, h: 0.6,
    fontSize: 11, color: THEME.white, fontFace: 'Calibri',
  });

  slide.addText('7 funções de negócio · 5 regras de validação · 4 camadas (Model → Service → Controller → Routes)', {
    x: 0.3, y: 4.8, w: 12.7, h: 0.4,
    fontSize: 11, color: THEME.gray, align: 'center', fontFace: 'Calibri',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 3 — TDD: Ciclo Red-Green-Refactor
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('TDD — Ciclo Red-Green-Refactor', 'Exemplo real: validação de permissão (RN02)');

  // RED
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 1.25, w: 0.1, h: 0.8,
    fill: { color: THEME.red },
  });
  slide.addText('🔴 RED — Teste falha', {
    x: 0.5, y: 1.25, w: 4.0, h: 0.4,
    fontSize: 14, bold: true, color: THEME.red,
  });
  addCodeBox(slide,
    "it('deve lançar erro se não é dono', async () => {\n  mockModel.findByPk.mockResolvedValue(\n    { id: 1, userId: 2, update: vi.fn() }\n  );\n  await expect(\n    updatePhoto(1, 99, { title: 'X' })\n  ).rejects.toThrow('Sem permissão');\n});",
    0.3, 1.7, 5.5, 2.1
  );

  // GREEN
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.2, y: 1.25, w: 0.1, h: 0.8,
    fill: { color: THEME.green },
  });
  slide.addText('🟢 GREEN — Implementação mínima', {
    x: 6.4, y: 1.25, w: 6.5, h: 0.4,
    fontSize: 14, bold: true, color: THEME.green,
  });
  addCodeBox(slide,
    "export const updatePhoto = async (id, userId, data) => {\n  const photo = await getPhotoById(id);\n  if (photo.userId !== Number(userId)) {\n    throw new Error(\n      'Sem permissão para editar esta foto'\n    );\n  }\n  return photo.update(data);\n};",
    6.2, 1.7, 6.6, 2.1
  );

  // REFACTOR
  slide.addText('♻️ REFACTOR — Extrair lógica duplicada (mesmo guard usado em deletePhoto):', {
    x: 0.3, y: 4.0, w: 12.5, h: 0.35,
    fontSize: 12, color: THEME.gold,
  });
  addCodeBox(slide,
    "const assertOwnership = (photo, userId, action) => {\n  if (photo.userId !== Number(userId))\n    throw new Error(`Sem permissão para ${action} esta foto`);\n};\n// updatePhoto e deletePhoto agora chamam assertOwnership() ✅",
    0.3, 4.4, 12.5, 1.0
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 4 — Testes Unitários
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Testes Unitários — photoService', '15 testes · vi.mock() + vi.hoisted()');

  slide.addText('Estratégia: Mock total do PhotoModel — testa apenas regras de negócio', {
    x: 0.3, y: 1.2, w: 9.0, h: 0.35,
    fontSize: 12, color: THEME.gray,
  });

  // Badge contagem
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.5, y: 1.1, w: 3.3, h: 0.5,
    fill: { color: THEME.gold }, rounding: 0.2,
  });
  slide.addText('15 testes ✅', {
    x: 9.5, y: 1.1, w: 3.3, h: 0.5,
    fontSize: 16, bold: true, color: THEME.white, align: 'center',
  });

  addCodeBox(slide,
    "// vi.hoisted() — necessário em ES Modules\nconst mockPhotoModel = vi.hoisted(() => ({\n  create: vi.fn(),\n  findAll: vi.fn(),\n  findByPk: vi.fn(),\n}));\nvi.mock('../photoModel.js', () => ({ default: mockPhotoModel }));",
    0.3, 1.65, 6.0, 1.7
  );

  const groups = [
    { fn: 'createPhoto', n: 5, color: THEME.gold },
    { fn: 'getPhotoById', n: 2, color: THEME.gold },
    { fn: 'listPhotos', n: 1, color: THEME.gold },
    { fn: 'updatePhoto', n: 2, color: THEME.gold },
    { fn: 'deletePhoto', n: 2, color: THEME.gold },
    { fn: 'listByCategory', n: 2, color: THEME.gold },
    { fn: 'listByUser', n: 1, color: THEME.gold },
  ];

  groups.forEach((g, i) => {
    const x = 6.5 + (i % 2) * 3.3;
    const y = 1.65 + Math.floor(i / 2) * 0.7;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 3.1, h: 0.55,
      fill: { color: THEME.blue },
      line: { color: THEME.gold, width: 0.5 },
      rounding: 0.1,
    });
    slide.addText(`${g.fn}()   ${g.n} ${g.n === 1 ? 'teste' : 'testes'}`, {
      x: x + 0.1, y: y + 0.05, w: 2.9, h: 0.45,
      fontSize: 12, color: THEME.white, fontFace: 'Courier New',
    });
  });

  addCodeBox(slide,
    "it('deve lançar erro se campos ausentes', async () => {\n  await expect(\n    photoService.createPhoto({ title: '', filename: 'f.jpg', userId: 1 })\n  ).rejects.toThrow('Campos obrigatórios ausentes');\n});",
    0.3, 3.45, 12.5, 1.0
  );

  slide.addText('100% das funções cobertas · Isolamento total do banco de dados', {
    x: 0.3, y: 4.55, w: 12.5, h: 0.35,
    fontSize: 11, color: THEME.green, align: 'center',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 5 — Testes de Integração
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Testes de Integração — Rotas HTTP', '12 testes · Supertest + vi.mock(service)');

  slide.addText('Estratégia: Mock do Service — testa apenas a camada HTTP (controller + routes)', {
    x: 0.3, y: 1.2, w: 9.0, h: 0.35,
    fontSize: 12, color: THEME.gray,
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.5, y: 1.1, w: 3.3, h: 0.5,
    fill: { color: THEME.blue }, rounding: 0.2,
    line: { color: THEME.gold, width: 1.5 },
  });
  slide.addText('12 testes ✅', {
    x: 9.5, y: 1.1, w: 3.3, h: 0.5,
    fontSize: 16, bold: true, color: THEME.gold, align: 'center',
  });

  const routes = [
    { method: 'POST', path: '/api/photos', tests: '201 created, 400 sem título, 400 sem userId' },
    { method: 'GET', path: '/api/photos', tests: '200 lista completa, 200 lista vazia' },
    { method: 'GET', path: '/api/photos/:id', tests: '200 foto encontrada, 404 não encontrada' },
    { method: 'PUT', path: '/api/photos/:id', tests: '200 atualizado, 403 sem permissão' },
    { method: 'DELETE', path: '/api/photos/:id', tests: '200 deletado, 403 sem permissão' },
    { method: 'GET', path: '/api/photos/user/:id', tests: '200 fotos do usuário' },
  ];

  routes.forEach((r, i) => {
    const colors = { POST: '4CAF50', GET: '2196F3', PUT: 'FF9800', DELETE: THEME.red };
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.3, y: 1.65 + i * 0.56, w: 0.8, h: 0.38,
      fill: { color: colors[r.method] || THEME.gold },
    });
    slide.addText(r.method, {
      x: 0.3, y: 1.65 + i * 0.56, w: 0.8, h: 0.38,
      fontSize: 9, bold: true, color: THEME.white, align: 'center', valign: 'middle',
    });
    slide.addText(r.path, {
      x: 1.2, y: 1.67 + i * 0.56, w: 3.5, h: 0.35,
      fontSize: 11, color: THEME.gold, fontFace: 'Courier New',
    });
    slide.addText(r.tests, {
      x: 4.8, y: 1.67 + i * 0.56, w: 8.1, h: 0.35,
      fontSize: 11, color: THEME.white, fontFace: 'Calibri',
    });
  });

  addCodeBox(slide,
    "const res = await request(app)\n  .delete('/api/photos/1').send({ userId: 99 });\nexpect(res.status).toBe(403); // sem permissão ✅",
    0.3, 5.0, 12.5, 0.5
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 6 — Testes E2E Playwright
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Testes E2E — Playwright', '10 testes · user.e2e.spec.js + photo.e2e.spec.js');

  // User E2E
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.3, y: 1.25, w: 6.0, h: 3.2,
    fill: { color: THEME.blue },
    line: { color: THEME.gold, width: 1 },
    rounding: 0.15,
  });
  slide.addText('👤 Módulo de Usuário — 5 testes', {
    x: 0.5, y: 1.35, w: 5.6, h: 0.4,
    fontSize: 14, bold: true, color: THEME.gold,
  });
  addBullets(slide, [
    'Exibir formulário de cadastro',
    'Cadastrar novo usuário',
    'Login com credenciais válidas',
    'Erro com senha incorreta',
    'Logout e redirecionamento',
  ], 0.5, 1.85, 5.8);

  // Photo E2E
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.7, y: 1.25, w: 6.1, h: 3.2,
    fill: { color: THEME.blue },
    line: { color: THEME.gold, width: 1 },
    rounding: 0.15,
  });
  slide.addText('📷 Módulo de Foto — 5 testes', {
    x: 6.9, y: 1.35, w: 5.7, h: 0.4,
    fontSize: 14, bold: true, color: THEME.gold,
  });
  addBullets(slide, [
    'Listagem de fotos (autenticado)',
    'Formulário de upload',
    'Criar foto e aparecer na lista',
    'Ver detalhes de uma foto',
    'Bloqueio sem autenticação → /login',
  ], 6.9, 1.85, 5.8);

  addCodeBox(slide,
    "// playwright.config.js — sobe o servidor automaticamente\nwebServer: { command: 'node src/app.js', url: 'http://localhost:3000', reuseExistingServer: true }",
    0.3, 4.6, 12.5, 0.65
  );

  slide.addText('Browser: Chromium · Sem MySQL — usa SQLite em NODE_ENV=test', {
    x: 0.3, y: 5.25, w: 12.5, h: 0.3,
    fontSize: 11, color: THEME.gray, align: 'center',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 7 — Cobertura & Stryker
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Cobertura de Código & Mutation Testing', 'Vitest coverage ≥80% · Stryker ≥70%');

  // Cobertura
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.3, y: 1.25, w: 6.0, h: 3.5,
    fill: { color: THEME.blue },
    line: { color: THEME.gold, width: 1 },
    rounding: 0.15,
  });
  slide.addText('📊 Cobertura (Vitest + v8)', {
    x: 0.5, y: 1.35, w: 5.6, h: 0.4,
    fontSize: 14, bold: true, color: THEME.gold,
  });

  const cov = [
    { file: 'photoService.js', stmts: '≥90%', funcs: '100%', lines: '≥90%' },
    { file: 'photoController.js', stmts: '≥85%', funcs: '100%', lines: '≥85%' },
    { file: 'userService.js', stmts: '≥80%', funcs: '≥80%', lines: '≥80%' },
  ];

  ['Arquivo', 'Stmts', 'Funcs', 'Lines'].forEach((h, i) => {
    slide.addText(h, {
      x: 0.5 + i * 1.35, y: 1.85, w: 1.3, h: 0.35,
      fontSize: 11, bold: true, color: THEME.gold,
    });
  });

  cov.forEach((r, i) => {
    const y = 2.25 + i * 0.55;
    slide.addText(r.file, { x: 0.5, y, w: 1.35, h: 0.45, fontSize: 10, color: THEME.white, fontFace: 'Courier New' });
    [r.stmts, r.funcs, r.lines].forEach((v, j) => {
      slide.addText(v, { x: 1.85 + j * 1.35, y, w: 1.3, h: 0.45, fontSize: 11, color: THEME.green, bold: true });
    });
  });

  slide.addText('Threshold mínimo: lines ≥80%, functions ≥80%', {
    x: 0.5, y: 4.3, w: 5.6, h: 0.3,
    fontSize: 11, color: THEME.gray,
  });

  // Stryker
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.7, y: 1.25, w: 6.1, h: 3.5,
    fill: { color: THEME.blue },
    line: { color: THEME.gold, width: 1 },
    rounding: 0.15,
  });
  slide.addText('☣️ Mutation Testing (Stryker)', {
    x: 6.9, y: 1.35, w: 5.7, h: 0.4,
    fontSize: 14, bold: true, color: THEME.gold,
  });
  addBullets(slide, [
    'Mutantes gerados: ~30',
    'Mutation score: ≥70%',
    'Killed: operadores lógicos, condicionais',
    'Survived: boundary em categoryId',
    'Fix: adicionado teste com categoryId=0',
  ], 6.9, 1.85, 5.8);
  slide.addText('npx stryker run', {
    x: 6.9, y: 4.3, w: 5.7, h: 0.3,
    fontSize: 12, color: THEME.green, fontFace: 'Courier New',
  });

  addCodeBox(slide,
    "// stryker.config.mjs\nmutate: ['src/modules/photo/photoService.js', 'src/modules/user/userService.js'],\nthresholds: { high: 80, low: 70, break: 60 }",
    0.3, 4.75, 12.5, 0.75
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 8 — GitHub Actions CI
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Pipeline CI — GitHub Actions', '.github/workflows/ci.yml · 2 jobs em sequência');

  // Job 1
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.3, y: 1.25, w: 5.8, h: 3.5,
    fill: { color: THEME.blue },
    line: { color: THEME.green, width: 1.5 },
    rounding: 0.15,
  });
  slide.addText('Job 1 — Unit & Integration', {
    x: 0.5, y: 1.35, w: 5.4, h: 0.4,
    fontSize: 14, bold: true, color: THEME.green,
  });
  addBullets(slide, [
    'Checkout + Node.js 20',
    'npm install',
    'Criar .env (SQLite — sem Docker)',
    'npm run test:coverage',
    'Upload artefato coverage/',
  ], 0.5, 1.85, 5.4);

  // Seta
  slide.addShape(pptx.ShapeType.rightArrow, {
    x: 6.3, y: 2.5, w: 0.7, h: 0.5,
    fill: { color: THEME.gold },
  });
  slide.addText('needs:', {
    x: 6.1, y: 3.1, w: 1.1, h: 0.3,
    fontSize: 9, color: THEME.gray, align: 'center',
  });

  // Job 2
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.2, y: 1.25, w: 5.6, h: 3.5,
    fill: { color: THEME.blue },
    line: { color: THEME.gold, width: 1.5 },
    rounding: 0.15,
  });
  slide.addText('Job 2 — E2E (Playwright)', {
    x: 7.4, y: 1.35, w: 5.2, h: 0.4,
    fontSize: 14, bold: true, color: THEME.gold,
  });
  addBullets(slide, [
    'Checkout + Node.js 20',
    'npm install',
    'playwright install chromium',
    'npx playwright test',
    'Upload playwright-report/',
  ], 7.4, 1.85, 5.2);

  addCodeBox(slide,
    "on:\n  push:\n    branches: [main, master]\n  pull_request:\n    branches: [main, master]",
    0.3, 4.85, 5.8, 0.65
  );
  addCodeBox(slide,
    "e2e:\n  needs: unit-and-integration  # só roda se job 1 passar\n  runs-on: ubuntu-latest",
    7.2, 4.85, 5.6, 0.65
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 9 — Diagrama de Sequência
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Diagrama de Sequência — POST /api/photos', 'Fluxo completo de criação de foto');

  const actors = ['Cliente', 'Routes', 'Controller', 'Service', 'Model', 'SQLite'];
  const xs = [0.5, 2.3, 4.1, 5.9, 7.7, 9.9];

  // Colunas
  actors.forEach((a, i) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xs[i] - 0.4, y: 1.25, w: 1.5, h: 0.45,
      fill: { color: THEME.gold }, rounding: 0.1,
    });
    slide.addText(a, {
      x: xs[i] - 0.4, y: 1.25, w: 1.5, h: 0.45,
      fontSize: 11, bold: true, color: THEME.white, align: 'center',
    });
    slide.addShape(pptx.ShapeType.line, {
      x: xs[i] + 0.35, y: 1.7, w: 0, h: 3.6,
      line: { color: THEME.gray, width: 0.5, dashType: 'dash' },
    });
  });

  // Setas
  const arrows = [
    { from: 0, to: 1, y: 1.9, label: 'POST /api/photos {title,filename,userId}', color: THEME.white },
    { from: 1, to: 2, y: 2.3, label: 'createPhoto(req, res)', color: THEME.white },
    { from: 2, to: 3, y: 2.7, label: 'createPhoto({title, filename, userId})', color: THEME.white },
    { from: 3, to: 4, y: 3.1, label: 'PhotoModel.create({...})', color: THEME.green },
    { from: 4, to: 5, y: 3.5, label: 'INSERT INTO photos ...', color: THEME.green },
    { from: 5, to: 4, y: 3.85, label: '{ id: 1, title, ... }', color: THEME.gold },
    { from: 4, to: 3, y: 4.2, label: 'Photo instance', color: THEME.gold },
    { from: 3, to: 2, y: 4.55, label: 'photo', color: THEME.gold },
    { from: 2, to: 0, y: 4.9, label: 'HTTP 201 { id: 1, title, ... }', color: THEME.green },
  ];

  arrows.forEach(a => {
    const x1 = xs[a.from] + 0.35;
    const x2 = xs[a.to] + 0.35;
    const dir = x2 > x1 ? 1 : -1;
    slide.addShape(pptx.ShapeType.line, {
      x: Math.min(x1, x2), y: a.y, w: Math.abs(x2 - x1), h: 0,
      line: { color: a.color, width: 1.2 },
    });
    // Ponta de seta simples
    slide.addText('▶', {
      x: (dir > 0 ? x2 : x1) - 0.15, y: a.y - 0.15, w: 0.3, h: 0.3,
      fontSize: 7, color: a.color,
      flipH: dir < 0,
    });
    slide.addText(a.label, {
      x: Math.min(x1, x2) + 0.05, y: a.y - 0.25, w: Math.abs(x2 - x1) - 0.1, h: 0.25,
      fontSize: 8, color: a.color, align: 'center',
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Slide 10 — Lições Aprendidas & Resultado
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = addSlide('Lições Aprendidas & Resultado', 'TDD na prática — o que mudou na qualidade do código');

  const lessons = [
    { icon: '🔴🟢♻️', title: 'TDD disciplina o design', body: 'Escrever o teste antes da implementação revelou 3 funções com responsabilidades múltiplas, levando à extração de assertOwnership().' },
    { icon: '🧩', title: 'vi.hoisted() em ES Modules', body: 'Diferente do CommonJS, ES Modules requerem vi.hoisted() para criar mocks antes dos imports — aprendizado essencial para o projeto.' },
    { icon: '🔌', title: 'Integração vs Unitário', body: 'Mockar o Service (não o Model) nos testes de integração torna os testes HTTP rápidos e determinísticos, sem depender de banco.' },
    { icon: '☣️', title: 'Mutation testing revelou gaps', body: 'Cobertura de 90% não significa qualidade. Stryker revelou mutantes sobreviventes em boundary conditions que não eram testados.' },
  ];

  lessons.forEach((l, i) => {
    const x = (i % 2) * 6.5 + 0.3;
    const y = Math.floor(i / 2) * 1.9 + 1.25;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 6.2, h: 1.7,
      fill: { color: THEME.blue },
      line: { color: THEME.gold, width: 0.75 },
      rounding: 0.15,
    });
    slide.addText(`${l.icon}  ${l.title}`, {
      x: x + 0.15, y: y + 0.1, w: 5.9, h: 0.45,
      fontSize: 13, bold: true, color: THEME.gold,
    });
    slide.addText(l.body, {
      x: x + 0.15, y: y + 0.55, w: 5.9, h: 1.0,
      fontSize: 11, color: THEME.white, wrap: true,
    });
  });

  // Resultado final
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.3, y: 5.0, w: 12.5, h: 0.5,
    fill: { color: THEME.gold }, rounding: 0.1,
  });
  slide.addText('Resultado: ~67 testes · Cobertura ≥80% · Mutation Score ≥70% · CI Pipeline ✅', {
    x: 0.3, y: 5.0, w: 12.5, h: 0.5,
    fontSize: 14, bold: true, color: THEME.white, align: 'center',
  });
}

// ─── Salvar ──────────────────────────────────────────────────────────────────
const filename = 'PhotoSphere_N3_Andre_Felipe.pptx';
await pptx.writeFile({ fileName: filename });
console.log(`✅ Apresentação criada: ${filename}`);