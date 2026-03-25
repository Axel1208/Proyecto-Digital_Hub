exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('ficha_aprendiz');
  if (exists) return;
  return knex.schema.createTable('ficha_aprendiz', function(table) {
    table.increments('id').primary();
    table.integer('id_ficha').unsigned().notNullable();
    table.integer('id_aprendiz').unsigned().notNullable();
    table.timestamp('fecha_union').defaultTo(knex.fn.now());
    table.string('estado', 30).notNullable().defaultTo('activo');

    table.unique(['id_ficha', 'id_aprendiz']);
    table.foreign('id_ficha').references('ficha.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('id_aprendiz').references('usuario.id_usuario').onDelete('CASCADE').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ficha_aprendiz');
};
