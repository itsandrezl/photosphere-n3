import { test, expect } from '@playwright/test';

const TEST_USER = {
  name: 'E2E User',
  email: `e2e_${Date.now()}@test.com`,
  password: 'Senha123',
};

test.describe('Usuário — E2E', () => {
  test('deve exibir o formulário de cadastro', async ({ page }) => {
    // Ajuste a rota se for diferente (ex: /auth/register, /users/register)
    await page.goto('/register');

    await expect(page.locator('input[name="name"], input#name')).toBeVisible();
    await expect(page.locator('input[name="email"], input#email')).toBeVisible();
    await expect(page.locator('input[name="password"], input#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve cadastrar novo usuário com sucesso', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="name"], input#name', TEST_USER.name);
    await page.fill('input[name="email"], input#email', TEST_USER.email);
    await page.fill('input[name="password"], input#password', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Após cadastro deve ir para login ou dashboard
    await expect(page).toHaveURL(/login|dashboard|home|\/$/);
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"], input#email', TEST_USER.email);
    await page.fill('input[name="password"], input#password', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Após login deve sair da página de login
    await expect(page).not.toHaveURL(/login/);
  });

  test('deve mostrar erro ao fazer login com senha errada', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"], input#email', TEST_USER.email);
    await page.fill('input[name="password"], input#password', 'senhaErrada999');
    await page.click('button[type="submit"]');

    // Permanece no login e exibe mensagem de erro
    // Ajuste o seletor conforme o HTML do seu app
    const erro = page.locator('.error, .alert, .alert-danger, [class*="error"], [class*="alert"]');
    await expect(erro.first()).toBeVisible();
  });

  test('deve fazer logout e redirecionar para login', async ({ page }) => {
    // Login primeiro
    await page.goto('/login');
    await page.fill('input[name="email"], input#email', TEST_USER.email);
    await page.fill('input[name="password"], input#password', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Logout — ajuste o seletor/rota conforme seu app
    await page.click('a[href="/logout"], a[href="/auth/logout"], #logout-btn, .logout-link');
    await expect(page).toHaveURL(/login|\//);
  });
});