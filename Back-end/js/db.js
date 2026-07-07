import mysql from ""; /*atualizar entre aspas */

async function conectar() /* Informações do projeto entre as aspas */ {
    const conexao = await mysqlcreateConnection({
        host: "",
        port: "",
        user: "",
        password: "",
        database: ""
    });
    return conexao;
}

async function executarQuery(sql, params=[]) {
    const conexao = await conectar();

    try {
        const resultado = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        console.log('Erro ao executar a query: ${error.message');
        throw error;
    } finally {
        await conexao.end();
    }
}
export default executarQuery;