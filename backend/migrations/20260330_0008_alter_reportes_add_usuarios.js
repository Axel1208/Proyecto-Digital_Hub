exports.up = async function(knex) {
  const tieneAprendiz = await knex.schema.hasColumn('reportes', 'id_aprendiz');
  const tieneInstructor = await knex.schema.hasColumn('reportes', 'id_instructor');

  // Paso 1: agregar columnas sin FK
  await knex.schema.alterTable('reportes', function(table) {
    if (!tieneAprendiz)   table.integer('id_aprendiz').unsigned().nullable();
    if (!tieneInstructor) table.integer('id_instructor').unsigned().nullable();
  });

  // Paso 2: agregar FK por separado (MySQL requiere esto)
  if (!tieneAprendiz) {
    await knex.raw(`
      ALTER TABLE reportes
      ADD CONSTRAINT reportes_id_aprendiz_foreign
      FOREIGN KEY (id_aprendiz) REFERENCES usuario(id_usuario)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }
  if (!tieneInstructor) {
    await knex.raw(`
      ALTER TABLE reportes
      ADD CONSTRAINT reportes_id_instructor_foreign
      FOREIGN KEY (id_instructor) REFERENCES usuario(id_usuario)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }
};

exports.down = async function(knex) {
  await knex.raw('ALTER TABLE reportes DROP FOREIGN KEY reportes_id_aprendiz_foreign');
  await knex.raw('ALTER TABLE reportes DROP FOREIGN KEY reportes_id_instructor_foreign');
  await knex.schema.alterTable('reportes', function(table) {
    table.dropColumn('id_aprendiz');
    table.dropColumn('id_instructor');
  });
};
