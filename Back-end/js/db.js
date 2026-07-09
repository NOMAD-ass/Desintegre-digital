import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Pool de conexões: mais eficiente que abrir/fechar uma conexão a cada
// query (como era feito antes) e evita o erro de "conexão já encerrada"
// quando duas requisições chegam ao mesmo tempo.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

async function executarQuery(sql, params = []) {
    try {
        const [resultado] = await pool.execute(sql, params);
        return resultado;
    } catch (error) {
        console.log(`Erro ao executar a query: ${error.message}`);
        throw error;
    }
}

export default executarQuery;
