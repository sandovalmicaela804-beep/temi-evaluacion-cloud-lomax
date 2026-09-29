-- ============================================
-- LOMAX - DATOS INICIALES
-- 3 categorías + 20 productos
-- ============================================

-- CATEGORÍAS
INSERT INTO categorias (nombre)
VALUES
    ('Tecnologia'),
    ('Hogar'),
    ('Oficina')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================
-- 20 PRODUCTOS
-- ============================================

INSERT INTO productos
    (codigo, nombre, descripcion, precio, categoria_id, estado)
VALUES

-- TECNOLOGIA (7)
(
    'TEC001',
    'Teclado mecanico',
    'Teclado mecanico con conexion USB.',
    250.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),
(
    'TEC002',
    'Mouse inalambrico',
    'Mouse inalambrico ergonomico.',
    120.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),
(
    'TEC003',
    'Audifonos Bluetooth',
    'Audifonos Bluetooth con microfono integrado.',
    180.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),
(
    'TEC004',
    'Webcam HD',
    'Camara web HD para videollamadas.',
    220.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),
(
    'TEC005',
    'Memoria USB 64GB',
    'Memoria USB de 64GB.',
    75.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),
(
    'TEC006',
    'Parlante Bluetooth',
    'Parlante portatil con conexion Bluetooth.',
    210.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),
(
    'TEC007',
    'Teclado inalambrico',
    'Teclado compacto de conexion inalambrica.',
    160.00,
    (SELECT id FROM categorias WHERE nombre = 'Tecnologia'),
    'PUBLICADO'
),


-- HOGAR (7)
(
    'HOG001',
    'Lampara LED',
    'Lampara LED para escritorio o dormitorio.',
    85.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),
(
    'HOG002',
    'Taza termica',
    'Taza termica reutilizable.',
    65.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),
(
    'HOG003',
    'Botella de agua',
    'Botella reutilizable para agua.',
    55.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),
(
    'HOG004',
    'Organizador plastico',
    'Organizador para objetos pequeños.',
    45.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),
(
    'HOG005',
    'Almohada',
    'Almohada para descanso.',
    90.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),
(
    'HOG006',
    'Reloj de pared',
    'Reloj analogico decorativo.',
    110.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),
(
    'HOG007',
    'Cesta organizadora',
    'Cesta para organizar objetos del hogar.',
    70.00,
    (SELECT id FROM categorias WHERE nombre = 'Hogar'),
    'PUBLICADO'
),


-- OFICINA (6)
(
    'OFI001',
    'Cuaderno universitario',
    'Cuaderno de hojas para apuntes.',
    25.00,
    (SELECT id FROM categorias WHERE nombre = 'Oficina'),
    'PUBLICADO'
),
(
    'OFI002',
    'Agenda semanal',
    'Agenda para organizar actividades.',
    40.00,
    (SELECT id FROM categorias WHERE nombre = 'Oficina'),
    'PUBLICADO'
),
(
    'OFI003',
    'Lapiceros',
    'Set de lapiceros de tinta azul.',
    20.00,
    (SELECT id FROM categorias WHERE nombre = 'Oficina'),
    'PUBLICADO'
),
(
    'OFI004',
    'Carpeta archivadora',
    'Carpeta para documentos.',
    35.00,
    (SELECT id FROM categorias WHERE nombre = 'Oficina'),
    'PUBLICADO'
),
(
    'OFI005',
    'Grapadora',
    'Grapadora metalica para oficina.',
    30.00,
    (SELECT id FROM categorias WHERE nombre = 'Oficina'),
    'PUBLICADO'
),
(
    'OFI006',
    'Calculadora',
    'Calculadora basica para operaciones.',
    60.00,
    (SELECT id FROM categorias WHERE nombre = 'Oficina'),
    'PUBLICADO'
)

ON CONFLICT (codigo) DO NOTHING;