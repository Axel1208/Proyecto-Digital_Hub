exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('ambiente');
  if (exists) return;
  return knex.schema.createTable('ambiente', function(table) {
    table.increments('id_ambiente').primary();
    table.string('nombre', 150).notNullable();
    table.string('direccion', 255).notNullable();
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ambiente');
};
