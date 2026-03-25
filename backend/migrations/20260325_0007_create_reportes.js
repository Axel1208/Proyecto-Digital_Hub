exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('reportes');
  if (exists) return;
  return knex.schema.createTable('reportes', function(table) {
    table.increments('id_reporte').primary();
    table.string('estado_reporte', 40).notNullable().defaultTo('pendiente');
    table.timestamp('fecha_reporte').defaultTo(knex.fn.now());
    table.string('archivo', 255).nullable();
    table.string('descripcion', 255).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reportes');
};
