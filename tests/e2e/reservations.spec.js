import { expect, test } from '@playwright/test';

test('rechaza una segunda reserva que se superpone con una reserva activa', async ({ request }) => {
  const loginResponse = await request.post('/api/auth/login', {
    data: { correo: 'ceandrade@espe.edu.ec', password: 'espe2026' },
  });
  expect(loginResponse.ok()).toBeTruthy();
  const { token } = await loginResponse.json();
  const headers = { Authorization: `Bearer ${token}` };

  const spacesResponse = await request.get('/api/espacios', { headers });
  expect(spacesResponse.ok()).toBeTruthy();
  const spaces = await spacesResponse.json();
  expect(spaces.length).toBeGreaterThan(0);

  const saturday = new Date(Date.UTC(2030, 0, 1));
  saturday.setUTCDate(saturday.getUTCDate() + Math.floor(Math.random() * 15000));
  while (saturday.getUTCDay() !== 6) saturday.setUTCDate(saturday.getUTCDate() + 1);
  const fecha = saturday.toISOString().slice(0, 10);

  const first = await request.post('/api/reservas', {
    headers,
    data: {
      espacioId: spaces[0].id,
      fecha,
      horaInicio: '14:00',
      horaFin: '16:00',
      motivo: 'Prueba automática de reserva inicial',
    },
  });
  expect(first.status()).toBe(201);
  const firstBody = await first.json();

  const overlapping = await request.post('/api/reservas', {
    headers,
    data: {
      espacioId: spaces[0].id,
      fecha,
      horaInicio: '15:00',
      horaFin: '17:00',
      motivo: 'Prueba automática de horario superpuesto',
    },
  });
  expect(overlapping.status()).toBe(409);
  await expect(overlapping.json()).resolves.toEqual(
    expect.objectContaining({ mensaje: expect.stringMatching(/ya está reservado/i) })
  );

  const studentAdminList = await request.get('/api/reservas/admin', { headers });
  expect(studentAdminList.status()).toBe(403);

  const adminLogin = await request.post('/api/auth/login', {
    data: { correo: 'admin@espe.edu.ec', password: 'admin2026' },
  });
  expect(adminLogin.ok()).toBeTruthy();
  const adminToken = (await adminLogin.json()).token;
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };

  const adminList = await request.get('/api/reservas/admin', { headers: adminHeaders });
  expect(adminList.ok()).toBeTruthy();
  const reservations = await adminList.json();
  const createdReservation = reservations.find((item) => item.id === firstBody.reserva.id);
  expect(createdReservation).toEqual(expect.objectContaining({
    estudiante_email: 'ceandrade@espe.edu.ec',
    espacio_id: spaces[0].id,
    estado: 'pendiente',
  }));

  const approval = await request.patch(`/api/reservas/${createdReservation.id}/estado`, {
    headers: adminHeaders,
    data: { estado: 'aprobada' },
  });
  expect(approval.ok()).toBeTruthy();
  await expect(approval.json()).resolves.toEqual(
    expect.objectContaining({ reserva: expect.objectContaining({ estado: 'aprobada' }) })
  );
});

test('el administrador accede al panel visual de gestión de reservas', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Correo institucional').fill('admin@espe.edu.ec');
  await page.getByLabel('Contraseña').fill('admin2026');
  await page.getByRole('button', { name: /acceder al sistema/i }).click();

  await page.getByRole('link', { name: /gestión de reservas/i }).click();
  await expect(page).toHaveURL(/\/admin\/reservas$/);
  await expect(page.getByRole('heading', { name: /gestión de reservas/i })).toBeVisible();
  await expect(page.getByText(/disponibilidad automática por horario/i)).toBeVisible();
});
