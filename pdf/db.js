const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: false,
  max: 20, // número máximo de conexões
  idleTimeoutMillis: 30000, // tempo de inatividade em milissegundos
  connectionTimeoutMillis: 2000, // tempo de espera para uma nova conexão em milissegundos
});
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { query };
