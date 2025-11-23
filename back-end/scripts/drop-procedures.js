require('dotenv').config();
const { pool } = require('../config/database');

async function dropProcedures() {
  try {
    console.log('Dropping procedures...');
    
    await pool.query('DROP PROCEDURE IF EXISTS GetStudentSessions');
    console.log('✓ Dropped GetStudentSessions');
    
    await pool.query('DROP PROCEDURE IF EXISTS GetTutorUpcomingSessions');
    console.log('✓ Dropped GetTutorUpcomingSessions');
    
    console.log('\nProcedures dropped successfully. Run npm run migrate to recreate them.');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping procedures:', error);
    process.exit(1);
  }
}

dropProcedures();
