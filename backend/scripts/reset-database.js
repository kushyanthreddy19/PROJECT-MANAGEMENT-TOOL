const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dbPath = path.join(__dirname, '../database.sqlite');

async function resetDatabase() {
  try {
    // Delete existing database file if exists
    if (fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
        console.log('Deleted existing database file.');
      } catch (unlinkErr) {
        console.error('Failed to delete database file:', unlinkErr);
        return;
      }
    } else {
      console.log('No existing database file found.');
    }

    // Run migrations with explicit config and migrations path
    console.log('Running migrations...');
    exec('npx sequelize-cli db:migrate --config backend/config/config.json --migrations-path backend/migrations', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Migration stderr: ${stderr}`);
        return;
      }
      console.log(`Migration output:\n${stdout}`);

      // Optionally, run seeders here if you have any
      // exec('npx sequelize-cli db:seed:all --config backend/config/config.json --seeders-path backend/seeders', (seedError, seedStdout, seedStderr) => {
      //   if (seedError) {
      //     console.error(`Seeder error: ${seedError.message}`);
      //     return;
      //   }
      //   if (seedStderr) {
      //     console.error(`Seeder stderr: ${seedStderr}`);
      //     return;
      //   }
      //   console.log(`Seeder output:\n${seedStdout}`);
      // });

      console.log('Database reset and migrations completed.');
    });
  } catch (err) {
    console.error('Error resetting database:', err);
  }
}

resetDatabase();
