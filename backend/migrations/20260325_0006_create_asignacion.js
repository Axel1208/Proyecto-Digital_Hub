exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('asignacion');
  if (exists) return;
  return knex.schema.createTable('asignacion', function(table) {
    table.increments('id').primary();
    table.integer('id_portatil').unsigned().notNullable();
    table.integer('id_ficha').unsigned().notNullable();
    table.timestamp('fecha_asignacion').defaultTo(knex.fn.now());

    table.foreign('id_portatil').references('portatil.id_portatil').onDelete('RESTRICT').onUpdate('CASCADE');
    table.foreign('id_ficha').references('ficha.id').onDelete('RESTRICT').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('asignacion');
};
