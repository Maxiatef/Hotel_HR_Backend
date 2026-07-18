const { DataSource } = require('typeorm');
require('dotenv').config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRESQL_ADDON_HOST,
  port: parseInt(process.env.POSTGRESQL_ADDON_PORT || '5432'),
  username: process.env.POSTGRESQL_ADDON_USER,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  database: process.env.POSTGRESQL_ADDON_DB,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await dataSource.initialize();

    // Get first employee
    const employees = await dataSource.query('SELECT id FROM employees LIMIT 1');
    if (!employees[0]) {
      console.log('❌ No employees found');
      await dataSource.destroy();
      return;
    }

    // Get emp1 user
    const users = await dataSource.query("SELECT id, username FROM users WHERE username = 'emp1'");
    if (!users[0]) {
      console.log('❌ emp1 user not found');
      await dataSource.destroy();
      return;
    }

    // Link emp1 to employee
    await dataSource.query('UPDATE users SET "employeeId" = $1 WHERE id = $2',
      [employees[0].id, users[0].id]);

    console.log('✓ Linked emp1 to employee:', employees[0].id);
    await dataSource.destroy();
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
