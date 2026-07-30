import { expect, test } from '@playwright/test';

test('el asistente local usa Ollama y exige autenticación', async ({ request }) => {
  const unauthorized = await request.get('/api/ai/status');
  expect(unauthorized.status()).toBe(401);

  const loginResponse = await request.post('/api/auth/login', {
    data: { correo: 'ceandrade@espe.edu.ec', password: 'espe2026' },
  });
  expect(loginResponse.ok()).toBeTruthy();
  const token = (await loginResponse.json()).token;
  const headers = { Authorization: `Bearer ${token}` };

  const statusResponse = await request.get('/api/ai/status', { headers });
  const statusBody = await statusResponse.json();
  test.skip(statusBody.available !== true, 'Ollama no está disponible en este entorno');

  expect(statusBody).toEqual({
    available: true,
    model: 'qwen2.5:0.5b',
    local: true,
  });

  const chatResponse = await request.post('/api/ai/chat', {
    headers,
    data: { question: '¿Cómo puedo reservar un espacio académico?', history: [] },
    timeout: 90_000,
  });
  expect(chatResponse.ok()).toBeTruthy();
  const body = await chatResponse.json();
  expect(body.model).toBe('qwen2.5:0.5b');
  expect(body.local).toBe(true);
  expect(body.answer.length).toBeGreaterThan(10);
});

test('muestra el acceso visual al asistente después de iniciar sesión', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Correo institucional').fill('ceandrade@espe.edu.ec');
  await page.getByLabel('Contraseña').fill('espe2026');
  await page.getByRole('button', { name: /acceder al sistema/i }).click();

  await page.getByRole('button', { name: /abrir asistente/i }).click();
  await expect(page.getByRole('heading', { name: /asistente ESPEConnect/i })).toBeVisible();
  await expect(page.getByText(/qwen2\.5:0\.5b · local/i)).toBeVisible({ timeout: 15_000 });
});
