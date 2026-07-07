import express from 'express';
import cors from 'cors'
import executarQuery from './db.js' 

const app = express();

app.use(cors());
app.use(express.json());

app.get('/login', async (req, res) =>{
    let query = `
    SELECT
        id,
        titulo,
        conteudo,
        caminhoImagem
    FROM
        noticias
    ORDER BY
        id DESC
    LIMIT 10
    `;

   let resultado = await executaryQuery(query);
   res.send(resulltado[0]); 
});

app.post('/noticias', async (req, res) => {

    var query = `
        INSERT INTO conteudos (
            titulo,
            conteudo
            caminhoImagem,
            link
        ) VALUES (
         ?,
         ?,
         ?,
         ?)
    `;

    var noticia = [
        req.body.titulo,
        req.body.conteudo,
        req.body.imagem,
        req.body.link
    ];

    let resultado = await executarQuery(query, conteudos);

    try {
        res.send({
            insertId: resultado[0].insertid
        });
    }
    catch {
        console.log(`Erro ao executar Query: ${erro}`);
    }
    finally {
        await conexao.end();
    }
});
 
app.listen(300, () => {
    console.log("servidor online em "); /*adicionar o local host */
});


