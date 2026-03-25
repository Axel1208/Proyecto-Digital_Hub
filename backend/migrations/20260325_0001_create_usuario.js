exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('usuario');
  if (exists) return;
  return knex.schema.createTable('usuario', function(table) {
    table.increments('id_usuario').primary();
    table.string('nombre', 120).notNullable();
    table.string('correo', 150).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('rol', 30).notNullable().defaultTo('aprendiz');
    table.string('estado', 30).notNullable().defaultTo('activo');
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('usuario');
};
