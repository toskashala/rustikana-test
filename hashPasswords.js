const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function hashPasswords() {
    try {
        const result = await pool.query('SELECT id, username, password FROM admins');
        const users = result.rows;

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
            console.log(`Password for user ${user.username} has been hashed.`);
        }
        
        console.log('All passwords have been rehashed successfully.');
    } catch (error) {
        console.error('Error hashing passwords:', error);
    } finally {
        pool.end();
    }
}

hashPasswords();
