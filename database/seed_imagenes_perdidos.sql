UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'] WHERE titulo = 'Laptop HP Pavilion';
UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'] WHERE titulo LIKE 'Cedula%';
UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80'] WHERE titulo = 'Calculadora cientifica';
UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'] WHERE titulo LIKE 'Billetera%';
UPDATE objetos_perdidos SET imagenes_url = ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'] WHERE titulo LIKE 'Tablet%';
SELECT id, titulo, tipo, cardinality(imagenes_url) > 0 AS tiene_imagen FROM objetos_perdidos ORDER BY id;