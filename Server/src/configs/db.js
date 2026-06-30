import pg from 'pg';
import { configDotenv } from 'dotenv';
configDotenv();

const { Pool } = pg;

pg.defaults.Promise = global.Promise;

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
