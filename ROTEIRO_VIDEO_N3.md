# Roteiro — Vídeo N3 (mínimo 8 minutos)
# PhotoSphere — Testes de Software

---

## Checklist antes de gravar

- [ ] VS Code aberto com o projeto PhotoSphere
- [ ] Terminal aberto na pasta do projeto
- [ ] Resolução da tela em 1920x1080 (ou compartilhamento de janela)
- [ ] Fonte grande no terminal e no editor (Ctrl + = para aumentar)
- [ ] Fechar notificações e apps desnecessários

---

## PARTE 1 — Introdução (0:00 – 0:45)

**Fala:**
> "Olá, meu nome é André Felipe. Neste vídeo vou demonstrar a entrega da N3 de Testes de Software do projeto PhotoSphere.
> O projeto é uma plataforma de compartilhamento de fotos feita em Node.js com Express e Sequelize.
> Na N2 eu implementei o módulo de Usuários. Na N3, implementei o módulo de Fotos — incluindo upload, listagem, edição e remoção — seguindo rigorosamente o ciclo TDD: Red, Green, Refactor.
> Vou mostrar agora os testes rodando e explicar como funciona cada camada."

---

## PARTE 2 — Testes Unitários e de Integração no terminal (0:45 – 2:30)

**Ação:** Abrir o terminal integrado do VS Code.

**Digitar e executar:**
```
npm test
```

**Enquanto os testes rodam, falar:**
> "Aqui estou rodando todos os testes unitários e de integração com o Vitest.
> Veja que temos 7 suítes de teste — cobrindo os módulos de Foto, Usuário, Categoria e Comentário.
> No total são 83 testes passando."

**Quando aparecer o resultado (83 passed), apontar para a tela:**
> "Todos os 83 testes passam em menos de 2 segundos. Zero falhas."

**Agora executar:**
```
npm run test:coverage
```

**Enquanto roda:**
> "Agora com cobertura de código. O Vitest mede quantas linhas e funções do código de produção são exercitadas pelos testes."

**Quando aparecer a tabela, apontar:**
> "Aqui estão as métricas. O módulo de Fotos — que é a nova funcionalidade da N3 — tem 89% de cobertura de linhas e 100% de funções cobertas. O módulo de Usuários está em 100%. Ambos bem acima do mínimo de 80% exigido."

---

## PARTE 3 — Passeio pelo código dos testes (2:30 – 4:30)

**Ação:** Abrir no VS Code o arquivo `src/modules/photo/__tests__/photoService.test.js`

**Falar:**
> "Esse é o arquivo de testes unitários do módulo Photo. Ele tem 15 testes que testam diretamente a camada Service, sem tocar no banco de dados — tudo isolado com mocks."

**Mostrar o bloco `vi.hoisted()` no topo:**
> "Aqui está o padrão `vi.hoisted()` — necessário no ES Modules para criar os mocks antes do import ser resolvido. O mock substitui o `PhotoModel` completamente, simulando o banco."

**Mostrar um teste de sucesso, ex: 'deve criar foto com dados validos':**
> "Este é o ciclo Red-Green-Refactor em prática. Primeiro escrevi esse teste, ele falhou — Red. Depois implementei o `createPhoto` no service — Green. Por fim refatorei extraindo a validação — Refactor."

**Abrir `src/modules/photo/__tests__/photoRoutes.test.js`:**
> "Agora os testes de integração. Aqui uso o Supertest para fazer requisições HTTP reais contra o Express — sem Playwright, sem browser. São 14 testes cobrindo todas as rotas do módulo Photo."

**Mostrar o `vi.mock('../photoService.js')` no topo:**
> "Aqui está a diferença do teste de integração para o unitário: eu moco a camada Service, não o Model. Isso me deixa testar o Controller e as rotas sem precisar de banco de dados."

**Mostrar um teste de 201 e um de 403:**
> "Esse verifica status 201 com dados válidos. Esse verifica 403 quando o usuário tenta editar uma foto que não é dele — regra de negócio RN02."

