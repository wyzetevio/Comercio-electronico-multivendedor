const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://pochita_db_user:fMu2sZgzCSCbZByTgtkWfq3EdVq0fkBI@dpg-d9bs327avr4c73cuh64g-a.oregon-postgres.render.com/pochita_db',
  ssl: { rejectUnauthorized: false }
});

const sql = `
INSERT INTO usuario (id_usuario, nombres, apellidos, email, password, rol, estado) VALUES (1, 'Admin1', 'Admin', 'admin1@admin.com', '$2a$10$wTf2fFk4hH/R6Q.lU0N8t.H/m5YlH/m5YlH/m5YlH/m5YlH/m5Yl', 'VENDEDOR', true) ON CONFLICT DO NOTHING;
INSERT INTO usuario (id_usuario, nombres, apellidos, email, password, rol, estado) VALUES (2, 'Admin2', 'Admin', 'admin2@admin.com', '$2a$10$wTf2fFk4hH/R6Q.lU0N8t.H/m5YlH/m5YlH/m5YlH/m5YlH/m5Yl', 'VENDEDOR', true) ON CONFLICT DO NOTHING;
INSERT INTO usuario (id_usuario, nombres, apellidos, email, password, rol, estado) VALUES (3, 'Admin3', 'Admin', 'admin3@admin.com', '$2a$10$wTf2fFk4hH/R6Q.lU0N8t.H/m5YlH/m5YlH/m5YlH/m5YlH/m5Yl', 'VENDEDOR', true) ON CONFLICT DO NOTHING;
INSERT INTO usuario (id_usuario, nombres, apellidos, email, password, rol, estado) VALUES (4, 'Admin4', 'Admin', 'admin4@admin.com', '$2a$10$wTf2fFk4hH/R6Q.lU0N8t.H/m5YlH/m5YlH/m5YlH/m5YlH/m5Yl', 'VENDEDOR', true) ON CONFLICT DO NOTHING;

INSERT INTO vendedor (id_vendedor, id_usuario, estado_verificacion, activo) VALUES (1, 1, true, true) ON CONFLICT DO NOTHING;
INSERT INTO vendedor (id_vendedor, id_usuario, estado_verificacion, activo) VALUES (2, 2, true, true) ON CONFLICT DO NOTHING;
INSERT INTO vendedor (id_vendedor, id_usuario, estado_verificacion, activo) VALUES (3, 3, true, true) ON CONFLICT DO NOTHING;
INSERT INTO vendedor (id_vendedor, id_usuario, estado_verificacion, activo) VALUES (4, 4, true, true) ON CONFLICT DO NOTHING;

INSERT INTO tienda (id_tienda, nombre_tienda, descripcion, logo, id_vendedor, activo) VALUES (13, 'Music Shop', 'Tienda', 'https://img.freepik.com/vector-premium/concepto-diseno-logotipo-tienda-musica_96807-539.jpg?w=2000', 1, true) ON CONFLICT DO NOTHING;
INSERT INTO tienda (id_tienda, nombre_tienda, descripcion, logo, id_vendedor, activo) VALUES (14, 'Evans Music', 'Tienda', 'https://images.squarespace-cdn.com/content/v1/598aee2d17bffc79a0c5a2da/1547647614068-OZH0HX13NV8TNKPHUXDA/evans+logo+done.jpg?format=1000w', 2, true) ON CONFLICT DO NOTHING;
INSERT INTO tienda (id_tienda, nombre_tienda, descripcion, logo, id_vendedor, activo) VALUES (3, 'Tienda de Ricardo', 'Tienda', null, 3, true) ON CONFLICT DO NOTHING;
INSERT INTO tienda (id_tienda, nombre_tienda, descripcion, logo, id_vendedor, activo) VALUES (12, 'Insigna', 'Tienda', 'https://marketplace.canva.com/EAGeV7Nt_yg/1/0/1600w/canva-logo-tienda-de-instrumentos-musicales-moderno-ilustrativo-negro-con-blanco-8reom4kEKp8.jpg', 4, true) ON CONFLICT DO NOTHING;

INSERT INTO categoria (id_categoria, nombre, nivel) VALUES (4, 'Instrumentos de musica', 7) ON CONFLICT DO NOTHING;
INSERT INTO categoria (id_categoria, nombre, nivel) VALUES (2, 'Tecnologia', 2) ON CONFLICT DO NOTHING;

INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (13, 'Teclado Yamaha PSR-E373', 'Teclado portátil', 'Yamaha', 1450.0, 5, true, 4, 13) ON CONFLICT DO NOTHING;
INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (11, 'Batería Pearl Export EXX725SPN', 'Set acústico de 5 piezas', 'Pearl', 3200.0, 6, true, 4, 14) ON CONFLICT DO NOTHING;
INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (6, 'ASUS GAMMIN F15', 'Laptop', 'ASUS', 3200.0, 1, true, 2, 3) ON CONFLICT DO NOTHING;
INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (16, 'Batería Electrónica Roland TD-1DMK', 'Batería electrónica', 'Roland', 3900.0, 6, true, 4, 14) ON CONFLICT DO NOTHING;
INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (14, 'Cajón Peruano Profesional Ayllu', 'Cajón peruano', 'Ayllu Percusión', 650.0, 17, true, 4, 12) ON CONFLICT DO NOTHING;
INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (17, 'Piano Digital Casio Privia PX-160', 'Piano digital 88 teclas', 'Casio', 3600.0, 8, true, 4, 14) ON CONFLICT DO NOTHING;
INSERT INTO producto (id_producto, nombre, descripcion, marca, precio, stock, estado, id_categoria, id_tienda) VALUES (15, 'Violín Clásico Stentor Student II', 'Violín macizo', 'Stentor', 1200.0, 23, true, 4, 12) ON CONFLICT DO NOTHING;

`;

client.connect()
  .then(() => client.query(sql))
  .then(() => { console.log("SUCCESS"); process.exit(0); })
  .catch(err => { console.error("FAILED", err); process.exit(1); });
