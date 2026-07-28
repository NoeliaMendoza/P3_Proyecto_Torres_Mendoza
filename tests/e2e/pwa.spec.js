import { expect, test } from '@playwright/test';

test('expone un manifest instalable con iconos válidos', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();

  expect(manifest.name).toContain('ESPEConnect');
  expect(manifest.display).toBe('standalone');
  expect(manifest.lang).toBe('es');
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192' }),
    expect.objectContaining({ sizes: '512x512' }),
    expect.objectContaining({ purpose: 'maskable' }),
  ]));

  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).ok()).toBeTruthy();
  }
});

test('registra y activa el service worker', async ({ page }) => {
  await page.goto('/');
  const active = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return Boolean(registration.active);
  });
  expect(active).toBeTruthy();
});

test('la aplicación abre sin internet después de la primera carga', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveTitle(/ESPEConnect/);
  await expect(page.getByText(/sin conexión/i)).toBeVisible();
  await context.setOffline(false);
});

test('el contenedor frontend comunica con el backend mediante el proxy', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ status: 'ok' });
});

test('autentica contra PostgreSQL y accede a una ruta privada', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[type="email"]').first().fill('ceandrade@espe.edu.ec');
  await page.locator('input[type="password"]').fill('espe2026');
  await page.getByRole('button', { name: /acceder al sistema/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token'))).not.toBeNull();
});
