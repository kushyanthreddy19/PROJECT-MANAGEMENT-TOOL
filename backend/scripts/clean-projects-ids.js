const { Sequelize, sequelize } = require('../models');
const { QueryTypes } = Sequelize;

async function cleanProjectsIds() {
  try {
    // Find duplicate IDs
    const duplicates = await sequelize.query(
      `SELECT id, COUNT(*) as count FROM Projects GROUP BY id HAVING count > 1 OR id IS NULL;`,
      { type: QueryTypes.SELECT }
    );

    if (duplicates.length === 0) {
      console.log('No duplicate or null IDs found in Projects table.');
      return;
    }

    console.log('Duplicate or null IDs found:', duplicates);

    // Fix duplicates by assigning new unique IDs
    for (const dup of duplicates) {
      if (dup.id === null) {
        // Assign new IDs to rows with null id
        const rows = await sequelize.query(
          `SELECT rowid FROM Projects WHERE id IS NULL;`,
          { type: QueryTypes.SELECT }
        );
        for (const row of rows) {
          const newId = await getNextId();
          await sequelize.query(
            `UPDATE Projects SET id = :newId WHERE rowid = :rowid;`,
            { replacements: { newId, rowid: row.rowid } }
          );
          console.log(`Updated null id rowid ${row.rowid} to id ${newId}`);
        }
      } else {
        // For duplicate ids, keep one and assign new ids to others
        const rows = await sequelize.query(
          `SELECT rowid FROM Projects WHERE id = :id ORDER BY rowid;`,
          { replacements: { id: dup.id }, type: QueryTypes.SELECT }
        );
        // Keep first row, update others
        for (let i = 1; i < rows.length; i++) {
          const newId = await getNextId();
          await sequelize.query(
            `UPDATE Projects SET id = :newId WHERE rowid = :rowid;`,
            { replacements: { newId, rowid: rows[i].rowid } }
          );
          console.log(`Updated duplicate id rowid ${rows[i].rowid} to id ${newId}`);
        }
      }
    }

    console.log('Duplicate and null IDs cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning Projects IDs:', error);
  } finally {
    await sequelize.close();
  }
}

async function getNextId() {
  const result = await sequelize.query(
    `SELECT MAX(id) as maxId FROM Projects;`,
    { type: QueryTypes.SELECT }
  );
  return (result[0].maxId || 0) + 1;
}

cleanProjectsIds();
