import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let poolInstance = null;

function getPool() {
    if (!poolInstance) {
        poolInstance = new Pool({
          user: process.env.POSTGRESQL_DB_USERNAME,
          host: process.env.POSTGRESQL_DB_HOST,
          database: process.env.POSTGRESQL_DB_NAME,
          password: process.env.POSTGRESQL_DB_PASSWORD,
          port: process.env.POSTGRESQL_DB_PORT,
          ssl: false,
        });
    }
    return poolInstance;
}

function setupSigintHandler(pool, transactionInProgress) {
    process.on('SIGINT', async () => {
        if (transactionInProgress) {
            console.log("Rolling back transaction...");
            try {
                const client = await pool.connect();
                await client.query("ROLLBACK");
                client.release();
                console.log("Transaction rolled back.");
            } catch (error) {
                console.log("RollbackFailedError", error.message);
                throw new Error('RollbackFailedError' + error.message);
            }
        }
        process.exit(0);
    });
}

async function closePool() {
  if (poolInstance) {
    console.log('Attempting to close PostgreSQL pool...');
    try {
      await poolInstance.end();
      console.log('PostgreSQL pool has been gracefully closed.');
    } catch (err) {
      console.error('Error during PostgreSQL pool shutdown:', err.message);
        }
    poolInstance = null;
  }
}

export {
    getPool,
    closePool,
    setupSigintHandler,
};