const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3300; //porta padrão
const { Pool, Client } = require('pg')
const connectionString = 'postgresql://postgres:19972015@localhost:5432/trabalho_sd'
const pool = new Pool({
  connectionString: connectionString,
})



//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router); // requisições que chegam na raiz devem ser enviadas para o router

router.get('/users', (req, response) =>{
  pool.query('SELECT * FROM users', (err, res) => {
    pool.end()
    response.json(res.rows)

  })
  
})

router.post('/createUser', (req, response) => {
  const text = 'INSERT INTO public.users(user_id, name, cpf, email, password) VALUES ($1, $2, $3, $4, $5)'
  const values = [1, 'aaaaa', '122222', 'brian.m.carlson@gmail.com','15454']

  pool.query(text, values, (err, res) => {
    pool.end()
    response.json(res.rows)

  })
})

//inicia o servidor
app.listen(port);
console.log('API funcionando!');


