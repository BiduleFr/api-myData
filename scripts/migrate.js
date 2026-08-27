require('dotenv').config();
const sequelize = require('../sequelize');

async function migrate() {
  await sequelize.query(`
    ALTER TABLE "DailyEntries"
      ADD COLUMN IF NOT EXISTS "journalEntry" TEXT,
      ADD COLUMN IF NOT EXISTS "answerStates" JSONB NOT NULL DEFAULT '{}'::jsonb;
  `);

  await sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "user_preferences_user_id_unique"
    ON "UserPreferences" ("userId");
  `);

  await sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "daily_entries_user_date_unique"
    ON "DailyEntries" ("userId", "date");
  `);

  console.log('Migration DB terminee.');
}

migrate()
  .catch((error) => {
    console.error('Migration DB echouee:', error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
