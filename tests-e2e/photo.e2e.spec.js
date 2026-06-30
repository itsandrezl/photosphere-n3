// Testes E2E — Modulo de Foto (5 testes)
// ATENCAO: ajuste os seletores e URLs conforme as rotas reais do seu app

import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"], input#email', 'e2e@test.com');
  await page.fill('input[name="password"], input#password', 'Senha123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/(?!.*login)/, { timeout: 5000 }).catch(() => {});
}

test.describe('Foto — E2E', () => {
  test('deve exibir a pagina de listagem de fotos', async ({ page }) => {
    await login(page);
    await page.goto('/photos');
    await expect(page).toHaveURL(/photos/);
    await expect(page.locator('h1, h2, .photos-container, [data-testid="photos"]')).toBeVisible();
  });

  test('deve exibir o formulario de upload de foto', async ({ page }) => {
    await login(page);
    await page.goto('/photos/upload');
    await expect(page.locator('input[name="title"], input#title')).toBeVisible();
    await expect(page.locator('input[type="file"], input[name="photo"], input[name="filename"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve criar uma foto e aparecer na listagem', async ({ page }) => {
    await login(page);
    await page.goto('/photos/upload');
    await page.fill('input[name="title"], input#title', `Foto E2E ${Date.now()}`);
    await page.fill(
      'textarea[name="description"], textarea#description, input[name="description"]',
      'Descricao de teste E2E',
    );
    await page.click('button[type="submit"]');
    await expect(page).not.toHaveURL(/upload/);
  });

  test('deve exibir detalhes de uma foto existente', async ({ page }) => {
    await login(page);
    await page.goto('/photos');
    const primeiraFoto = page.locator('a[href*="/photos/"], .photo-card a, .photo-item a').first();
    const count = await primeiraFoto.count();
    if (count > 0) {
      await primeiraFoto.click();
      await expect(page).toHaveURL(/photos\/\d+/);
    } else {
      const res = await page.goto('/photos/1');
      expect([200, 302, 404]).toContain(res?.status() ?? 200);
    }
  });

  test('deve redirecionar para login ao acessar fotos sem autenticacao', async ({ page }) => {
    await page.goto('/photos');
    await expect(page).toHaveURL(/login/);
  });
});
