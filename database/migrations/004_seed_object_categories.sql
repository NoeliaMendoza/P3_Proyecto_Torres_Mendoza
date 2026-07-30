INSERT INTO categorias_objetos (nombre, icono, descripcion)
VALUES
  ('Electrónica', 'dispositivo', 'Dispositivos electrónicos, laptops, tablets y celulares'),
  ('Documentos', 'documento', 'Cédulas, carnets, certificados y documentos personales'),
  ('Mochilas y Bolsos', 'mochila', 'Mochilas, maletines, carteras y bolsos'),
  ('Accesorios', 'accesorio', 'Relojes, gafas, joyería y accesorios personales'),
  ('Útiles Académicos', 'libro', 'Libros, cuadernos, carpetas y materiales de estudio'),
  ('Ropa', 'ropa', 'Prendas de vestir, chaquetas y uniformes'),
  ('Billeteras', 'billetera', 'Billeteras, monederos y portadocumentos'),
  ('Otros', 'otro', 'Otros objetos no categorizados')
ON CONFLICT (nombre) DO UPDATE SET
  icono = EXCLUDED.icono,
  descripcion = EXCLUDED.descripcion;
