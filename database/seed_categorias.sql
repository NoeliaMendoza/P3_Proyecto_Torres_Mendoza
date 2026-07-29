INSERT INTO categorias_objetos (nombre, icono, descripcion) VALUES
  ('Electrónica', 'electronica', 'Dispositivos electrónicos, laptops, tablets y celulares'),
  ('Documentos', 'documentos', 'Cédulas, carnets, certificados y documentos personales'),
  ('Mochilas y Bolsos', 'mochilas', 'Mochilas, maletines, carteras y bolsos'),
  ('Accesorios', 'accesorios', 'Relojes, gafas, joyería y accesorios personales'),
  ('Útiles Académicos', 'utiles', 'Libros, cuadernos, carpetas y materiales de estudio'),
  ('Ropa', 'ropa', 'Prendas de vestir, chaquetas y uniformes'),
  ('Billeteras', 'billeteras', 'Billeteras, monederos y portadocumentos'),
  ('Otros', 'otros', 'Otros objetos no categorizados')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO objetos_perdidos
  (titulo, descripcion, id_categoria, tipo, estado, ubicacion, fecha_evento, informacion_contacto)
VALUES
  ('Laptop HP Pavilion', 'Laptop color plata con sticker de ESPE en la tapa, dejada en el aula B-204', 1, 'perdido', 'abierto', 'Edificio B, Aula B-204', '2026-07-25', '0999999991'),
  ('Cédula de ciudadanía', 'Cédula a nombre de María Torres, número 1712345678', 2, 'perdido', 'abierto', 'Cafetería principal', '2026-07-26', '0999999992'),
  ('Mochila negra Totto', 'Mochila negra con compartimiento para laptop, contiene cuadernos', 3, 'encontrado', 'abierto', 'Biblioteca, segundo piso', '2026-07-26', '0999999993'),
  ('Reloj Casio plateado', 'Reloj digital plateado con correa de acero', 4, 'encontrado', 'abierto', 'Canchas deportivas', '2026-07-24', '0999999994'),
  ('Calculadora científica', 'Calculadora Casio fx-991LAX, deja de funcionar la tecla ON', 5, 'perdido', 'abierto', 'Laboratorio de física', '2026-07-23', '0999999995'),
  ('Chaqueta impermeable azul', 'Chaqueta azul marino marca North Face, talla M', 6, 'encontrado', 'abierto', 'Auditorio principal', '2026-07-22', '0999999996'),
  ('Billetera marrón', 'Billetera de cuero marrón con $20 y tarjetas bancarias', 7, 'perdido', 'abierto', 'Estacionamiento', '2026-07-21', '0999999997'),
  ('Tablet Samsung Galaxy Tab', 'Tablet Samsung color gris con funda negra, fondo de pantalla de programación', 1, 'perdido', 'abierto', 'Aula Magna', '2026-07-20', '0999999998'),
  ('Carnet estudiantil ESPE', 'Carnet a nombre de Pedro López, código 2025-2026', 2, 'encontrado', 'abierto', 'Entrada principal', '2026-07-19', '0999999999'),
  ('Audífonos Bluetooth', 'Audífonos inalámbricos Sony color blanco, estuche de carga incluido', 1, 'encontrado', 'abierto', 'Sala de estudio', '2026-07-18', '0999999910');