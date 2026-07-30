-- Script para asignar imágenes a objetos perdidos/encontrados
-- Ejecutar en pgAdmin (SQL Editor) o con psql

-- 1. Asignar imágenes una por una (por título)
UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Laptop HP Pavilion' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Cédula de ciudadanía' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Mochila negra Totto' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Reloj Casio plateado' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Calculadora científica' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Chaqueta impermeable azul' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Billetera marrón' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Tablet Samsung Galaxy Tab' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Carnet estudiantil ESPE' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

UPDATE objetos_perdidos
SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
WHERE titulo = 'Audífonos Bluetooth' AND (imagenes_url IS NULL OR cardinality(imagenes_url) = 0);

-- 2. Verificar cuáles tienen imagen y cuáles no
SELECT id, titulo, tipo,
  CASE WHEN imagenes_url IS NULL OR cardinality(imagenes_url) = 0
    THEN 'SIN IMAGEN' ELSE 'CON IMAGEN' END AS estado_imagen
FROM objetos_perdidos
ORDER BY id;