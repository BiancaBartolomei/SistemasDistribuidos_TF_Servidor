const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3300; //porta padrão
const { Pool, Client } = require('pg')
const connectionString = 'postgresql://postgres:suasenha@localhost:5432/trabalho_sd'
const pool = new Client({
  connectionString: connectionString,
})

pool.connect()



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
    // pool.end()
    response.json(res)

  })
})

router.delete('/deleteUsers/:id', (req, response) =>{
  const id = parseInt(req.params.id);
  pool.query(`DELETE FROM users where id=${id}`, (err, res) => {
    pool.end()
    response.json(res.rows)

  })
  
})

router.post('/createRequest', (req, response) => {
  const text = 'INSERT INTO public.requests(place_id, user_id, name, cnpj, area, max_qnt) VALUES ($1, $2, $3, $4, $5, $6)'
  const values = [req.body.placeId, req.body.userId, req.body.name, req.body.cnpj, req.body.area, req.body.maxQnt]
  console.log(req.body)
  pool.query(text, values, (err, res) => {
    response.json(res)

  })
})

router.patch('/place/:id', (req, response) =>{
  const id = parseInt(req.params.id);
  const name = req.body.name.substring(0,150);
  const cnpj = req.body.cnpj.substring(0,11);
  const area = parseInt(req.body.area.substring(0,50));
  const max_qnt = req.body.max_qnt.substring(0,50);
  
  pool.query(`UPDATE places SET name='${name}',cnpj='${cnpj}',area=${area},max_qnt='${max_qnt}' WHERE id=${id}`, (err, res) => {
      // pool.end()
      response.json(res)
      console.log(res)
    })
 
})


router.get('/place/:name', (req, response) =>{
  pool.query(`SELECT * FROM places WHERE similarity(name, '${req.params.name.replace("_", " ")}') > 0.5`, (err, res) => {
      // pool.end()
      response.json(res.rows)
    })
    console.log("Get places")
 
})

router.post('/request', (req, response) =>{
  const id = parseInt(req.params.id);
  console.log(req.body.name)
  const user_id = req.body.user;
  const name = req.body.name;
  const cnpj = req.body.cnpj;
  const area = parseInt(req.body.area);
  const max_qnt = req.body.max_qnt;
  console.log(name)
  
  pool.query(`INSERT INTO requests VALUES (id=${id}, user_id='${user_id}', name='${name}',cnpj='${cnpj}',area=${area},max_qnt='${max_qnt}')`, (err, res) => {
      // pool.end()
      response.json(res)
    })
 
})

//inicia o servidor
app.listen(port);
console.log('API funcionando!');


