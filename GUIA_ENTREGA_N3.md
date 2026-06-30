# Guia de Entrega N3 — Nota 9
# PhotoSphere — Testes de Software

---

## PASSO 1 — Gerar a pasta coverage/ (obrigatória na entrega)

No terminal, dentro da pasta do projeto:
```
npm run test:coverage
```
Isso cria/atualiza a pasta `coverage/` com o relatório HTML. Ela deve ir no ZIP.

---

## PASSO 2 — Subir o projeto no GitHub

### 2a. Criar o repositório no GitHub
1. Acesse github.com e faça login
2. Clique em **New repository** (botão verde no canto superior direito)
3. Nome sugerido: `photosphere-n3`
4. Marque como **Public**
5. Não marque nenhuma opção de inicializar (sem README, sem .gitignore)
6. Clique em **Create repository**

### 2b. Subir o código (no terminal do projeto)
```bash
git init
git add .
git commit -m "feat: N3 completo - modulo Photo com TDD, E2E, CI"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/photosphere-n3.git
git push -u origin main
```
> Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

### 2c. Verificar se o CI rodou
1. Acesse seu repositório no GitHub
2. Clique na aba **Actions**
3. Aguarde o workflow "CI — PhotoSphere" aparecer (demora ~2-3 min)
4. O job **Unit & Integration Tests** deve mostrar ✅ verde
5. O job **E2E Tests** pode mostrar aviso amarelo — normal (app sem frontend HTML)
6. O ícone geral do workflow deve ser ✅

---

## PASSO 3 — Criar o ZIP para entrega

### O que INCLUIR no ZIP:
```
photosphere-n3/
├── .github/
│   └── workflows/
│       └── ci.yml
├── coverage/              ← pasta gerada pelo test:coverage
├── src/
├── tests-e2e/
├── RELATORIO_N3.md
├── PhotoSphere_N3_Andre_Felipe.pptx
├── package.json
├── package-lock.json
├── vitest.config.js
├── playwright.config.js
├── stryker.config.mjs     ← se existir
└── .env.example           ← se quiser (opcional)
```

### O que NÃO incluir:
- `node_modules/` ← NUNCA (arquivo enorme, desnecessário)
- `.env` ← contém senhas
- `playwright-report/` ← opcional

### Como criar o ZIP no Windows:
1. Navegue até a pasta pai do projeto (onde está a pasta `Projeto - PhotoSphere`)
2. Clique com botão direito na pasta do projeto
3. Selecione **Compactar para arquivo ZIP**
4. Renomeie o ZIP para: `PhotoSphere_N3_Andre_Felipe.zip`

---

## PASSO 4 — Gravar e subir o vídeo

1. Siga o arquivo `ROTEIRO_VIDEO_N3.md` para gravar o vídeo (mínimo 8 min)
2. Use OBS Studio ou Loom para gravar tela + voz
3. Após gravar, faça upload em uma das opções:
   - **YouTube**: Vídeo não listado → copie o link
   - **OneDrive**: Compartilhe com "Qualquer pessoa com o link" → copie o link
4. Guarde o link — vai precisar na entrega

---

## PASSO 5 — Submeter no Microsoft Teams

1. Acesse o Teams da disciplina
2. Vá em **Atividades** → **N3**
3. Clique em **Entregar**
4. Anexe o arquivo: `PhotoSphere_N3_Andre_Felipe.zip`
5. No campo de texto/comentário, cole:
   ```
   Repositório GitHub: https://github.com/SEU_USUARIO/photosphere-n3
   Vídeo: [link do YouTube ou OneDrive]
   ```
6. Clique em **Enviar**

---

## Checklist final antes de enviar

- [ ] `npm test` roda sem erros (83 testes passando)
- [ ] `npm run test:coverage` gera pasta `coverage/` sem erros de threshold
- [ ] Pasta `coverage/` está presente no ZIP
- [ ] `RELATORIO_N3.md` está no ZIP
- [ ] `PhotoSphere_N3_Andre_Felipe.pptx` está no ZIP
- [ ] `.github/workflows/ci.yml` está no ZIP
- [ ] `tests-e2e/` com os 2 arquivos E2E está no ZIP
- [ ] `node_modules/` NÃO está no ZIP
- [ ] GitHub Actions mostra ✅ verde (job Unit & Integration)
- [ ] URL do repositório GitHub anotada
- [ ] Link do vídeo (≥8 min) anotado
- [ ] Entregue no Teams antes de amanhã às 23:59
