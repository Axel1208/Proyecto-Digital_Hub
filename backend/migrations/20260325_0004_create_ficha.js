exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('ficha');
  if (exists) return;
  return knex.schema.createTable('ficha', function(table) {
    table.increments('id').primary();
    table.string('nombre', 150).notNullable();
    table.string('programa_formacion', 150).notNullable();
    table.string('jornada', 100).notNullable();
    table.integer('id_instructor').unsigned().notNullable();
    table.integer('cupo_maximo').unsigned().notNullable().defaultTo(0);
    table.string('estado', 30).notNullable().defaultTo('activa');
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());

    table.foreign('id_instructor').references('usuario.id_usuario').onDelete('RESTRICT').onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ficha');
};
