exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('portatil');
  if (exists) return;
  return knex.schema.createTable('portatil', function(table) {
    table.increments('id_portatil').primary();
    table.string('num_serie', 120).notNullable().unique();
    table.string('marca', 100).notNullable();
    table.string('tipo', 80).notNullable();
    table.string('modelo', 100).notNullable();
    table.string('estado', 40).notNullable().defaultTo('disponible');
    table.string('ubicacion', 255).nullable();
    table.text('descripcion').nullable();
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('portatil');
};
