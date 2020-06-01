const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const { Pool, Client } = require('pg')


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'trabalho_sd',
    password: '',
    port: 5432,
  })
//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router); // requisições que chegam na raiz devem ser enviadas para o router

router.get('/users', (req, res) =>{
    pool.query('SELECT * FROM users', (err, res) => {
        console.log(err, res)
        pool.end()
      })
   
})

//inicia o servidor
app.listen(port);
console.log('API funcionando!');


