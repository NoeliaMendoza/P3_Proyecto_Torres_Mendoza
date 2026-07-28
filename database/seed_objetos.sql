-- Datos de demostración para objetos perdidos y encontrados.
-- Es idempotente: no duplica registros cuando ya existen categorías.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categorias_objetos) THEN
    INSERT INTO categorias_objetos (nombre, icono, descripcion) VALUES
      ('Electrónica', '💻', 'Dispositivos electrónicos, laptops, tablets y celulares'),
      ('Documentos', '📄', 'Cédulas, carnets, certificados y documentos personales'),
      ('Mochilas y Bolsos', '🎒', 'Mochilas, maletines, carteras y bolsos'),
      ('Accesorios', '⌚', 'Relojes, gafas, joyería y accesorios personales'),
      ('Útiles Académicos', '📚', 'Libros, cuadernos, carpetas y materiales de estudio'),
      ('Ropa', '👕', 'Prendas de vestir, chaquetas y uniformes'),
      ('Billeteras', '👛', 'Billeteras, monederos y portadocumentos'),
      ('Otros', '📦', 'Otros objetos no categorizados');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM objetos_perdidos) THEN
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
  END IF;
END $$;

-- Normaliza instalaciones creadas anteriormente con texto mal codificado.
UPDATE categorias_objetos AS categoria
SET nombre = datos.nombre,
    icono = datos.icono,
    descripcion = datos.descripcion
FROM (VALUES
  (1, 'Electrónica', '💻', 'Dispositivos electrónicos, laptops, tablets y celulares'),
  (2, 'Documentos', '📄', 'Cédulas, carnets, certificados y documentos personales'),
  (3, 'Mochilas y Bolsos', '🎒', 'Mochilas, maletines, carteras y bolsos'),
  (4, 'Accesorios', '⌚', 'Relojes, gafas, joyería y accesorios personales'),
  (5, 'Útiles Académicos', '📚', 'Libros, cuadernos, carpetas y materiales de estudio'),
  (6, 'Ropa', '👕', 'Prendas de vestir, chaquetas y uniformes'),
  (7, 'Billeteras', '👛', 'Billeteras, monederos y portadocumentos'),
  (8, 'Otros', '📦', 'Otros objetos no categorizados')
) AS datos(id, nombre, icono, descripcion)
WHERE categoria.id = datos.id;

UPDATE objetos_perdidos AS objeto
SET titulo = datos.titulo,
    descripcion = datos.descripcion,
    ubicacion = datos.ubicacion
FROM (VALUES
  ('0999999991', 'Laptop HP Pavilion', 'Laptop color plata con sticker de ESPE en la tapa, dejada en el aula B-204', 'Edificio B, Aula B-204'),
  ('0999999992', 'Cédula de ciudadanía', 'Cédula a nombre de María Torres, número 1712345678', 'Cafetería principal'),
  ('0999999993', 'Mochila negra Totto', 'Mochila negra con compartimiento para laptop, contiene cuadernos', 'Biblioteca, segundo piso'),
  ('0999999994', 'Reloj Casio plateado', 'Reloj digital plateado con correa de acero', 'Canchas deportivas'),
  ('0999999995', 'Calculadora científica', 'Calculadora Casio fx-991LAX, deja de funcionar la tecla ON', 'Laboratorio de física'),
  ('0999999996', 'Chaqueta impermeable azul', 'Chaqueta azul marino marca North Face, talla M', 'Auditorio principal'),
  ('0999999997', 'Billetera marrón', 'Billetera de cuero marrón con $20 y tarjetas bancarias', 'Estacionamiento'),
  ('0999999998', 'Tablet Samsung Galaxy Tab', 'Tablet Samsung color gris con funda negra, fondo de pantalla de programación', 'Aula Magna'),
  ('0999999999', 'Carnet estudiantil ESPE', 'Carnet a nombre de Pedro López, código 2025-2026', 'Entrada principal'),
  ('0999999910', 'Audífonos Bluetooth', 'Audífonos inalámbricos Sony color blanco, estuche de carga incluido', 'Sala de estudio')
) AS datos(contacto, titulo, descripcion, ubicacion)
WHERE objeto.informacion_contacto = datos.contacto;

-- También completa las imágenes cuando el volumen ya contiene los registros.
UPDATE objetos_perdidos
SET imagenes_url = CASE titulo
  WHEN 'Laptop HP Pavilion' THEN ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80']
  WHEN 'Cédula de ciudadanía' THEN ARRAY['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80']
  WHEN 'Mochila negra Totto' THEN ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80']
  WHEN 'Reloj Casio plateado' THEN ARRAY['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80']
  WHEN 'Calculadora científica' THEN ARRAY['https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80']
  WHEN 'Chaqueta impermeable azul' THEN ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80']
  WHEN 'Billetera marrón' THEN ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80']
  WHEN 'Tablet Samsung Galaxy Tab' THEN ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80']
  WHEN 'Carnet estudiantil ESPE' THEN ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80']
  WHEN 'Audífonos Bluetooth' THEN ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
  ELSE imagenes_url
END
WHERE imagenes_url IS NULL OR cardinality(imagenes_url) = 0;
