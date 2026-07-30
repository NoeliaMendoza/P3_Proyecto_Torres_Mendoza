-- Asignar imágenes SOLO a objetos ENCONTRADOS
UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Mochila negra Totto' AND tipo = 'encontrado';

UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Reloj Casio plateado' AND tipo = 'encontrado';

UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Chaqueta impermeable azul' AND tipo = 'encontrado';

UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Carnet estudiantil ESPE' AND tipo = 'encontrado';

UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Audífonos Bluetooth' AND tipo = 'encontrado';

-- Verificar
SELECT id, titulo, tipo, imagenes_url IS NOT NULL AND cardinality(imagenes_url) > 0 AS tiene_imagen
FROM objetos_perdidos WHERE tipo = 'encontrado' ORDER BY id;