const { Sequelize, QueryTypes } = require('sequelize');
const db = require('../models');

async function fixDuplicateProjectIds() {
  const sequelize = db.sequelize;

  try {
    // Find duplicate or null IDs
    const duplicates = await sequelize.query(
      `SELECT id, COUNT(*) as count FROM Projects GROUP BY id HAVING count > 1 OR id IS NULL;`,
      { type: QueryTypes.SELECT }
    );

    if (duplicates.length === 0) {
      console.log('No duplicate or null IDs found in Projects table.');
      return;
    }

    console.log('Duplicate or null IDs found:', duplicates);

    // Fix null IDs by assigning new unique IDs
    await sequelize.query(
      `UPDATE Projects SET id = (SELECT MAX(id) FROM Projects) + 1 WHERE id IS NULL;`
    );

    // Fix duplicate IDs
    for (const dup of duplicates) {
      if (dup.id === null) continue; // Already fixed nulls

      // Get all rows with this duplicate id except one
      const rows = await sequelize.query(
        `SELECT rowid FROM Projects WHERE id = :id ORDER BY rowid ASC;`,
        { replacements: { id: dup.id }, type: QueryTypes.SELECT }
      );

      // Skip the first row, update others
      for (let i = 1; i < rows.length; i++) {
        const newIdResult = await sequelize.query(
          `SELECT MAX(id) as maxId FROM Projects;`,
          { type: QueryTypes.SELECT }
        );
        const newId = newIdResult[0].maxId + 1;

        await sequelize.query(
          `UPDATE Projects SET id = :newId WHERE rowid = :rowid;`,
          { replacements: { newId, rowid: rows[i].rowid } }
        );

        console.log(`Updated duplicate rowid ${rows[i].rowid} to new id ${newId}`);
      }
    }

    console.log('Duplicate and null IDs fixed successfully.');
  } catch (error) {
    console.error('Error fixing duplicate IDs:', error);
  } finally {
    await sequelize.close();
  }
}

fixDuplicateProjectIds();
