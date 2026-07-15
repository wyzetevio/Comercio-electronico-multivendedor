const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://pochita_db_user:fMu2sZgzCSCbZByTgtkWfq3EdVq0fkBI@dpg-d9bs327avr4c73cuh64g-a.oregon-postgres.render.com/pochita_db',
  ssl: { rejectUnauthorized: false }
});

const sql = `
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), coalesce(max(id_usuario),0) + 1, false) FROM usuario;
SELECT setval(pg_get_serial_sequence('vendedor', 'id_vendedor'), coalesce(max(id_vendedor),0) + 1, false) FROM vendedor;
SELECT setval(pg_get_serial_sequence('tienda', 'id_tienda'), coalesce(max(id_tienda),0) + 1, false) FROM tienda;
SELECT setval(pg_get_serial_sequence('categoria', 'id_categoria'), coalesce(max(id_categoria),0) + 1, false) FROM categoria;
SELECT setval(pg_get_serial_sequence('producto', 'id_producto'), coalesce(max(id_producto),0) + 1, false) FROM producto;
`;

client.connect()
  .then(() => client.query(sql))
  .then(() => { console.log("SUCCESS"); process.exit(0); })
  .catch(err => { console.error("FAILED", err); process.exit(1); });