---

## PARTE 4 — Testes E2E com Playwright (4:30 – 6:30)

**Ação:** Abrir `tests-e2e/photo.e2e.spec.js`

**Falar:**
> "Agora os testes End-to-End com Playwright. Esses testes simulam um usuário real usando o navegador — sem mocks, contra o app rodando de verdade."

### Explicação do Teste E2E 1 — Redirecionamento sem autenticação

**Apontar para o teste:**
```javascript
test('deve redirecionar para login ao acessar fotos sem autenticacao', async ({ page }) => {
  await page.goto('/photos');
  await expect(page).toHaveURL(/login/);
});
```

**Falar linha por linha:**
> "`page.goto('/photos')` — o Playwright navega para a rota de listagem de fotos, como se um usuário digitasse o endereço no navegador.
> `expect(page).toHaveURL(/login/)` — verifica que a URL mudou para algo contendo 'login', porque o sistema deve redirecionar quem não está autenticado.
> Esse teste cobre o fluxo de segurança mais importante: proteger rotas privadas."

**Mostrar qual código de produção é acionado:**
> "No código de produção, quando alguém acessa GET /api/photos sem sessão, o middleware de autenticação em `photoRoutes.js` bloqueia a requisição e redireciona. Esse é o fluxo testado."

### Explicação do Teste E2E 2 — Formulário de upload

**Apontar para o teste:**
```javascript
test('deve exibir o formulario de upload de foto', async ({ page }) => {
  await login(page);
  await page.goto('/photos/upload');
  await expect(page.locator('input[name="title"], input#title')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
```

**Falar linha por linha:**
> "`await login(page)` — primeiro chama a função helper que preenche email e senha e clica em entrar. É o pré-requisito para acessar páginas protegidas.
> `page.goto('/photos/upload')` — navega para o formulário de upload.
> `page.locator(...)` — localiza elementos HTML pelo seletor CSS. Uso múltiplos seletores separados por vírgula para ser resiliente a diferentes implementações de front-end.
> `.toBeVisible()` — verifica que o elemento está visível na tela.
> Esse teste valida o happy path de upload: o formulário existe e está acessível para usuários logados."

**Abrir `src/modules/photo/photoRoutes.js` no editor:**
> "Quando o Playwright faz GET /photos/upload, essa rota aqui é acionada. O controller chama o service, que pode renderizar uma view ou retornar JSON dependendo da implementação de front-end."

---

## PARTE 5 — Estrutura do projeto e encerramento (6:30 – 8:00)

**Ação:** Mostrar a estrutura de pastas no Explorer do VS Code

**Falar:**
> "Aqui está a estrutura modular do projeto. Cada módulo — photo, user, category, comment — tem seu Model, Service, Controller, Routes e pasta de testes isolada.
> Essa separação é o que torna o TDD possível: cada camada é testável de forma independente."

**Mostrar rapidamente o ci.yml:**
> "Por fim, o pipeline de CI com GitHub Actions. A cada push, ele roda automaticamente todos os testes unitários e de integração. O job de E2E também está configurado com MySQL via Docker, conforme exigido."

**Encerramento:**
> "O projeto PhotoSphere tem 83 testes passando, cobertura de 89% no módulo de Fotos e 100% no módulo de Usuários, testes E2E com Playwright, e pipeline de CI configurado no GitHub.
> A metodologia TDD guiou todo o desenvolvimento da N3 — os testes foram escritos primeiro, depois o código mínimo para passá-los, e por fim o refactor.
> Obrigado."

---

## Dicas de gravação

- Use OBS Studio ou Loom (gratuitos) para gravar tela + microfone
- Fale devagar — 8 minutos com conteúdo real é mais que suficiente
- Se travar, pause, respire, continue — não precisa regravar tudo
- Ao fim, faça upload no YouTube (não listado) ou OneDrive e copie o link
