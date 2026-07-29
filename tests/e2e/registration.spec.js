import { expect, test } from '@playwright/test';

test('muestra validaciones específicas en el formulario de registro', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /regístrate/i }).click();

  await page.getByLabel('Nombre completo').fill('Ana');
  await page.getByLabel('Correo institucional').fill('ana@gmail.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('123');
  await page.getByLabel('Confirmar contraseña').fill('456');
  await page.getByRole('button', { name: /crear cuenta/i }).click();

  await expect(page.getByText(/nombre y un apellido/i)).toBeVisible();
  await expect(page.getByText(/terminado en @espe\.edu\.ec/i)).toBeVisible();
  await expect(page.getByText(/todavía no cumple/i)).toBeVisible();
  await expect(page.getByText(/no coinciden/i)).toBeVisible();
  await expect(page.getByText(/debes aceptar los términos/i)).toBeVisible();
});

test('el backend normaliza el correo y exige verificación antes de iniciar sesión', async ({ request }) => {
  const uniqueEmail = `prueba.${Date.now()}@espe.edu.ec`;
  const response = await request.post('/api/auth/register', {
    data: {
      nombre: 'Usuario de Prueba',
      correo: `  ${uniqueEmail.toUpperCase()}  `,
      password: 'Segura#2026',
      rol: 'admin',
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.requiere_verificacion).toBe(true);

  const loginResponse = await request.post('/api/auth/login', {
    data: { correo: uniqueEmail, password: 'Segura#2026' },
  });
  expect(loginResponse.status()).toBe(403);
  expect((await loginResponse.json()).codigo).toBe('EMAIL_NO_VERIFICADO');
});

test('el docente visualiza su horario y puede colocar una materia disponible', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Correo institucional').fill('kjchuquitarko@espe.edu.ec');
  await page.getByLabel('ContraseÃ±a').fill('docente2026');
  await page.getByRole('button', { name: /acceder al sistema/i }).click();

  await page.goto('/horarios');
  await expect(page.getByRole('heading', { name: /mi horario docente/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /colocar materia/i })).toBeVisible();
});
